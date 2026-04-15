import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { unitAmenityService } from '../../services/unitAmenityService';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AddUnitModal = ({
  isOpen,
  onClose,
  propertyID,
  showToast   // ✅ added
}) => {
  const formik = useFormik({
    initialValues: {
      propertyID: propertyID,
      unitNumber: '',
      areaSqFt: '',
      bedroomCount: '',
      basePrice: '',
      status: 'Available'
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      unitNumber: Yup.string().required('Unit number is required'),
      basePrice: Yup.number()
        .typeError('Base price must be a number')
        .required('Base price is required'),
    }),
    onSubmit: async (values) => {
      try {
        await unitAmenityService.createUnit(values);

        // ✅ close modal first
        onClose();

        // ✅ show toast after modal closes
        setTimeout(() => {
          showToast?.('Unit added successfully!', 'success');
        }, 0);

      } catch (err) {
        console.error(err);

        onClose();
        setTimeout(() => {
          showToast?.('Failed to add unit', 'error');
        }, 0);
      }
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-[#F3EEF2] rounded-3xl w-full max-w-md p-8 shadow-2xl relative">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add Unit to Property
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {/* Unit Number */}
          <div className="space-y-1">
            <input
              {...formik.getFieldProps('unitNumber')}
              placeholder="Unit Number (e.g. A-101)"
              className={`w-full p-4 rounded-2xl outline-none transition-all ${
                formik.touched.unitNumber && formik.errors.unitNumber
                  ? 'bg-red-50/50 border border-red-500 text-red-600 placeholder:text-red-400'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            />
            {formik.touched.unitNumber && formik.errors.unitNumber && (
              <div className="text-red-500 text-xs font-bold text-center">
                {formik.errors.unitNumber}
              </div>
            )}
          </div>

          {/* Bedrooms & Area */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              {...formik.getFieldProps('bedroomCount')}
              placeholder="Bedrooms"
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none"
            />

            <input
              type="number"
              {...formik.getFieldProps('areaSqFt')}
              placeholder="Area (SqFt)"
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none"
            />
          </div>

          {/* Base Price */}
          <div className="space-y-1">
            <input
              type="number"
              {...formik.getFieldProps('basePrice')}
              placeholder="Base Price"
              className={`w-full p-4 rounded-2xl outline-none transition-all ${
                formik.touched.basePrice && formik.errors.basePrice
                  ? 'bg-red-50/50 border border-red-500 text-red-600 placeholder:text-red-400'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            />
            {formik.touched.basePrice && formik.errors.basePrice && (
              <div className="text-red-500 text-xs font-bold text-center">
                {formik.errors.basePrice}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit" style={{color:'#FFFFFF'}}
              className="flex-1 py-3 bg-[#5B3E59] text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Save Unit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddUnitModal;