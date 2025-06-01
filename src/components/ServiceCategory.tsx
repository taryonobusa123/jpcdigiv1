
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
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm">{services.length} layanan tersedia</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {services.map((service, index) => (
          <button
            key={index}
            className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800 group-hover:text-blue-600">
                  {service.name}
                </h4>
                <p className="text-gray-500 text-sm">{service.description}</p>
              </div>
              {service.popular && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                  Populer
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategory;
