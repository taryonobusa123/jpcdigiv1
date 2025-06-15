
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TopupInfo = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Informasi Penting:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Nominal transfer akan ditambah angka random untuk identifikasi</li>
          <li>• Saldo akan masuk setelah admin mengkonfirmasi pembayaran</li>
          <li>• Proses konfirmasi biasanya 1-24 jam pada hari kerja</li>
          <li>• Pastikan nominal transfer sesuai dengan yang diminta</li>
          <li>• Simpan bukti transfer untuk keperluan konfirmasi</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopupInfo;
