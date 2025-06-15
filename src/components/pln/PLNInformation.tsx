
import React from 'react';
import { Info } from 'lucide-react';

const PLNInformation = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-800 mb-2">Informasi Penting</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Token akan dikirim via SMS ke nomor terdaftar</li>
            <li>• Pastikan nomor meter/ID pelanggan sudah benar</li>
            <li>• Token berlaku selama 3 bulan sejak pembelian</li>
            <li>• Simpan struk sebagai bukti pembelian</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PLNInformation;
