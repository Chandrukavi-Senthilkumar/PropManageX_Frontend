import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { propertyService } from '../../services/propertyService';

const AddPropertyModal = ({ isOpen, onClose, refreshList }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'Commercial',
      location: '',
      totalUnits: 0,
      status: 'Active',
      Image: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Property name is required'),
      location: Yup.string().required('Location is required'),
      totalUnits: Yup.number().min(1, 'At least 1 unit').required('Required'),
    }),
 onSubmit: async (values) => {
    setLoading(true);
    try {
        const formData = new FormData();
        
        // Ensure these keys match your Backend Model exactly
        formData.append('Name', values.name);
        formData.append('Type', values.type);
        formData.append('Location', values.location);
        formData.append('TotalUnits', values.totalUnits);
        formData.append('Status', values.status);
        
        // Check if selectedFile exists and append it
        if (selectedFile) {
            // Note: If your backend property is 'Image', use 'Image'
            formData.append('Image', selectedFile); 
        }

        // Debug: Log the FormData to verify (FormData doesn't log easily, so use this:)
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]); 
        }

        const createResponse = await propertyService.createProperty(formData);
        
        // Success Logic
        alert("Property created successfully!");
        refreshList();
        onClose();
        
    } catch (err) {
        console.error("Upload Failed:", err);
        alert(err.response?.data?.message || "Failed to save property.");
    } finally {
        setLoading(false);
    }
}
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[32px] w-full max-w-lg p-10 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Property</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Text Inputs */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Property Name</label>
            <input type="text" name="name" {...formik.getFieldProps('name')} className="w-full mt-1 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. Marina Bay Sands" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Type</label>
              <select name="type" {...formik.getFieldProps('type')} className="w-full mt-1 p-3 bg-gray-50 border rounded-xl outline-none">
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                {/* <option value="Industrial">Industrial</option> */}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Total Units</label>
              <input type="number" name="totalUnits" {...formik.getFieldProps('totalUnits')} className="w-full mt-1 p-3 bg-gray-50 border rounded-xl outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Location</label>
            <input type="text" name="location" {...formik.getFieldProps('location')} className="w-full mt-1 p-3 bg-gray-50 border rounded-xl outline-none" placeholder="City, Country" />
          </div>

          {/* Image Upload Area */}
          <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
                // Optional: Update formik just to keep it aware
                formik.setFieldValue('Image', file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">
                {selectedFile ? selectedFile.name : "Click to upload property image"}
              </p>
              <p className="text-xs text-gray-400 font-medium">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
              {loading ? 'Saving...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;