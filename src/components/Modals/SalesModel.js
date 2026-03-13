import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SaleService } from '../../services/dealService';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

// --- STANDALONE LEAD FORM ---
export const AddLeadModal = ({ isOpen, onClose, propertyID }) => {
  const formik = useFormik({
    initialValues: { propertyID, customerName: '', contactInfo: '', interestType: '', status: 'New', createdDate: new Date().toISOString() },
    validationSchema: Yup.object({ customerName: Yup.string().required('Name is required'), contactInfo: Yup.string().required('Contact info is required') }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await SaleService.createLead(values);
        alert("Lead captured successfully!");
        resetForm();
        onClose();
      } catch (err) { alert("Error creating lead"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Capture New Lead">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input {...formik.getFieldProps('customerName')} placeholder="Customer Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-yellow-400" />
        <input {...formik.getFieldProps('contactInfo')} placeholder="Phone or Email" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-yellow-400" />
        <button type="submit" className="w-full py-4 bg-yellow-500 text-white rounded-2xl font-bold shadow-lg shadow-yellow-100 active:scale-95 transition-all">Save Lead</button>
      </form>
    </ModalWrapper>
  );
};

// --- STANDALONE SITE VISIT FORM ---
export const AddSiteVisitModal = ({ isOpen, onClose, leadID }) => {
  const formik = useFormik({
    initialValues: { leadID: leadID || '', visitDate: '', agentID: '', notes: '' },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await SaleService.createSiteVisit(values);
        alert("Site Visit Scheduled!");
        resetForm();
        onClose();
      } catch (err) { alert("Error scheduling visit"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Schedule Site Visit">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {!leadID && <input {...formik.getFieldProps('leadID')} placeholder="Lead ID (UUID)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />}
        <input type="datetime-local" {...formik.getFieldProps('visitDate')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <input {...formik.getFieldProps('agentID')} placeholder="Assign Agent (UUID)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <textarea {...formik.getFieldProps('notes')} placeholder="Visit notes..." className="w-full p-4 bg-gray-50 rounded-2xl outline-none" rows="3" />
        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all">Confirm Schedule</button>
      </form>
    </ModalWrapper>
  );
};

// --- STANDALONE DEAL FORM ---
export const AddDealModal = ({ isOpen, onClose, leadID }) => {
  const formik = useFormik({
    initialValues: { leadID: leadID || '', unitID: '', dealType: 'Sale', agreedValue: 0, expectedClosureDate: '', status: 'Negotiation' },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await SaleService.createDeal(values);
        alert("Deal closed successfully!");
        resetForm();
        onClose();
      } catch (err) { alert("Error creating deal"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Finalize Deal">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {!leadID && <input {...formik.getFieldProps('leadID')} placeholder="Lead ID (UUID)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />}
        <input {...formik.getFieldProps('unitID')} placeholder="Unit ID (UUID)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" {...formik.getFieldProps('agreedValue')} placeholder="Agreed Value" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold" />
          <input type="date" {...formik.getFieldProps('expectedClosureDate')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        </div>
        <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all">Create Deal</button>
      </form>
    </ModalWrapper>
  );
};