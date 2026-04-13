import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { unitAmenityService } from '../../services/unitAmenityService';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AddAmenityModal = ({
  isOpen,
  onClose,
  propertyID,
  refreshData,
  showToast // ✅ added
}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      propertyID: propertyID,
      name: '',
      description: ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Amenity name is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await unitAmenityService.createAmenity(values);

        if (refreshData) refreshData();
        formik.resetForm();

        // ✅ close modal first
        onClose();

        // ✅ show toast after modal closes
        setTimeout(() => {
          showToast?.('Amenity added successfully!', 'success');
        }, 0);

      } catch (err) {
        console.error(err);

        onClose();
        setTimeout(() => {
          showToast?.(
            'Failed to add amenity. Please check your connection.',
            'error'
          );
        }, 0);
      } finally {
        setLoading(false);
      }
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
      <div className="bg-[#F3EEF2] rounded-[32px] w-full max-w-md p-8 shadow-2xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-2xl">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Add Amenity
          </h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">

          {/* Amenity Name */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400 tracking-wider">
              Amenity Name
            </label>
            <input
              {...formik.getFieldProps('name')}
              placeholder="e.g. Swimming Pool, Gym, WiFi"
              className={`w-full p-4 rounded-2xl outline-none transition-all ${
                formik.touched.name && formik.errors.name
                  ? 'bg-red-50/50 border border-red-500 text-red-600 placeholder:text-red-400'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-xs font-bold text-center">
                {formik.errors.name}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-gray-400 tracking-wider">
              Description
            </label>
            <textarea
              {...formik.getFieldProps('description')}
              rows="3"
              placeholder="Brief details about this amenity..."
              className={`w-full p-4 rounded-2xl outline-none resize-none transition-all ${
                formik.touched.description && formik.errors.description
                  ? 'bg-red-50/50 border border-red-500 text-red-600 placeholder:text-red-400'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-xs font-bold text-center">
                {formik.errors.description}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold
                         shadow-lg shadow-purple-200 hover:bg-purple-700
                         active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Amenity'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddAmenityModal;