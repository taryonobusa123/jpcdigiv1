
import React, { useState } from 'react';
import { ArrowLeft, Droplets, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePDAMCheck } from '@/hooks/usePDAMCheck';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const REGIONS = [
  'PDAM Jakarta',
  'PDAM Surabaya',
  'PDAM Bandung',
  'PDAM Semarang',
  'PDAM Medan',
  'PDAM Makassar'
];

const PDAM = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  
  const [customerData, setCustomerData] = useState<any>(null);
  // Fix: use isPending instead of isLoading
  const { mutate, isPending } = usePDAMCheck();

  const handleCheck = () => {
    setCustomerData(null);
    mutate(
      { wilayah: selectedRegion, nomorPelanggan: customerNumber },
      {
        onSuccess: (data: any) => {
          setCustomerData(data.data);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Link to="/pay-bills" className="p-2 hover:bg-white/20 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Droplets className="w-6 h-6" /> PDAM
          </h1>
        </div>
      </div>
      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl shadow-md p-4 mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Pilih Wilayah
          </h3>
          <div className="space-y-2">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  selectedRegion === region
                    ? 'border-blue-500 bg-blue-50 font-bold'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
        {selectedRegion && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nomor Pelanggan
            </h3>
            <Input
              type="text"
              value={customerNumber}
              onChange={e => setCustomerNumber(e.target.value)}
              placeholder="Masukkan nomor pelanggan"
              className="mb-3"
              disabled={isPending}
            />
            <Button
              className="w-full"
              onClick={handleCheck}
              disabled={!customerNumber || isPending}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Mengecek...
                </>
              ) : (
                <>
                  <Search className="mr-2 w-4 h-4" /> Cek Tagihan
                </>
              )}
            </Button>
            {customerData && (
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="font-bold text-gray-700 mb-1">
                  Nama: {customerData.customer_name || '-'}
                </div>
                <div className="text-gray-700 mb-1">
                  Wilayah: {selectedRegion}
                </div>
                <div className="text-gray-700 mb-1">
                  Nomor Pelanggan: {customerData.customer_number || customerNumber}
                </div>
                <div className="text-gray-700">
                  Tagihan: <b>Rp{customerData.amount ?? '-'}</b>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDAM;

