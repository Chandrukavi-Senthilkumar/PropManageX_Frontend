import {
  BuildingOfficeIcon,
  MapPinIcon,
  HomeModernIcon,
  Squares2X2Icon,
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
  onAddAmenity,
}) => {
  return (
    <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl transition-all flex flex-col group overflow-hidden">

      {/* Top Accent Bar */}
      <div className="h-1.5 w-full bg-[#5B3E59]" />

      <div className="p-5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl
                       bg-gradient-to-br from-[#5B3E59] to-[#7d5d7a]
                       flex items-center justify-center
                       text-white font-black text-xl shadow-lg uppercase"
          >
            {name?.charAt(0)}
          </div>

          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-black text-stone-900 truncate">              {name}
            </h3>
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <MapPinIcon className="w-3.5 h-3.5 text-stone-400" />
              {location}
            </p>
          </div>
        </div>

        {/* IMAGE */}
        <div
          onClick={onImageClick}
          className="relative h-44 rounded-2xl overflow-hidden border border-stone-100 cursor-pointer group"
        >
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover
                       group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* INFO PANEL */}
        <div className="bg-[#fcfbf9] p-5 rounded-2xl border border-stone-100 space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-600">
              <BuildingOfficeIcon className="w-4 h-4 text-stone-400" />
              <span className="text-sm font-black">{type}</span>
            </div>

            <div className="flex items-center gap-2 text-stone-600">
              <Squares2X2Icon className="w-4 h-4 text-stone-400" />
              <span className="text-sm font-black">
                {totalUnits} Units
              </span>
            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onImageClick}
            className="
              flex-1 py-3 sm:py-4 rounded-2xl
              bg-[#5B3E59] hover:bg-[#4a3248]
              text-white font-black text-[10px]
              uppercase tracking-[0.2em]
              transition-all shadow-xl shadow-stone-200/50
            "
          >
            View Property
          </button>

          <button
            onClick={() => onManageUnits(propertyID)}
            className="
              p-4 rounded-2xl
              border border-stone-200
              text-stone-500 hover:bg-stone-50
              transition-all
            "
            title="Add / Manage Units"
          >
            <HomeModernIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => onAddAmenity(propertyID)}
            className="
              p-4 rounded-2xl
              border border-stone-200
              text-stone-500 hover:bg-stone-50
              transition-all
            "
            title="Add Amenities"
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default PropertyCard;