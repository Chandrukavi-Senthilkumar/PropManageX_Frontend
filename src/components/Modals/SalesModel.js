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
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black mb-6 text-gray-800 tracking-tight text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export const UpdateDealStatusModal = ({ isOpen, onClose, deal, onSuccess }) => {
    const formik = useFormik({
        initialValues: { status: deal?.status || 'Open' },
        enableReinitialize: true,
        validationSchema: Yup.object({
            status: Yup.string().required('Status is required')
        }),
        onSubmit: async (values) => {
            try {
                await SaleService.updateDealStatus(deal.dealID || deal.dealId, values.status);
                if (onSuccess) onSuccess();
                onClose();
            } catch (err) { alert("Update failed"); }
        }
    });

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Change Deal Status">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-center">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Client</p>
                    <p className="font-bold text-gray-800">{deal?.customerName}</p>
                </div>
                <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1">Update To</label>
                    <select 
                        {...formik.getFieldProps('status')} 
                        className={`w-full p-4 rounded-2xl outline-none font-bold transition-all ${
                            formik.touched.status && formik.errors.status 
                            ? 'bg-red-50/50 border border-red-500 text-red-600' 
                            : 'bg-gray-50 border border-transparent text-gray-700'
                        }`}
                    >
                        <option value="Open">Open</option>
                        <option value="Booked">Booked</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    {formik.touched.status && formik.errors.status && (
                        <div className="text-red-500 text-xs font-bold mt-1 text-center">{formik.errors.status}</div>
                    )}
                </div>
                <button type="submit" className="w-full py-4 bg-[#5B3E59] text-white rounded-2xl font-black hover:bg-[#4a3248] transition-all shadow-lg shadow-[#5B3E59]/20">
                    Save Changes
                </button>
            </form>
        </ModalWrapper>
    );
};

export const AddLeadModal = ({ isOpen, onClose, propertyID, unitID, onSuccess }) => {
  const formik = useFormik({
    initialValues: { propertyID: propertyID || '', unitID: unitID || '', customerName: '', contactInfo: '', interestType: 'Buy', status: 'New' },
    enableReinitialize: true,
    validationSchema: Yup.object({ 
        customerName: Yup.string().required('Customer Name is required'), 
        contactInfo: Yup.string().required('Contact Info is required') 
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values, createdDate: formatToBackendDate(new Date().toISOString()) };
        await SaleService.createLead(payload);
        resetForm();
        if (onSuccess) onSuccess(); 
        onClose(); 
      } catch (err) { alert("Error creating lead"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Capture Lead">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-1">
            <input 
                {...formik.getFieldProps('customerName')} 
                placeholder="Customer Name" 
                className={`w-full p-4 rounded-2xl outline-none transition-all ${
                    formik.touched.customerName && formik.errors.customerName 
                    ? 'bg-red-50/50 border border-red-500 text-red-600 placeholder:text-red-400' 
                    : 'bg-gray-50 border border-transparent'
                }`} 
            />
            {formik.touched.customerName && formik.errors.customerName && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.customerName}</div>
            )}
        </div>

        <div className="space-y-1">
            <input 
                {...formik.getFieldProps('contactInfo')} 
                placeholder="Contact Info (Email or Phone)" 
                className={`w-full p-4 rounded-2xl outline-none transition-all ${
                    formik.touched.contactInfo && formik.errors.contactInfo 
                    ? 'bg-red-50/50 border border-red-500 text-red-600 placeholder:text-red-400' 
                    : 'bg-gray-50 border border-transparent'
                }`} 
            />
            {formik.touched.contactInfo && formik.errors.contactInfo && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.contactInfo}</div>
            )}
        </div>

        <div className="space-y-1">
            <select {...formik.getFieldProps('interestType')} className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent outline-none text-gray-600 font-medium">
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
            </select>
        </div>

        <button type="submit" className="w-full py-4 bg-[#5B3E59] text-white rounded-2xl font-bold hover:bg-[#4a3248] transition-all shadow-lg shadow-[#5B3E59]/20 mt-4">
            Create Lead
        </button>
      </form>
    </ModalWrapper>
  );
};

export const AddSiteVisitModal = ({ isOpen, onClose, leadID, onSuccess }) => {
  const formik = useFormik({
    initialValues: { leadID, visitDate: '', notes: '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
        visitDate: Yup.string().required('Visit Date is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values, visitDate: formatToBackendDate(values.visitDate) };
        await SaleService.createSiteVisit(payload);
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { alert("Error scheduling visit"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Schedule Site Visit">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-1">
            <input 
                type="date" 
                {...formik.getFieldProps('visitDate')} 
                className={`w-full p-4 rounded-2xl outline-none transition-all ${
                    formik.touched.visitDate && formik.errors.visitDate 
                    ? 'bg-red-50/50 border border-red-500 text-red-600' 
                    : 'bg-gray-50 border border-transparent text-gray-600'
                }`} 
            />
            {formik.touched.visitDate && formik.errors.visitDate && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.visitDate}</div>
            )}
        </div>

        <div className="space-y-1">
            <textarea 
                {...formik.getFieldProps('notes')} 
                placeholder="Additional Notes (Optional)" 
                className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent outline-none h-24 resize-none" 
            />
        </div>

        <button type="submit" className="w-full py-4 bg-[#5B3E59] text-white rounded-2xl font-bold hover:bg-[#4a3248] transition-all shadow-lg shadow-[#5B3E59]/20">
            Confirm Visit
        </button>
      </form>
    </ModalWrapper>
  );
};

export const EditSiteVisitModal = ({ isOpen, onClose, visit, onSuccess }) => {
  const formik = useFormik({
    initialValues: { visitID: visit?.visitID || '', leadID: visit?.leadID || '', visitDate: visit?.visitDate || '', notes: visit?.notes || '' },
    enableReinitialize: true,
    validationSchema: Yup.object({
        notes: Yup.string().required('Notes are required to make an update')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { visitID: values.visitID, leadID: values.leadID, visitDate: values.visitDate, notes: values.notes };
        await SaleService.updateSiteVisit(values.visitID, payload);
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { alert("Error updating notes"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Update Visit Notes">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="w-full p-4 bg-gray-100 rounded-2xl text-gray-500 font-medium border border-gray-200 text-center">
            Scheduled Date: {formik.values.visitDate || 'N/A'}
        </div>

        <div className="space-y-1">
            <textarea 
                {...formik.getFieldProps('notes')} 
                placeholder="Update Notes..." 
                className={`w-full p-4 rounded-2xl outline-none h-32 resize-none transition-all ${
                    formik.touched.notes && formik.errors.notes 
                    ? 'bg-red-50/50 border border-red-500 text-red-600 placeholder:text-red-400' 
                    : 'bg-gray-50 border border-transparent text-gray-700'
                }`} 
            />
            {formik.touched.notes && formik.errors.notes && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.notes}</div>
            )}
        </div>

        <button type="submit" className="w-full py-4 bg-[#5B3E59] text-white rounded-2xl font-bold hover:bg-[#4a3248] transition-all shadow-lg shadow-[#5B3E59]/20">
            Update Notes
        </button>
      </form>
    </ModalWrapper>
  );
};

export const AddDealModal = ({ isOpen, onClose, lead, onSuccess }) => {
  const formik = useFormik({
    initialValues: { leadID: lead?.leadID || lead?.leadId || '', unitID: lead?.unitID || lead?.unitId || '', dealType: 'Sale', agreedValue: '', expectedClosureDate: '', status: 'Open' },
    enableReinitialize: true,
    validationSchema: Yup.object({
        agreedValue: Yup.number().typeError('Must be a valid number').required('Agreed Value is required').positive('Value must be greater than 0'),
        expectedClosureDate: Yup.string().required('Closure Date is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values, expectedClosureDate: formatToBackendDate(values.expectedClosureDate) };
        await SaleService.createDeal(payload);
        resetForm();
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { alert("Error creating deal"); }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create New Deal">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="p-4 bg-purple-50 rounded-2xl text-xs font-bold text-purple-700 border border-purple-100 text-center">
            Client: {lead?.customerName}
        </div>

        <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1">Deal Type</label>
            <select {...formik.getFieldProps('dealType')} className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none text-gray-600">
                <option value="Sale">Sale</option>
                <option value="Lease">Lease</option>
            </select>
        </div>

        <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1">Agreed Value (₹)</label>
            <input 
                type="number" 
                {...formik.getFieldProps('agreedValue')} 
                placeholder="₹ Value" 
                className={`w-full p-4 rounded-2xl outline-none font-bold transition-all ${
                    formik.touched.agreedValue && formik.errors.agreedValue 
                    ? 'bg-red-50/50 border border-red-500 text-red-600 placeholder:text-red-400' 
                    : 'bg-gray-50 border border-transparent'
                }`} 
            />
            {formik.touched.agreedValue && formik.errors.agreedValue && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.agreedValue}</div>
            )}
        </div>

        <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase text-gray-400 ml-2 mb-1">Closure Date</label>
            <input 
                type="date" 
                {...formik.getFieldProps('expectedClosureDate')} 
                className={`w-full p-4 rounded-2xl outline-none transition-all ${
                    formik.touched.expectedClosureDate && formik.errors.expectedClosureDate 
                    ? 'bg-red-50/50 border border-red-500 text-red-600' 
                    : 'bg-gray-50 border border-transparent text-gray-600'
                }`} 
            />
            {formik.touched.expectedClosureDate && formik.errors.expectedClosureDate && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.expectedClosureDate}</div>
            )}
        </div>

        <button type="submit" className="w-full py-4 bg-[#5B3E59] text-white rounded-2xl font-bold hover:bg-[#4a3248] transition-all shadow-lg shadow-[#5B3E59]/20 mt-2">
            Confirm Deal
        </button>
      </form>
    </ModalWrapper>
  );
};