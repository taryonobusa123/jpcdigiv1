
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

    // Check if credentials are available
    const username = Deno.env.get('DIGIFLAZZ_USERNAME');
    const apiKey = Deno.env.get('DIGIFLAZZ_API_KEY');
    
    if (!username || !apiKey) {
      console.error('Missing Digiflazz credentials');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Digiflazz credentials not configured. Please check DIGIFLAZZ_USERNAME and DIGIFLAZZ_API_KEY secrets.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get products from Digiflazz
    let products;
    try {
      products = await getDigiflazzProducts();
    } catch (error) {
      console.error('Failed to fetch from Digiflazz:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: `Failed to connect to Digiflazz API: ${error.message}`,
        details: 'Please check your Digiflazz credentials and try again.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (!products || !Array.isArray(products)) {
      console.error('No products received from Digiflazz or invalid format');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'No products received from Digiflazz or invalid response format',
        received_data: products ? 'Invalid format' : 'No data'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

    if (filteredProducts.length === 0) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'No active products found in relevant categories',
        total_received: products.length,
        categories_checked: relevantCategories
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process products in batches
    const batchSize = 50;
    let syncedCount = 0;
    let errorCount = 0;
    const errors = [];
    
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
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'sku'
            });

          if (error) {
            console.error('Error upserting product:', product.buyer_sku_code, error.message);
            errorCount++;
            errors.push(`${product.buyer_sku_code}: ${error.message}`);
          } else {
            syncedCount++;
            if (syncedCount % 10 === 0) {
              console.log(`Progress: ${syncedCount} products synced...`);
            }
          }
        } catch (err) {
          console.error('Error processing product:', product.buyer_sku_code, err);
          errorCount++;
          errors.push(`${product.buyer_sku_code}: ${err.message}`);
        }
      }
    }

    console.log(`Sync completed: ${syncedCount} synced, ${errorCount} errors`);

    return new Response(JSON.stringify({ 
      success: true,
      synced_count: syncedCount,
      error_count: errorCount,
      total_products: filteredProducts.length,
      total_received: products.length,
      errors: errorCount > 0 ? errors.slice(0, 10) : [], // Show first 10 errors
      message: `Successfully synced ${syncedCount} products from Digiflazz${errorCount > 0 ? ` with ${errorCount} errors` : ''}`
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Product sync error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      stack: error.stack
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
  console.log('Username:', username);
  console.log('API URL: https://api.digiflazz.com/v1/price-list');

  try {
    const response = await fetch('https://api.digiflazz.com/v1/price-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Supabase-Edge-Function/1.0',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('Digiflazz API response received');
    console.log('Response success field:', result.success);
    
    if (result.success === false) {
      console.error('Digiflazz API returned success: false');
      console.error('Error message:', result.message);
      console.error('Full response:', JSON.stringify(result, null, 2));
      throw new Error(result.message || 'Digiflazz API returned success: false');
    }

    if (!result.data || !Array.isArray(result.data)) {
      console.error('Invalid data format from Digiflazz');
      console.error('Data type:', typeof result.data);
      console.error('Is array:', Array.isArray(result.data));
      throw new Error('Invalid response format: data is not an array');
    }
    
    console.log(`Successfully received ${result.data.length} products from Digiflazz`);
    return result.data;
  } catch (error) {
    console.error('Error calling Digiflazz API:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Digiflazz API. Please check your internet connection.');
    }
    throw error;
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
    'XL': 'xl',
    'TRI': 'tri',
    'SMARTFREN': 'smartfren',
    'AXIS': 'axis',
    'PLN': 'pln',
    'DANA': 'dana',
    'GO PAY': 'gopay',
    'GOPAY': 'gopay',
    'OVO': 'ovo',
    'FREE FIRE': 'freefire',
    'MOBILE LEGENDS': 'mobilelegends',
  };
  
  return brandMap[brand.toUpperCase()] || brand.toLowerCase().replace(/\s+/g, '');
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
