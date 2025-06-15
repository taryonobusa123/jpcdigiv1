
import React from 'react';

interface Amount {
  display: string;
  value: number;
}

interface PLNAmountSelectorProps {
  amounts: Amount[];
  selectedAmount: string;
  onSelectAmount: (amount: string) => void;
}

const PLNAmountSelector = ({ amounts, selectedAmount, onSelectAmount }: PLNAmountSelectorProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Nominal</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {amounts.map((amount, index) => (
          <button
            key={index}
            onClick={() => onSelectAmount(amount.value.toString())}
            className={`p-4 rounded-lg border-2 text-center font-semibold transition-colors ${
              selectedAmount === amount.value.toString()
                ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                : 'border-gray-200 hover:border-yellow-300'
            }`}
          >
            {amount.display}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PLNAmountSelector;
