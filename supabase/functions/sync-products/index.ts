
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting product sync from Digiflazz...');

    // Get products from Digiflazz
    const products = await getDigiflazzProducts();
    
    if (!products || !Array.isArray(products)) {
      console.error('No products received from Digiflazz or invalid format');
      throw new Error('Failed to fetch products from Digiflazz');
    }

    console.log(`Received ${products.length} products from Digiflazz`);

    // Filter products to only include relevant categories
    const relevantCategories = ['Pulsa', 'Data', 'PLN', 'E-Money', 'Games', 'Voucher'];
    const filteredProducts = products.filter(product => 
      relevantCategories.includes(product.category) && 
      product.buyer_product_status && 
      product.seller_product_status
    );

    console.log(`Filtered to ${filteredProducts.length} relevant active products`);

    // Process products in batches
    const batchSize = 50;
    let syncedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < filteredProducts.length; i += batchSize) {
      const batch = filteredProducts.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(filteredProducts.length/batchSize)}`);
      
      for (const product of batch) {
        try {
          // Map category to our system
          const mappedCategory = mapCategory(product.category);
          
          // Calculate buyer price with appropriate margin based on category
          const margin = getMarginByCategory(product.category);
          const buyerPrice = parseFloat(product.price.toString()) + margin;

          // Upsert product
          const { error } = await supabaseClient
            .from('products')
            .upsert({
              sku: product.buyer_sku_code,
              product_name: product.product_name,
              category: mappedCategory,
              brand: normalizeBrand(product.brand || 'Unknown'),
              type: product.type || 'General',
              seller_price: parseFloat(product.price.toString()),
              buyer_price: buyerPrice,
              buyer_sku_code: product.buyer_sku_code,
              start_cut_off: product.start_cut_off || '00:00',
              end_cut_off: product.end_cut_off || '23:59',
              description: product.desc || product.product_name,
              is_active: true,
            }, {
              onConflict: 'sku'
            });

          if (error) {
            console.error('Error upserting product:', product.buyer_sku_code, error.message);
            errorCount++;
          } else {
            syncedCount++;
            console.log(`Synced: ${product.product_name} (${product.buyer_sku_code})`);
          }
        } catch (err) {
          console.error('Error processing product:', product.buyer_sku_code, err);
          errorCount++;
        }
      }
    }

    console.log(`Sync completed: ${syncedCount} synced, ${errorCount} errors`);

    return new Response(JSON.stringify({ 
      success: true,
      synced_count: syncedCount,
      error_count: errorCount,
      total_products: filteredProducts.length,
      total_received: products.length
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Product sync error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getDigiflazzProducts() {
  const username = Deno.env.get('DIGIFLAZZ_USERNAME');
  const apiKey = Deno.env.get('DIGIFLAZZ_API_KEY');
  
  if (!username || !apiKey) {
    throw new Error('Digiflazz credentials not configured');
  }

  const cmd = 'prepaid';
  const sign = await generateSignature(username, apiKey, cmd);
  
  const payload = {
    cmd,
    username,
    sign,
  };

  console.log('Calling Digiflazz price-list API...');

  try {
    const response = await fetch('https://api.digiflazz.com/v1/price-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Digiflazz API response status:', result.success ? 'success' : 'failed');
    
    if (!result.success) {
      console.error('Digiflazz API error details:', result);
      throw new Error(result.message || 'Failed to fetch products from Digiflazz');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error calling Digiflazz API:', error);
    throw new Error(`Failed to connect to Digiflazz API: ${error.message}`);
  }
}

function mapCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'Pulsa': 'pulsa',
    'Data': 'data', 
    'PLN': 'electricity',
    'PDAM': 'water',
    'E-Money': 'emoney',
    'Games': 'gaming',
    'Voucher': 'voucher',
    'Aktivasi Perdana': 'activation',
    'Aktivasi Voucher': 'voucher',
  };
  
  return categoryMap[category] || category.toLowerCase().replace(/\s+/g, '_');
}

function normalizeBrand(brand: string): string {
  const brandMap: { [key: string]: string } = {
    'TELKOMSEL': 'telkomsel',
    'INDOSAT': 'indosat', 
    'XL AXIATA': 'xl',
    'TRI': 'tri',
    'SMARTFREN': 'smartfren',
    'AXIS': 'axis',
    'PLN': 'pln',
  };
  
  return brandMap[brand.toUpperCase()] || brand.toLowerCase();
}

function getMarginByCategory(category: string): number {
  const marginMap: { [key: string]: number } = {
    'Pulsa': 500,
    'Data': 1000,
    'PLN': 500,
    'E-Money': 300,
    'Games': 1000,
    'Voucher': 500,
  };
  
  return marginMap[category] || 500;
}

async function generateSignature(username: string, apiKey: string, cmd: string): Promise<string> {
  const text = username + apiKey + cmd;
  
  try {
    // Import crypto-js with proper ESM syntax
    const { default: CryptoJS } = await import('https://esm.sh/crypto-js@4.1.1');
    const hash = CryptoJS.MD5(text).toString();
    
    console.log('Generated MD5 signature successfully');
    return hash;
  } catch (error) {
    console.error('Error generating MD5 signature:', error);
    throw new Error('Failed to generate authentication signature');
  }
}
