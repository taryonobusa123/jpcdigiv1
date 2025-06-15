
import React from "react";
import { PackageCheck } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

const deliverySteps = [
  {
    title: "Pilih Produk",
    description: "Temukan dan pilih produk yang ingin dikirimkan."
  },
  {
    title: "Isi Data Penerima",
    description: "Masukkan alamat dan data penerima paket secara lengkap."
  },
  {
    title: "Pembayaran",
    description: "Lakukan pembayaran dengan berbagai metode yang tersedia."
  },
  {
    title: "Proses Pengiriman",
    description: "Pesanan Anda akan segera diproses dan dikirimkan ke alamat tujuan."
  },
  {
    title: "Lacak Status",
    description: "Pantau status pengiriman secara real-time melalui aplikasi ini."
  }
];

const Delivery: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5 flex items-center space-x-3">
        <PackageCheck size={32} />
        <div>
          <h1 className="text-xl font-bold">Delivery Service</h1>
          <p className="text-sm text-blue-100">Pengiriman cepat, aman, dan mudah</p>
        </div>
      </div>

      {/* Steps */}
      <div className="p-4 flex-1">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Cara Kerja Pengiriman</h2>
        <ol className="space-y-6">
          {deliverySteps.map((step, idx) => (
            <li key={step.title} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-700">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-4 pb-24">
        <div className="rounded-xl overflow-hidden shadow-lg mt-4">
          <img 
            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80"
            alt="Ilustrasi paket delivery"
            className="w-full h-44 object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Delivery;
