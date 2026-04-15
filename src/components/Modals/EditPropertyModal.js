import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// fallback service path if no onSuccess hook is provided
import { propertyService } from '../../services/propertyService';

const EditPropertyModal = ({ isOpen, onClose, property, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: property?.name || '',
      type: property?.type || 'Commercial',
      location: property?.location || '',
      totalUnits: property?.totalUnits || 0,
      status: property?.status || 'Active',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Property name is required').max(200, 'Max 200 characters'),
      type: Yup.string().required('Type is required').max(50, 'Max 50 characters'),
      location: Yup.string().required('Location is required').max(200, 'Max 200 characters'),
      totalUnits: Yup.number().min(0, 'Cannot be negative').required('Required'),
      status: Yup.string().required('Status is required'),
    }),
    enableReinitialize: true, // Re-init when property changes
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      const updateData = {
        name: values.name,
        type: values.type,
        location: values.location,
        totalUnits: parseInt(values.totalUnits),
        status: values.status,
      };

      try {
        if (onSuccess) {
          await onSuccess(updateData);
          onClose();
          return;
        }

        const response = await propertyService.updateProperty(property.propertyID, updateData);
        if (response.success || response.statusCode === 200 || response.statusCode === 204) {
          onClose();
        } else {
          setError(response.message || 'Failed to update property');
        }
      } catch (err) {
        console.error('Update failed:', err);
        setError(err.response?.data?.message || err.message || 'Failed to update property');
      } finally {
        setLoading(false);
      }
    }
  });

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#F3EEF2] rounded-[32px] w-full max-w-lg p-10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Edit Property</h2>
        <p className="text-sm text-gray-400 mb-6">Update property details</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Property Name */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Property Name</label>
            <input 
              type="text" 
              name="name" 
              {...formik.getFieldProps('name')} 
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Marina Bay Sands" 
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Type and Total Units */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Type</label>
              <select 
                name="type" 
                {...formik.getFieldProps('type')} 
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Industrial">Industrial</option>
              </select>
              {formik.touched.type && formik.errors.type && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.type}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Total Units</label>
              <input 
                type="number" 
                name="totalUnits" 
                {...formik.getFieldProps('totalUnits')} 
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.touched.totalUnits && formik.errors.totalUnits && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.totalUnits}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Location</label>
            <input 
              type="text" 
              name="location" 
              {...formik.getFieldProps('location')} 
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="City, Country" 
            />
            {formik.touched.location && formik.errors.location && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.location}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Status</label>
            <select 
              name="status" 
              {...formik.getFieldProps('status')} 
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="UnderMaintenance">Under Maintenance</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.status}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" style={{color:'#FFFFFF'}}
              disabled={loading || !formik.dirty}
              className="flex-1 py-3 bg-[#5B3E59] text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyModal;
