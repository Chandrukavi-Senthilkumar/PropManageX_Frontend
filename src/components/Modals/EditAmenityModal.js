import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { unitAmenityService } from '../../services/unitAmenityService';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

const EditAmenityModal = ({ isOpen, onClose, amenity, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      propertyID: amenity?.propertyID || '',
      name: amenity?.name || '',
      description: amenity?.description || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Amenity name is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const response = await unitAmenityService.updateAmenity(amenity.amenityID, values);
        if (response.success || response.statusCode === 200 || response.statusCode === 204) {
          alert('Amenity updated successfully!');
          onSuccess?.();
          onClose();
        } else {
          setError(response.message || 'Failed to update amenity');
        }
      } catch (err) {
        console.error('Amenity update failed:', err);
        setError(err.response?.data?.message || err.message || 'Failed to update amenity');
      } finally {
        setLoading(false);
      }
    },
  });

  if (!isOpen || !amenity) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-2xl">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Amenity</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Amenity Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Swimming Pool, Gym, WiFi"
              {...formik.getFieldProps('name')}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Brief details about this amenity..."
              {...formik.getFieldProps('description')}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
            )}
          </div>

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
              className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Amenity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAmenityModal;
