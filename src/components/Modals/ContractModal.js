import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { contractService } from '../../services/contractService';
import { XMarkIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export const AddContractModal = ({
  isOpen,
  onClose,
  dealID,
  onSuccess,
  showToast
}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      dealID: dealID,
      contractType: 'Sale',
      startDate: '',
      endDate: '',
      contractValue: ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      contractType: Yup.string().required('Contract type is required'),
      startDate: Yup.string().required('Start date is required'),
      endDate: Yup.string().required('End date is required'),
      contractValue: Yup.number()
        .typeError('Please enter a valid amount')
        .required('Contract value is required')
        .positive('Value must be greater than 0'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = {
          ...values,
          dealID: dealID,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          contractValue: parseFloat(values.contractValue)
        };
        await contractService.createContract(payload);
        onClose();
        onSuccess?.();
        setTimeout(() => {
          showToast?.('Contract created successfully!', 'success');
        }, 0);
      } catch (err) {
        onClose();
        setTimeout(() => {
          showToast?.('Failed to create contract', 'error');
        }, 0);
      } finally {
        setLoading(false);
      }
    }
  });

  if (!isOpen) return null;

  // Helper for error message style to match your image
  const ErrorMessage = ({ name }) => {
    if (formik.touched[name] && formik.errors[name]) {
      return (
        <div className="text-[13px] font-bold text-[#374151] mt-2 text-center tracking-tight">
          {formik.errors[name]}
        </div>
      );
    }
    return null;
  };

  const getInputClasses = (fieldName) => {
    const hasError = formik.touched[fieldName] && formik.errors[fieldName];
    return `w-full rounded-2xl px-5 py-4 font-bold outline-none transition-all ${
      hasError 
      ? 'bg-red-50/50 text-red-600' 
      : 'bg-white text-gray-700 shadow-sm'
    }`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#F0EDF1] w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border-none">

        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-black text-[#1c1c1e] flex items-center gap-2">
            <DocumentCheckIcon className="w-8 h-8 text-[#5B3E59]" />
            New Contract
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-black transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-8 pt-4 space-y-6">

          {/* Contract Type */}
          <div className="space-y-1 text-center">
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
              Contract Type
            </label>
            <select
              {...formik.getFieldProps('contractType')}
              className={getInputClasses('contractType')}
            >
              <option value="Sale">Sale</option>
              <option value="Lease">Lease</option>
            </select>
            <ErrorMessage name="contractType" />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-center">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
                Start Date
              </label>
              <input
                type="date"
                {...formik.getFieldProps('startDate')}
                className={getInputClasses('startDate')}
              />
              <ErrorMessage name="startDate" />
            </div>

            <div className="space-y-1 text-center">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
                End Date
              </label>
              <input
                type="date"
                {...formik.getFieldProps('endDate')}
                className={getInputClasses('endDate')}
              />
              <ErrorMessage name="endDate" />
            </div>
          </div>

          {/* Contract Value */}
          <div className="space-y-1 text-center">
            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
              Final Contract Value ($)
            </label>
            <input
              type="number"
              {...formik.getFieldProps('contractValue')}
              placeholder="0.00"
              className={getInputClasses('contractValue')}
            />
            <ErrorMessage name="contractValue" />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 font-black text-[#1c1c1e] hover:text-gray-500 transition-colors uppercase text-xs tracking-widest"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              style={{ backgroundColor: '#5B3E59', color: '#ffffff' }}
              className="py-4 px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-[#5B3E59]/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 border-none"
            >
              {loading ? 'Creating...' : 'Generate Contract'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};