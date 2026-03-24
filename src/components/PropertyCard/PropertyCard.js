import React, { useEffect } from 'react';
import { HomeIcon, SparklesIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

import React from 'react';
import { HomeIcon, SparklesIcon, MapPinIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PropertyCard = ({ 
  propertyID, name, type, location, totalUnits, status, imageUrl, 
  onImageClick, onManageUnits, onAddAmenity 
}) => {
  const statusConfig = {
    Active: { 
      bg: "bg-gradient-to-r from-green-50 to-green-100", 
      text: "text-green-700",
      badge: "bg-green-100 text-green-700",
      icon: CheckCircleIcon
    },
    Inactive: { 
      bg: "bg-gradient-to-r from-slate-50 to-slate-100", 
      text: "text-slate-700",
      badge: "bg-slate-100 text-slate-700",
      icon: ExclamationTriangleIcon
    },
    UnderMaintenance: { 
      bg: "bg-gradient-to-r from-amber-50 to-amber-100", 
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-700",
      icon: ExclamationTriangleIcon
    }
  };

  const config = statusConfig[status] || statusConfig.Inactive;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-all duration-300 flex flex-col h-full group animate-slide-up">
      
      {/* Image Section with Overlay */}
      <div 
        onClick={onImageClick} 
        className="h-48 w-full bg-slate-200 relative cursor-pointer group/image overflow-hidden"
      >
        <img 
          src={imageUrl || 'https://placehold.co/400x200?text=Property'} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
             <span   onClick={handleViewDetails} className="text-white opacity-0 group-hover:opacity-100 font-bold text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition-all">
                View Details
             </span>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-lg backdrop-blur-sm flex items-center gap-1 ${config.badge}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title & Location */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 truncate hover:text-blue-600 transition-colors">{name}</h3>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-2">
            <MapPinIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        </div>

        {/* Type and Units Info */}
        <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-slate-100">
          <div className="bg-slate-50 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{type}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Units</p>
            <p className="text-sm font-bold text-blue-900 mt-1">{totalUnits}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button 
            onClick={() => onManageUnits(propertyID)}
            className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-blue-200 hover:border-blue-500"
          >
            <HomeIcon className="w-4 h-4" />
            Units
          </button>
          <button 
            onClick={() => onAddAmenity(propertyID)}
            className="flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-500 text-purple-600 hover:text-white px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 border border-purple-200 hover:border-purple-500"
          >
            <SparklesIcon className="w-4 h-4" />
            Amenities
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;