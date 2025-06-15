
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PackageSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PackageSearch = ({ searchQuery, setSearchQuery }: PackageSearchProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari paket data..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default PackageSearch;
