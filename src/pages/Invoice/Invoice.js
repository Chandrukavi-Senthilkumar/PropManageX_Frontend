import React, { useEffect, useState } from 'react';
import { invoiceService } from '../../services/invoiceService';
import { 
    BanknotesIcon, 
    CalendarIcon, 
    DocumentTextIcon, 
    ArrowPathIcon,
    FunnelIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const InvoiceManagementPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, open: 0 });

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await invoiceService.getInvoices();
            // Your API structure: res.data.items
            const items = res?.data?.items || [];
            setInvoices(items);
            
            // Simple stats calculation
            const openCount = items.filter(i => i.status === 'Open').length;
            setStats({ total: items.length, open: openCount });
        } catch (err) {
            console.error("Invoice Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            {/* 1. Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Financial Ledger</h1>
                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">Invoice Management</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BanknotesIcon className="w-5 h-5"/></div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Total Receivables</p>
                            <p className="font-black text-gray-900">${invoices.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={fetchInvoices}
                        className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowPathIcon className={`w-6 h-6 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* 2. Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Compiling Financial Data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invoices.map((invoice) => (
                        <InvoiceCard key={invoice.invoiceID} invoice={invoice} />
                    ))}
                </div>
            )}

            {!loading && invoices.length === 0 && (
                <div className="py-32 bg-white rounded-[44px] border-2 border-dashed border-gray-100 text-center">
                    <DocumentTextIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold italic">No invoices found in the system.</p>
                </div>
            )}
        </div>
    );
};

/* --- INVOICE CARD COMPONENT --- */
const InvoiceCard = ({ invoice }) => {
    // Status color mapping
    const statusStyles = {
        'Open': { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: <ClockIcon className="w-4 h-4"/> },
        'Closed': { bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircleIcon className="w-4 h-4"/> },
        'Overdue': { bg: 'bg-red-50', text: 'text-red-700', icon: <ExclamationCircleIcon className="w-4 h-4"/> }
    };

    const style = statusStyles[invoice.status] || statusStyles['Open'];

    return (
        <div className="bg-white rounded-[38px] border border-gray-100 shadow-sm p-8 hover:shadow-xl transition-all duration-500 flex flex-col group">
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inv #{invoice.invoiceID.slice(0, 8)}</span>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">Billing Period: {invoice.period}</h3>
                </div>
                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${style.bg} ${style.text}`}>
                    {style.icon} {invoice.status}
                </div>
            </div>

            <div className="space-y-4 flex-grow mb-8">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500"><DocumentTextIcon className="w-5 h-5"/></div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase">Associated Contract</p>
                        <p className="text-xs font-bold text-gray-700">{invoice.contractID.slice(0, 13)}...</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-purple-500"><CalendarIcon className="w-5 h-5"/></div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase">Payment Due</p>
                        <p className="text-xs font-bold text-gray-700">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Due</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">${invoice.amount?.toLocaleString()}</p>
                </div>
             
            </div>
        </div>
    );
};

export default InvoiceManagementPage;