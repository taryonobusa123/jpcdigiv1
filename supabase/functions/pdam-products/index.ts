
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  // Digiflazz credentials (pakai dari Supabase secrets)
  const username = Deno.env.get("DIGIFLAZZ_USERNAME");
  const sign = Deno.env.get("DIGIFLAZZ_PDAM_SIGNATURE"); // atau SIGN umum, jika perlu
  
  // Request ke Digiflazz price-list (produk PDAM)
  try {
    const body = {
      cmd: "prepaid",
      username,
      sign,
    };
    const resp = await fetch("https://api.digiflazz.com/v1/price-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const digiflazzResult = await resp.json();
    // Filter hanya produk dengan kategori "PDAM"
    const pdamProducts = (digiflazzResult.data || []).filter(p => (p.category || '').toUpperCase() === "PDAM");

    return new Response(JSON.stringify({ success: true, products: pdamProducts }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      message: e.message || "Gagal mengambil produk PDAM",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
