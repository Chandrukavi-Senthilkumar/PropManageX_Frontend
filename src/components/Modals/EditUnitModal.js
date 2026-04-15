import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { unitAmenityService } from '../../services/unitAmenityService';

const EditUnitModal = ({ isOpen, onClose, unit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      unitNumber: unit?.unitNumber || '',
      bedroomCount: unit?.bedroomCount || 0,
      areaSqFt: unit?.areaSqFt || 0,
      basePrice: unit?.basePrice || 0,
      status: unit?.status || 'Available',
    },
    validationSchema: Yup.object({
      unitNumber: Yup.string().required('Unit number is required').max(100, 'Max 100 characters'),
      bedroomCount: Yup.number().min(0, 'Cannot be negative').required('Required'),
      areaSqFt: Yup.number().min(0, 'Cannot be negative').required('Required'),
      basePrice: Yup.number().min(0, 'Cannot be negative').required('Required'),
      status: Yup.string().required('Status is required'),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const updateData = {
          propertyID: unit.propertyID,
          unitNumber: values.unitNumber,
          bedroomCount: parseInt(values.bedroomCount),
          areaSqFt: parseFloat(values.areaSqFt),
          basePrice: parseFloat(values.basePrice),
          status: values.status,
        };

        if (onSuccess) {
          await onSuccess(updateData);
          onClose();
          return;
        }

        const response = await unitAmenityService.updateUnit(unit.unitID, updateData);
        if (response.success || response.statusCode === 200 || response.statusCode === 204) {
          onClose();
        } else {
          setError(response.message || 'Failed to update unit');
        }
      } catch (err) {
        console.error('Update failed:', err);
        setError(err.response?.data?.message || err.message || 'Failed to update unit');
      } finally {
        setLoading(false);
      }
    }
  });

  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#F3EEF2] rounded-[32px] w-full max-w-lg p-10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Edit Unit</h2>
        <p className="text-sm text-gray-400 mb-6">Update unit details</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Unit Number */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Unit Number</label>
            <input 
              type="text" 
              name="unitNumber" 
              {...formik.getFieldProps('unitNumber')} 
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. A101" 
            />
            {formik.touched.unitNumber && formik.errors.unitNumber && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.unitNumber}</p>
            )}
          </div>

          {/* Bedroom Count and Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Bedrooms</label>
              <input 
                type="number" 
                name="bedroomCount" 
                {...formik.getFieldProps('bedroomCount')} 
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.touched.bedroomCount && formik.errors.bedroomCount && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.bedroomCount}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Area (Sq Ft)</label>
              <input 
                type="number" 
                step="0.01"
                name="areaSqFt" 
                {...formik.getFieldProps('areaSqFt')} 
                className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              />
              {formik.touched.areaSqFt && formik.errors.areaSqFt && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.areaSqFt}</p>
              )}
            </div>
          </div>

          {/* Base Price */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Base Price</label>
            <input 
              type="number" 
              step="0.01"
              name="basePrice" 
              {...formik.getFieldProps('basePrice')} 
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="0.00" 
            />
            {formik.touched.basePrice && formik.errors.basePrice && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.basePrice}</p>
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
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Leased">Leased</option>
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
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUnitModal;
