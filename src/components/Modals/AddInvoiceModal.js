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
            // FIXED: Defaulting to one of the three allowed backend values
            status: 'Open' 
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            period: Yup.string().required('Required'),
            amount: Yup.number().min(1, 'Amount required').required('Required'),
            dueDate: Yup.string().required('Required'),
            status: Yup.string().oneOf(['Open', 'Closed', 'Overdue']).required('Required')
        }),
        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    // Ensuring the date is properly formatted for the backend
                    dueDate: new Date(values.dueDate).toISOString()
                };
                await invoiceService.createInvoice(payload);
                alert("Invoice Generated Successfully!");
                onSuccess();
                onClose();
            } catch (err) {
                // Showing the specific API error if it fails again
                alert(err.response?.data?.message || "Error generating invoice.");
            }
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
            <div className="bg-white rounded-[40px] w-full max-w-md p-10 relative shadow-2xl border border-gray-100 animate-fadeIn">
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-all">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-3xl font-black mb-2 text-gray-900 tracking-tight">Generate Invoice</h2>
                <p className="text-[10px] font-black text-blue-600 mb-8 uppercase tracking-widest">Unit: {contract?.unitNumber}</p>
                
                <form onSubmit={formik.handleSubmit} className="space-y-5">
                    {/* Billing Period */}
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1 block">Billing Period</label>
                        <input {...formik.getFieldProps('period')} placeholder="e.g. March 2026 Installment" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold border border-transparent focus:border-blue-100" />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1 block">Amount ($)</label>
                        <input type="number" {...formik.getFieldProps('amount')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-black text-blue-600 text-lg" />
                    </div>

                    {/* Status Dropdown - FIXES THE ARGUMENT EXCEPTION */}
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1 block">Invoice Status</label>
                        <select 
                            {...formik.getFieldProps('status')} 
                            className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700 border border-transparent focus:border-blue-100 appearance-none cursor-pointer"
                        >
                            <option value="Open">Open (Unpaid)</option>
                            <option value="Closed">Closed (Paid)</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-1 block">Payment Due Date</label>
                        <input type="date" {...formik.getFieldProps('dueDate')} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold" />
                    </div>

                    <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black shadow-xl hover:bg-black transition-all active:scale-95 mt-4">
                        Generate & Sync Invoice
                    </button>
                </form>
            </div>
        </div>
    );
};