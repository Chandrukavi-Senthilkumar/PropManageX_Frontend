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
  showToast   // ✅ added (no logic change)
}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      dealID: dealID,
      contractType: 'Sale',
      startDate: new Date().toISOString().split('T')[0],
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

        // ✅ close modal first
        onClose();

        // ✅ refresh parent data
        onSuccess?.();

        // ✅ show toast AFTER modal closes
        setTimeout(() => {
          showToast?.('Contract created successfully!', 'success');
        }, 0);

      } catch (err) {
        console.error('Contract Error:', err);

        // ✅ close modal
        onClose();

        // ✅ toast instead of alert
        setTimeout(() => {
          showToast?.('Failed to create contract', 'error');
        }, 0);
      } finally {
        setLoading(false);
      }
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#F3EEF2] w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-slideUp">

        {/* Header */}
        <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <DocumentCheckIcon className="w-6 h-6 text-blue-400" />
              New Contract
            </h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Finalizing Deal: {dealID.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-8 space-y-5">

          {/* Contract Type */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-gray-400">
              Contract Type
            </label>
            <select
              {...formik.getFieldProps('contractType')}
              className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-bold outline-none"
            >
              <option>Sale</option>
              <option>Lease</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-gray-400">
                Start Date
              </label>
              <input
                type="date"
                {...formik.getFieldProps('startDate')}
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-gray-400">
                End Date
              </label>
              <input
                type="date"
                {...formik.getFieldProps('endDate')}
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none"
              />
            </div>
          </div>

          {/* Contract Value */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-gray-400">
              Final Contract Value ($)
            </label>
            <input
              type="number"
              {...formik.getFieldProps('contractValue')}
              placeholder="0.00"
              className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none font-black text-blue-600"
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white py-5 rounded-[24px]
                       font-black uppercase tracking-widest shadow-lg
                       shadow-blue-100 hover:bg-blue-700 transition-all
                       active:scale-95 mt-4 disabled:opacity-50"
          >
            {loading ? 'Creating Contract...' : 'Generate & Save Contract'}
          </button>

        </form>
      </div>
    </div>
  );
};