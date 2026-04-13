import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { propertyService } from '../../services/propertyService';

const AddPropertyModal = ({ isOpen, onClose, refreshList, showToast }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'Commercial',
      location: '',
      totalUnits: '',
      status: 'Active',
      Image: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Property name is required'),
      location: Yup.string().required('Location is required'),
      totalUnits: Yup.number()
        .typeError('Total units must be a number')
        .min(1, 'At least 1 unit')
        .required('Total units is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('Name', values.name);
        formData.append('Type', values.type);
        formData.append('Location', values.location);
        formData.append('TotalUnits', values.totalUnits);
        formData.append('Status', values.status);
        if (selectedFile) formData.append('Image', selectedFile);

        await propertyService.createProperty(formData);

        resetForm();
        setSelectedFile(null);

        // ✅ CLOSE MODAL FIRST
        onClose();

        // ✅ SHOW TOAST AFTER MODAL CLOSES
        setTimeout(() => {
          showToast?.('Property created successfully!', 'success');
        }, 0);

        refreshList();
      } catch {
        onClose();
        setTimeout(() => {
          showToast?.('Failed to save property', 'error');
        }, 0);
      } finally {
        setLoading(false);
      }
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-[#F3EEF2] rounded-[40px] w-full max-w-lg p-8 relative shadow-2xl">

        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-black text-gray-800 text-center mb-6">
          Add Property
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">

          {/* Property Name */}
          <div className="space-y-1">
            <input
              {...formik.getFieldProps('name')}
              placeholder="Property Name"
              className={`w-full p-4 rounded-2xl outline-none transition-all ${
                formik.touched.name && formik.errors.name
                  ? 'bg-red-50/50 border border-red-500 text-red-600'
                  : 'bg-gray-50 border border-transparent'
              }`}
            />
          </div>

          {/* Type + Total Units */}
          <div className="grid grid-cols-2 gap-4">
            <select
              {...formik.getFieldProps('type')}
              className="p-4 rounded-2xl bg-gray-50 border border-transparent"
            >
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
            </select>

            <input
              type="number"
              {...formik.getFieldProps('totalUnits')}
              placeholder="Total Units"
              className="w-full p-4 rounded-2xl bg-gray-50"
            />
          </div>

          {/* Location */}
          <input
            {...formik.getFieldProps('location')}
            placeholder="Location"
            className="w-full p-4 rounded-2xl bg-gray-50"
          />

          {/* Image */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => {
                const file = e.target.files[0];
                setSelectedFile(file);
                formik.setFieldValue('Image', file);
              }}
            />
            <p className="text-sm font-semibold text-gray-700">
              {selectedFile ? selectedFile.name : 'Click to upload property image'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-500 font-bold rounded-2xl hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#5B3E59] text-white rounded-2xl font-black hover:bg-[#4A3248] shadow-lg"
            >
              {loading ? 'Saving…' : 'Add Property'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;