import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SaleService } from '../../services/dealService';
import { XMarkIcon } from '@heroicons/react/24/outline';

// HELPER: Converts YYYY-MM-DD (or ISO) to DD-MM-YYYY for backend
const formatToBackendDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// SHARED COMPONENT: Reusable modal background and layout
const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[40px] w-full max-w-md p-8 relative shadow-2xl border border-gray-100">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black mb-6 text-gray-800 tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export const AddLeadModal = ({ isOpen, onClose, propertyID, unitID, onSuccess }) => {
  const formik = useFormik({
    initialValues: { 
        propertyID: propertyID || '', 
        unitID: unitID || '', 
        customerName: '', 
        contactInfo: '', 
        interestType: 'Buy', // Default to 'Buy'
        status: 'New'        // Default to 'New'
        // REMOVED live date from here to prevent infinite loop
    },
    enableReinitialize: true,
    validationSchema: Yup.object({ 
        customerName: Yup.string().required('Required'), 
        contactInfo: Yup.string().required('Required') 
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        // ADDED live date here so it only triggers on form submit
        const payload = { 
            ...values, 
            createdDate: formatToBackendDate(new Date().toISOString()) 
        };
        const res = await SaleService.createLead(payload);
        const leadID = res.data?.leadID || res.data;
        alert("Lead captured!");
        
        resetForm();
        if (onSuccess) onSuccess(leadID); 
        onClose(); 
      } catch (err) { 
          alert("Error creating lead"); 
      }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Capture Lead">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input {...formik.getFieldProps('customerName')} placeholder="Customer Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        
        <input {...formik.getFieldProps('contactInfo')} placeholder="Contact Info" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        
        <select {...formik.getFieldProps('interestType')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-600 font-medium">
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
        </select>

        <button type="submit" className="w-full py-4 bg-yellow-500 text-white rounded-2xl font-bold">Create Lead</button>
      </form>
    </ModalWrapper>
  );
};

export const AddSiteVisitModal = ({ isOpen, onClose, leadID, onSuccess }) => {
  const formik = useFormik({
    initialValues: { leadID, visitDate: '', notes: '' },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values, visitDate: formatToBackendDate(values.visitDate) };
        await SaleService.createSiteVisit(payload);
        alert("Visit Scheduled!");
        
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { alert("Error scheduling visit"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Schedule Site Visit">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input 
          type="date" 
          {...formik.getFieldProps('visitDate')} 
          className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-600" 
        />
        <textarea {...formik.getFieldProps('notes')} placeholder="Notes" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Confirm Visit</button>
      </form>
    </ModalWrapper>
  );
};

export const EditSiteVisitModal = ({ isOpen, onClose, visit, onSuccess }) => {
  const formik = useFormik({
    initialValues: { 
        visitID: visit?.visitID || '',
        leadID: visit?.leadID || '', 
        // Keep the exact original date string sent by the backend
        visitDate: visit?.visitDate || '', 
        notes: visit?.notes || '' 
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Send the payload back with the modified notes and the untouched original date
        const payload = { 
            visitID: values.visitID,
            leadID: values.leadID,
            visitDate: values.visitDate, 
            notes: values.notes 
        };
        await SaleService.updateSiteVisit(values.visitID, payload);
        alert("Notes Updated Successfully!");
        
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { alert("Error updating notes"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Update Visit Notes">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        
        {/* Read-Only Date Display */}
        <div className="w-full p-4 bg-gray-100 rounded-2xl text-gray-500 font-medium cursor-not-allowed border border-gray-200">
            Scheduled Date: {formik.values.visitDate || 'N/A'}
        </div>

        {/* Editable Notes Textarea */}
        <textarea 
            {...formik.getFieldProps('notes')} 
            placeholder="Update Notes..." 
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-700 h-32 resize-none" 
        />
        
        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors">
            Update Notes
        </button>
      </form>
    </ModalWrapper>
  );
};

export const AddDealModal = ({ isOpen, onClose, leadID, unitID, onSuccess }) => {
  const formik = useFormik({
    initialValues: { leadID, unitID, dealType: 'Sale', agreedValue: 0, expectedClosureDate: '', status: 'Negotiation' },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values, expectedClosureDate: formatToBackendDate(values.expectedClosureDate) };
        await SaleService.createDeal(payload);
        alert("Deal Finalized!");
        
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { alert("Error creating deal"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Finalize Deal">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input type="number" {...formik.getFieldProps('agreedValue')} placeholder="Agreed Value" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700" />
        <input type="date" {...formik.getFieldProps('expectedClosureDate')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-600" />
        <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold">Complete Deal</button>
      </form>
    </ModalWrapper>
  );
};