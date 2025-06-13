
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

    // Get products from Digiflazz
    const products = await getDigiflazzProducts();
    
    if (!products || !Array.isArray(products)) {
      throw new Error('Failed to fetch products from Digiflazz');
    }

    console.log(`Syncing ${products.length} products from Digiflazz`);

    // Process products in batches
    const batchSize = 100;
    let syncedCount = 0;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      for (const product of batch) {
        try {
          // Upsert product
          const { error } = await supabaseClient
            .from('products')
            .upsert({
              sku: product.buyer_sku_code,
              product_name: product.product_name,
              category: mapCategory(product.category),
              brand: product.brand,
              type: product.type,
              seller_price: parseFloat(product.price),
              buyer_price: parseFloat(product.price) + 500, // Add margin
              buyer_sku_code: product.buyer_sku_code,
              start_cut_off: product.start_cut_off,
              end_cut_off: product.end_cut_off,
              description: product.desc || product.product_name,
              is_active: product.seller_product_status === true,
            }, {
              onConflict: 'sku'
            });

          if (error) {
            console.error('Error upserting product:', product.buyer_sku_code, error);
          } else {
            syncedCount++;
          }
        } catch (err) {
          console.error('Error processing product:', product.buyer_sku_code, err);
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      synced_count: syncedCount,
      total_products: products.length
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Product sync error:', error);
    return new Response(JSON.stringify({ 
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

  const response = await fetch('https://api.digiflazz.com/v1/price-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch products');
  }
  
  return result.data;
}

function mapCategory(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'Pulsa': 'pulsa',
    'Data': 'data',
    'PLN': 'electricity',
    'PDAM': 'water',
    'E-Money': 'emoney',
    'Game': 'gaming',
    'Voucher': 'voucher',
  };
  
  return categoryMap[category] || category.toLowerCase();
}

async function generateSignature(username: string, apiKey: string, cmd: string): Promise<string> {
  const text = username + apiKey + cmd;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
