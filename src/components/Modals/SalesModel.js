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

// UI CHANGE: Soft gray background, no borders, deeper shadow
const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-[#F0EDF1] rounded-[2.5rem] w-full max-w-md p-8 pt-10 relative shadow-2xl border-none">
        <button type="button" onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black mb-8 text-[#1c1c1e] tracking-tight text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// Reusable Input styles to match the pure white, borderless look
const inputClasses = "w-full p-4 bg-white rounded-2xl border-none outline-none font-medium text-gray-700 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-[#5B3E59]/20 transition-all";
const inputErrorClasses = "w-full p-4 bg-red-50 rounded-2xl border-none outline-none font-medium text-red-600 placeholder:text-red-400 shadow-sm focus:ring-2 focus:ring-red-500/20 transition-all";

export const UpdateDealStatusModal = ({ isOpen, onClose, deal, onSuccess, showToast }) => {
    const formik = useFormik({
        initialValues: { status: deal?.status || 'Open' },
        enableReinitialize: true,
        validationSchema: Yup.object({
            status: Yup.string().required('Status is required')
        }),
        onSubmit: async (values) => {
            try {
                await SaleService.updateDealStatus(deal.dealID || deal.dealId, values.status);
                if (showToast) showToast('Deal status updated successfully!', 'success');
                if (onSuccess) onSuccess();
                onClose();
            } catch (err) { 
                if (showToast) showToast('Failed to update deal status', 'error');
            }
        }
    });

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Update Status">
            <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-center border-none">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Client</p>
                    <p className="font-black text-[#1c1c1e] text-lg">{deal?.customerName}</p>
                </div>
                <div className="space-y-1">
                    <select 
                        {...formik.getFieldProps('status')} 
                        className={formik.touched.status && formik.errors.status ? inputErrorClasses : inputClasses}
                    >
                        <option value="Open">Open</option>
                        <option value="Booked">Booked</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    {formik.touched.status && formik.errors.status && (
                        <div className="text-red-500 text-xs font-bold mt-1 text-center">{formik.errors.status}</div>
                    )}
                </div>
                
                {/* UI CHANGE: Cancel & Submit Layout */}
                <div className="flex items-center justify-between pt-6">
                    <button type="button" onClick={onClose} className="px-4 font-black text-[#1c1c1e] hover:text-gray-500 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" style={{ color: '#ffffff' }} className="py-4 px-8 bg-[#5B3E59] text-white rounded-2xl font-black hover:bg-[#4a3248] transition-all shadow-md">
                        Save Status
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};

export const AddLeadModal = ({ isOpen, onClose, propertyID, unitID, onSuccess, showToast }) => {
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
        if (showToast) showToast('Lead captured successfully!', 'success');
        if (onSuccess) onSuccess(); 
        onClose(); 
      } catch (err) { 
        if (showToast) showToast('Failed to capture lead', 'error');
      }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Capture Lead">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-1">
            <input 
                {...formik.getFieldProps('customerName')} 
                placeholder="Customer Name" 
                className={formik.touched.customerName && formik.errors.customerName ? inputErrorClasses : inputClasses} 
            />
            {formik.touched.customerName && formik.errors.customerName && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.customerName}</div>
            )}
        </div>

        <div className="space-y-1">
            <input 
                {...formik.getFieldProps('contactInfo')} 
                placeholder="Contact Info (Email or Phone)" 
                className={formik.touched.contactInfo && formik.errors.contactInfo ? inputErrorClasses : inputClasses} 
            />
            {formik.touched.contactInfo && formik.errors.contactInfo && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.contactInfo}</div>
            )}
        </div>

        <div className="space-y-1">
            <select {...formik.getFieldProps('interestType')} className={inputClasses}>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
            </select>
        </div>

        <div className="flex items-center justify-between pt-6">
            <button type="button" onClick={onClose} className="px-4 font-black text-[#1c1c1e] hover:text-gray-500 transition-colors">
                Cancel
            </button>
            <button type="submit" style={{ color: '#ffffff' }} className="py-4 px-8 bg-[#5B3E59] text-white rounded-2xl font-black hover:bg-[#4a3248] transition-all shadow-md">
                Create Lead
            </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export const AddSiteVisitModal = ({ isOpen, onClose, leadID, onSuccess, showToast }) => {
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
        if (showToast) showToast('Site visit scheduled successfully!', 'success');
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { 
        if (showToast) showToast('Failed to schedule visit', 'error');
      }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Schedule Visit">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-1">
            <input 
                type="date" 
                {...formik.getFieldProps('visitDate')} 
                className={formik.touched.visitDate && formik.errors.visitDate ? inputErrorClasses : inputClasses} 
            />
            {formik.touched.visitDate && formik.errors.visitDate && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.visitDate}</div>
            )}
        </div>

        <div className="space-y-1">
            <textarea 
                {...formik.getFieldProps('notes')} 
                placeholder="Additional Notes (Optional)" 
                className={`${inputClasses} h-28 resize-none`} 
            />
        </div>

        <div className="flex items-center justify-between pt-6">
            <button type="button" onClick={onClose} className="px-4 font-black text-[#1c1c1e] hover:text-gray-500 transition-colors">
                Cancel
            </button>
            <button type="submit" style={{ color: '#ffffff' }} className="py-4 px-8 bg-[#5B3E59] text-white rounded-2xl font-black hover:bg-[#4a3248] transition-all shadow-md">
                Confirm
            </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export const EditSiteVisitModal = ({ isOpen, onClose, visit, onSuccess, showToast }) => {
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
        if (showToast) showToast('Visit notes updated successfully!', 'success');
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { 
        if (showToast) showToast('Failed to update notes', 'error');
      }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Update Notes">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="w-full p-4 bg-white rounded-2xl shadow-sm border-none text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Scheduled Date</p>
            <p className="font-black text-[#1c1c1e]">{formik.values.visitDate || 'N/A'}</p>
        </div>

        <div className="space-y-1">
            <textarea 
                {...formik.getFieldProps('notes')} 
                placeholder="Update Notes..." 
                className={`${formik.touched.notes && formik.errors.notes ? inputErrorClasses : inputClasses} h-32 resize-none`} 
            />
            {formik.touched.notes && formik.errors.notes && (
                <div className="text-red-500 text-xs font-bold text-center">{formik.errors.notes}</div>
            )}
        </div>

        <div className="flex items-center justify-between pt-6">
            <button type="button" onClick={onClose} className="px-4 font-black text-[#1c1c1e] hover:text-gray-500 transition-colors">
                Cancel
            </button>
            <button type="submit"  style={{ color: '#ffffff' }} className="py-4 px-8 bg-[#5B3E59] text-white rounded-2xl font-black hover:bg-[#4a3248] transition-all shadow-md">
                Update Notes
            </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export const AddDealModal = ({ isOpen, onClose, lead, onSuccess, showToast }) => {
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
        if (showToast) showToast('Deal created successfully!', 'success');
        if (onSuccess) onSuccess();
        onClose();
      } catch (err) { 
        if (showToast) showToast('Failed to create deal', 'error');
      }
    }
  });

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create Deal">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        
        <div className="p-4 bg-white rounded-2xl shadow-sm text-center border-none mb-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Client</p>
            <p className="font-black text-[#1c1c1e] text-lg">{lead?.customerName}</p>
        </div>

        {/* 2-Column Grid matching the sample image UI style */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <select {...formik.getFieldProps('dealType')} className={inputClasses}>
                    <option value="Sale">Sale</option>
                    <option value="Lease">Lease</option>
                </select>
            </div>

            <div className="space-y-1">
                <input 
                    type="date" 
                    {...formik.getFieldProps('expectedClosureDate')} 
                    className={formik.touched.expectedClosureDate && formik.errors.expectedClosureDate ? inputErrorClasses : inputClasses} 
                />
                
            </div>
            
        </div>
        
        {/* Full width input for value */}
        <div className="space-y-1 pt-2">
            <input 
                type="number" 
                {...formik.getFieldProps('agreedValue')} 
                placeholder="Agreed Value (₹)" 
                className={formik.touched.agreedValue && formik.errors.agreedValue ? inputErrorClasses : inputClasses} 
            />
            {formik.touched.agreedValue && formik.errors.agreedValue && (
                <div className="text-red-500 text-xs font-bold text-center mt-1">{formik.errors.agreedValue}</div>
            )}
           
        </div>

        <div className="flex items-center justify-between pt-6">
            <button type="button" onClick={onClose} className="px-4 font-black text-[#1c1c1e] hover:text-gray-500 transition-colors">
                Cancel
            </button>
                  <button type="submit" style={{ color: '#ffffff' }} className="py-4 px-8 bg-[#5B3E59] rounded-2xl font-black hover:bg-[#4a3248] transition-all shadow-md border-none">
                        Create Deal
                    </button>
        </div>
      </form>
    </ModalWrapper>
  );
};