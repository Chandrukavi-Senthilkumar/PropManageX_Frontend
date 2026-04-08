import {
  MapPinIcon,
  HomeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const PropertyCard = ({
  propertyID,
  name,
  location,
  type,
  totalUnits,
  imageUrl,
  onImageClick,
  onManageUnits,
  onAddAmenity
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">

      {/* IMAGE */}
      <div
        onClick={onImageClick}
        className="h-48 bg-gray-100 relative cursor-pointer"
      >
        {imageUrl}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="flex items-center gap-1 text-sm opacity-90">
            <MapPinIcon className="w-4 h-4" />
            {location}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Property Type</p>
            <p className="font-semibold">{type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Total Units</p>
            <p className="font-semibold">{totalUnits}</p>
          </div>
        </div>

        {/* VIEW */}
        <button
          onClick={onImageClick}
          className="w-full py-3 rounded-xl
                     bg-[#F3EEF2] text-[#5B3E59]
                     hover:bg-[#5B3E59] hover:text-white
                     transition-all font-semibold"
        >
          View Property
        </button>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onManageUnits(propertyID)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl
                       bg-[#F3EEF2] text-[#5B3E59]
                       hover:bg-[#5B3E59] hover:text-white
                       transition font-semibold"
          >
            <HomeIcon className="w-4 h-4" />
            Add Unit
          </button>

          <button
            onClick={() => onAddAmenity(propertyID)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl
                       bg-[#F3EEF2] text-[#5B3E59]
                       hover:bg-[#5B3E59] hover:text-white
                       transition font-semibold"
          >
            <SparklesIcon className="w-4 h-4" />
            Amenity
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;