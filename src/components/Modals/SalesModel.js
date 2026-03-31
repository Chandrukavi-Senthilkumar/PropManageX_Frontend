import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SaleService } from '../../services/dealService';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
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

export const UpdateDealStatusModal = ({ isOpen, onClose, deal, onSuccess }) => {
    const formik = useFormik({
        initialValues: { status: deal?.status || 'Open' },
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                await SaleService.updateDealStatus(deal.dealID || deal.dealId, values.status);
                alert("Status Updated!");
                if (onSuccess) onSuccess();
                onClose();
            } catch (err) { alert("Update failed"); }
        }
    });

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Change Deal Status">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Client</p>
                    <p className="font-bold text-gray-800">{deal?.customerName}</p>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Update To</label>
                    <select {...formik.getFieldProps('status')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700">
                        <option value="Open">Open</option>
                        <option value="Booked">Booked</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <button type="submit" className="w-full py-4 bg-[#7c3aed] text-white rounded-2xl font-black hover:bg-[#5a2ab3] transition-all shadow-lg shadow-purple-100">Save Changes</button>
            </form>
        </ModalWrapper>
    );
};

export const AddLeadModal = ({ isOpen, onClose, propertyID, unitID, onSuccess }) => {
  const formik = useFormik({
    initialValues: { propertyID: propertyID || '', unitID: unitID || '', customerName: '', contactInfo: '', interestType: 'Buy', status: 'New' },
    enableReinitialize: true,
    validationSchema: Yup.object({ customerName: Yup.string().required('Required'), contactInfo: Yup.string().required('Required') }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values, createdDate: formatToBackendDate(new Date().toISOString()) };
        const res = await SaleService.createLead(payload);
        alert("Lead captured!");
        resetForm();
        if (onSuccess) onSuccess(); 
        onClose(); 
      } catch (err) { alert("Error creating lead"); }
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
        <input type="date" {...formik.getFieldProps('visitDate')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-600" />
        <textarea {...formik.getFieldProps('notes')} placeholder="Notes" className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Confirm Visit</button>
      </form>
    </ModalWrapper>
  );
};

export const EditSiteVisitModal = ({ isOpen, onClose, visit, onSuccess }) => {
  const formik = useFormik({
    initialValues: { visitID: visit?.visitID || '', leadID: visit?.leadID || '', visitDate: visit?.visitDate || '', notes: visit?.notes || '' },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { visitID: values.visitID, leadID: values.leadID, visitDate: values.visitDate, notes: values.notes };
        await SaleService.updateSiteVisit(values.visitID, payload);
        alert("Notes Updated!");
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { alert("Error updating notes"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Update Visit Notes">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="w-full p-4 bg-gray-100 rounded-2xl text-gray-500 font-medium border border-gray-200">Scheduled Date: {formik.values.visitDate || 'N/A'}</div>
        <textarea {...formik.getFieldProps('notes')} placeholder="Update Notes..." className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-700 h-32 resize-none" />
        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Update Notes</button>
      </form>
    </ModalWrapper>
  );
};

export const AddDealModal = ({ isOpen, onClose, lead, onSuccess }) => {
  const formik = useFormik({
    initialValues: { leadID: lead?.leadID || lead?.leadId || '', unitID: lead?.unitID || lead?.unitId || '', dealType: 'Sale', agreedValue: '', expectedClosureDate: '', status: 'Open' },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values, expectedClosureDate: formatToBackendDate(values.expectedClosureDate) };
        await SaleService.createDeal(payload);
        alert("Deal Created!");
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { alert("Error creating deal"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create New Deal">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="p-4 bg-purple-50 rounded-2xl text-xs font-bold text-purple-700 border border-purple-100">Client: {lead?.customerName}</div>
        <label className="block text-[10px] font-bold uppercase text-gray-400 ml-2">Deal Type</label>
        <select {...formik.getFieldProps('dealType')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-600">
            <option value="Sale">Sale</option>
            <option value="Lease">Lease</option>
        </select>
        <label className="block text-[10px] font-bold uppercase text-gray-400 ml-2">Agreed Value (₹)</label>
        <input type="number" {...formik.getFieldProps('agreedValue')} placeholder="₹ Value" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold" />
        <label className="block text-[10px] font-bold uppercase text-gray-400 ml-2">Closure Date</label>
        <input type="date" {...formik.getFieldProps('expectedClosureDate')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-gray-600" />
        <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold">Confirm Deal</button>
      </form>
    </ModalWrapper>
  );
};