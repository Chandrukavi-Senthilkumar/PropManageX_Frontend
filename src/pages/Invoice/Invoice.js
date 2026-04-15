import React, { useEffect, useState } from 'react';
import { invoiceService } from '../../services/invoiceService';
import {
  BanknotesIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const InvoiceManagementPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, open: 0 });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await invoiceService.getInvoices();
      const items = res?.data?.items || [];
      setInvoices(items);

      const openCount = items.filter(i => i.status === 'Open').length;
      setStats({ total: items.length, open: openCount });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const totalAmount = invoices.reduce((a, c) => a + c.amount, 0);

  return (
    <div className="bg-[#fcfaf8] min-h-screen pb-20">

      {/* HERO – fixed background */}
      <div className="px-8 pt-16 pb-24 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight">
          Financial Ledger
        </h1>
        <p className="text-stone-500 text-sm font-medium mt-4 max-w-2xl mx-auto">
          Centralised invoice tracking and receivables overview.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 space-y-12">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Total Invoices"
            value={stats.total}
            icon={DocumentTextIcon}
          />
          <StatCard
            label="Open Invoices"
            value={stats.open}
            icon={ClockIcon}
          />
          <StatCard
            label="Total Receivables"
            value={`₹ ${totalAmount.toLocaleString()}`}
            icon={BanknotesIcon}
          />
          <div className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-sm flex items-center justify-between">
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">
              Refresh Data
            </p>
            <button
              onClick={fetchInvoices}
              className="p-3 bg-[#F6F1F3] text-[#5B3E59] rounded-full"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="py-32 text-center text-stone-400 font-bold italic">
            Compiling financial data…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {invoices.map(invoice => (
              <InvoiceCard key={invoice.invoiceID} invoice={invoice} />
            ))}
          </div>
        )}

        {!loading && invoices.length === 0 && (
          <div className="py-32 text-center text-stone-400 font-bold italic">
            No invoices available.
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">
        {label}
      </p>
      <h3 className="text-2xl font-black text-stone-800 mt-1">{value}</h3>
    </div>
    <div className="p-3.5 bg-[#F6F1F3] text-[#5B3E59] rounded-2xl">
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

/* ================= INVOICE CARD (MATCHED) ================= */
const InvoiceCard = ({ invoice }) => {
  const statusMap = {
    Open: 'bg-orange-400',
    Closed: 'bg-emerald-500',
    Overdue: 'bg-red-500',
  };

  return (
    <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">

      {/* TOP ACCENT */}
      <div className={`h-1.5 ${statusMap[invoice.status] || 'bg-[#5B3E59]'}`} />

      <div className="p-8 space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div style={{ color: '#FFFFFF' }} className="w-14 h-14 bg-gradient-to-br from-[#5B3E59] to-[#7d5d7a] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow">
              I
            </div>
            <div>
              <h4 className="text-lg font-black text-stone-900">
                Billing {invoice.period}
              </h4>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">
                INV {invoice.invoiceID.slice(0, 8)}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase bg-stone-100 text-stone-600">
            {invoice.status}
          </span>
        </div>

        {/* INFO PANEL */}
        <div className="bg-[#fcfbf9] p-5 rounded-2xl border border-stone-100 space-y-4">
          <div className="flex items-center gap-2 text-stone-600">
            <DocumentTextIcon className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-black">
              Contract {invoice.contractID.slice(0, 13)}…
            </span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <CalendarIcon className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-black">
              Due {new Date(invoice.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            Amount Due
          </p>
          <p className="text-3xl font-black text-stone-900 tracking-tight">
            ₹ {invoice.amount.toLocaleString()}
          </p>
        </div>

      </div>
    </div>
  );
};

export default InvoiceManagementPage;