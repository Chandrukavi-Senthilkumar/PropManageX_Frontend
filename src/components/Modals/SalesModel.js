import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SaleService } from '../../services/dealService';
import { XMarkIcon } from '@heroicons/react/24/outline';

// HELPER: Converts YYYY-MM-DD (or ISO) to DD-MM-YYYY
const formatToBackendDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

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
    initialValues: { propertyID, unitID, customerName: '', contactInfo: '', interestType: 'Buy', status: 'New', createdDate: new Date().toISOString() },
    validationSchema: Yup.object({ customerName: Yup.string().required('Required'), contactInfo: Yup.string().required('Required') }),
    onSubmit: async (values) => {
      try {
        // Format the createdDate to DD-MM-YYYY
        const payload = { ...values, createdDate: formatToBackendDate(values.createdDate) };
        const res = await SaleService.createLead(payload);
        const leadID = res.data?.leadID || res.data;
        alert("Lead captured!");
        onSuccess(leadID); 
      } catch (err) { alert("Error creating lead"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Step 1: Capture Lead">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input {...formik.getFieldProps('customerName')} placeholder="Customer Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <input {...formik.getFieldProps('contactInfo')} placeholder="Contact Info" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <button type="submit" className="w-full py-4 bg-yellow-500 text-white rounded-2xl font-bold">Create Lead & Schedule Visit</button>
      </form>
    </ModalWrapper>
  );
};

export const AddSiteVisitModal = ({ isOpen, onClose, leadID, onSuccess }) => {
  const formik = useFormik({
    initialValues: { leadID, visitDate: '', notes: '' },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        // Format visitDate to DD-MM-YYYY before sending
        const payload = { ...values, visitDate: formatToBackendDate(values.visitDate) };
        await SaleService.createSiteVisit(payload);
        alert("Visit Scheduled!");
        onSuccess();
      } catch (err) { alert("Error scheduling visit"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Step 2: Site Visit">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input 
          type="date" // Use "date" for simpler formatting than "datetime-local"
          {...formik.getFieldProps('visitDate')} 
          className="w-full p-4 bg-gray-50 rounded-2xl outline-none" 
        />
        <textarea {...formik.getFieldProps('notes')} placeholder="Notes" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Confirm Visit & Create Deal</button>
      </form>
    </ModalWrapper>
  );
};

export const AddDealModal = ({ isOpen, onClose, leadID, unitID }) => {
  const formik = useFormik({
    initialValues: { leadID, unitID, dealType: 'Sale', agreedValue: 0, expectedClosureDate: '', status: 'Negotiation' },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        // Format expectedClosureDate to DD-MM-YYYY
        const payload = { ...values, expectedClosureDate: formatToBackendDate(values.expectedClosureDate) };
        await SaleService.createDeal(payload);
        alert("Deal Finalized!");
        onClose();
      } catch (err) { alert("Error creating deal"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Step 3: Finalize Deal">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input type="number" {...formik.getFieldProps('agreedValue')} placeholder="Agreed Value" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold" />
        <input type="date" {...formik.getFieldProps('expectedClosureDate')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold">Complete Deal</button>
      </form>
    </ModalWrapper>
  );
};