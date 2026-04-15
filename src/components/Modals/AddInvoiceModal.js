import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { invoiceService } from '../../services/invoiceService';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const AddInvoiceModal = ({ isOpen, onClose, contract, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      contractID: contract?.contractID || '',
      period: '',
      amount: contract?.contractValue || 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Open'
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      period: Yup.string().required('Billing period is required'),
      amount: Yup.number().min(1, 'Amount required').required('Amount is required'),
      dueDate: Yup.string().required('Due date is required'),
      status: Yup.string().oneOf(['Open', 'Closed', 'Overdue']).required('Status is required')
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          dueDate: new Date(values.dueDate).toISOString()
        };
        await invoiceService.createInvoice(payload);
        onSuccess();
        onClose();
      } catch (err) {
        alert(err.response?.data?.message || 'Error generating invoice.');
      }
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
      <div className="bg-[#F3EEF2] rounded-[40px] w-full max-w-md p-10 relative shadow-2xl border border-gray-100">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-black transition-all"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-black mb-2 text-gray-900 tracking-tight">
          Generate Invoice
        </h2>
        <p className="text-[10px] font-black text-blue-600 mb-8 uppercase tracking-widest">
          Unit: {contract?.unitNumber}
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5">

          {/* Billing Period */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 block">
              Billing Period
            </label>
            <input
              {...formik.getFieldProps('period')}
              placeholder="e.g. March 2026 Installment"
              className={`w-full p-4 rounded-2xl outline-none transition-all font-bold ${
                formik.touched.period && formik.errors.period
                  ? 'bg-red-50/50 border border-red-500 text-red-600'
                  : 'bg-gray-50 border border-transparent'
              }`}
            />
            {formik.touched.period && formik.errors.period && (
              <div className="text-red-500 text-xs font-bold text-center">
                {formik.errors.period}
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 block">
              Amount ($)
            </label>
            <input
              type="number"
              {...formik.getFieldProps('amount')}
              className={`w-full p-4 rounded-2xl outline-none transition-all font-black text-lg ${
                formik.touched.amount && formik.errors.amount
                  ? 'bg-red-50/50 border border-red-500 text-red-600'
                  : 'bg-gray-50 border border-transparent text-blue-600'
              }`}
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="text-red-500 text-xs font-bold text-center">
                {formik.errors.amount}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 block">
              Invoice Status
            </label>
            <select
              {...formik.getFieldProps('status')}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700 border border-transparent"
            >
              <option value="Open">Open (Unpaid)</option>
              <option value="Closed">Closed (Paid)</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 block">
              Payment Due Date
            </label>
            <input
              type="date"
              {...formik.getFieldProps('dueDate')}
              className={`w-full p-4 rounded-2xl outline-none transition-all font-bold ${
                formik.touched.dueDate && formik.errors.dueDate
                  ? 'bg-red-50/50 border border-red-500 text-red-600'
                  : 'bg-gray-50 border border-transparent text-gray-700'
              }`}
            />
            {formik.touched.dueDate && formik.errors.dueDate && (
              <div className="text-red-500 text-xs font-bold text-center">
                {formik.errors.dueDate}
              </div>
            )}
          </div>

          <button
                  type="submit"
                  // Using inline style to guarantee the exact purple shade and white text
                  style={{ backgroundColor: '#5B3E59', color: '#ffffff' }}
                  className="w-full py-5 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-[#5B3E59]/20 hover:opacity-90 transition-all active:scale-95 mt-4 border-none" >
                  Generate Invoice
          </button>

        </form>
      </div>
    </div>
  );
};
