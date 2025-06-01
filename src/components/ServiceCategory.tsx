
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceCategoryProps {
  title: string;
  icon: LucideIcon;
  color: string;
  services: Array<{
    name: string;
    description: string;
    popular?: boolean;
  }>;
}

const ServiceCategory: React.FC<ServiceCategoryProps> = ({ title, icon: Icon, color, services }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow mx-4 mb-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-xs">{services.length} layanan tersedia</p>
        </div>
      </div>
      
      <div className="space-y-2">
        {services.slice(0, 3).map((service, index) => (
          <button
            key={index}
            className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group active:scale-95"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 group-hover:text-blue-600 text-sm">
                  {service.name}
                </h4>
                <p className="text-gray-500 text-xs">{service.description}</p>
              </div>
              {service.popular && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                  Populer
                </span>
              )}
            </div>
          </button>
        ))}
        {services.length > 3 && (
          <button className="w-full text-center py-2 text-blue-600 text-sm font-medium">
            Lihat Semua ({services.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCategory;
