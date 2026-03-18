import React, { useEffect } from 'react';
import { HomeIcon, SparklesIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';


const PropertyCard = ({ 
  propertyID, name, type, location, totalUnits, status, imageUrl, 
  onImageClick, onManageUnits, onAddAmenity 
}) => {
  const statusStyles = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    UnderMaintenance: "bg-yellow-100 text-yellow-700"
  };
  const navigate = useNavigate();
const handleViewDetails = (e) => {
  // Prevent the parent div's onClick (onImageClick) from firing
  e.stopPropagation(); 
  
  // Navigate directly
  navigate(`/Property/${propertyID}`);
};

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
      
      {/* ONLY THIS IMAGE SECTION TRIGGERS THE DETAIL VIEW */}
      <div 
        onClick={onImageClick} 
        className="h-52 w-full bg-gray-200 relative cursor-pointer group overflow-hidden"
      >
        <img 
          src={imageUrl || 'https://placehold.co/400x200?text=PropManageX'} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
             <span   onClick={handleViewDetails} className="text-white opacity-0 group-hover:opacity-100 font-bold text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition-all">
                View Details
             </span>
        </div>
        <span className={`absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm z-10 ${statusStyles[status] || 'bg-gray-100'}`}>
          {status}
        </span>
      </div>

      {/* Details Section - Clicking here does NOT open details */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 truncate">{name}</h3>
          <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
            <MapPinIcon className="w-4 h-4" />
            {location}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => onManageUnits(propertyID)}
            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2.5 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
          >
            <HomeIcon className="w-4 h-4" /> Units
          </button>
          <button 
            onClick={() => onAddAmenity(propertyID)}
            className="flex items-center justify-center gap-2 bg-purple-50 text-purple-600 py-2.5 rounded-2xl text-xs font-bold hover:bg-purple-600 hover:text-white transition-all"
          >
            <SparklesIcon className="w-4 h-4" /> Amenity
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-gray-400">
          <span className="bg-gray-50 px-2 py-1 rounded-md">{type}</span>
          <span className="text-blue-500">{totalUnits} Total Units</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;