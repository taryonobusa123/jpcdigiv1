
import React from 'react';
import { Button } from '@/components/ui/button';

interface OperatorSelectorProps {
  operators: string[];
  selectedOperator: string;
  setSelectedOperator: (operator: string) => void;
}

const OperatorSelector = ({ operators, selectedOperator, setSelectedOperator }: OperatorSelectorProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Pilih Provider</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={selectedOperator === '' ? 'default' : 'outline'}
          onClick={() => setSelectedOperator('')}
          className="h-12"
        >
          Semua Operator
        </Button>
        {operators.map((operator) => (
          <Button
            key={operator}
            variant={selectedOperator === operator ? 'default' : 'outline'}
            onClick={() => setSelectedOperator(operator)}
            className="h-12"
          >
            {operator}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OperatorSelector;
