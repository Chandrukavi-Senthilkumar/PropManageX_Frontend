import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { unitAmenityService } from '../../services/unitAmenityService';

const AddUnitModal = ({ isOpen, onClose, propertyID }) => {
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
      unitNumber: Yup.string().required('Required'),
      basePrice: Yup.number().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await unitAmenityService.createUnit(values);
        alert("Unit added!");
        onClose();
      } catch (err) { alert("Failed to add unit"); }
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Add Unit to Property</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input name="unitNumber" {...formik.getFieldProps('unitNumber')} placeholder="Unit Number (e.g. A-101)" className="w-full p-3 border rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <input name="bedroomCount" type="number" {...formik.getFieldProps('bedroomCount')} placeholder="Bedrooms" className="w-full p-3 border rounded-xl" />
            <input name="areaSqFt" type="number" {...formik.getFieldProps('areaSqFt')} placeholder="Area (SqFt)" className="w-full p-3 border rounded-xl" />
          </div>
          <input name="basePrice" type="number" {...formik.getFieldProps('basePrice')} placeholder="Base Price" className="w-full p-3 border rounded-xl" />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Save Unit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnitModal;