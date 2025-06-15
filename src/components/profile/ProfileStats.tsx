
import React from 'react';

export default function ProfileStats() {
  return (
    <div className="px-4 -mt-6 relative z-10 mb-6">
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-gray-800">245</h4>
            <p className="text-gray-500 text-xs">Transaksi</p>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <h4 className="text-2xl font-bold text-gray-800">12</h4>
            <p className="text-gray-500 text-xs">Bulan Aktif</p>
          </div>
          <div className="text-center">
            <h4 className="text-2xl font-bold text-gray-800">4.8</h4>
            <p className="text-gray-500 text-xs">Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}
