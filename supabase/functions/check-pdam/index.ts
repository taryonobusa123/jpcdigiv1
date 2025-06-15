
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// HEADER CORS WAJIB!
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS pre-flight OPTIONS
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const { region, customer_number } = await req.json();

    // Validasi input sederhana
    if (!region || !customer_number) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Wilayah dan nomor pelanggan wajib diisi.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // === REQUEST API Digiflazz (PDAM Inquiry) ===
    // Ganti sesuai kebutuhan/secret Anda. Ini contoh payload untuk API Digiflazz (cek dokumentasi PDAM Digiflazz)
    const reqBody = {
      username: Deno.env.get("DIGIFLAZZ_USERNAME"),
      sign: Deno.env.get("DIGIFLAZZ_PDAM_SIGNATURE"),
      customer_no: customer_number,
      kode_produk: region, // Ganti sesuai skema produk Digiflazz Anda
    };

    let digiflazzResponse;
    try {
      const res = await fetch("https://api.digiflazz.com/v1/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      digiflazzResponse = await res.json();
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Gagal terhubung ke server Digiflazz",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Deliver Digiflazz response to frontend, wrap for safety
    if (digiflazzResponse && digiflazzResponse.data && digiflazzResponse.data.status === "Sukses") {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            customer_name: digiflazzResponse.data.nama_pelanggan || "-",
            customer_number: customer_number,
            amount: digiflazzResponse.data.tagihan || 0,
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Jika gagal, kirim pesan error
    return new Response(
      JSON.stringify({
        success: false,
        message: digiflazzResponse?.data?.message || "Gagal memeriksa nomor pelanggan",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: (error && error.message) || "Internal server error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
