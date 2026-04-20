import React, { useEffect, useState } from 'react';
import { contractService } from '../../services/contractService';
import {
  DocumentTextIcon,
  UserIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  BanknotesIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { AddInvoiceModal } from '../../components/Modals/AddInvoiceModal';
import Toast from '../../components/Toast/Toast';

const ContractManagementPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);

  /* ✅ TOAST STATE (ADDED) */
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await contractService.getContracts();
      setContracts(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const filteredContracts = contracts.filter(
    c =>
      c.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contractType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#fcfaf8] min-h-screen pb-20">

      {/* ✅ TOAST RENDERED HERE */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* HERO */}
      <div className="bg-[#FAF6F9] px-8 pt-16 pb-24 text-center rounded-b-[40px] shadow-lg">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Contract Vault
        </h1>
        <p className="text-slate-300 text-sm font-medium mt-4 max-w-2xl mx-auto">
          Secure repository for all sale and rental agreements.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 space-y-12">

        {/* FILTER BAR */}
        <div className="bg-[#EFE9F0] p-3 rounded-full shadow-xl border border-stone-100 flex items-center justify-between gap-4">
          <div className="relative w-full md:w-1/3 ml-2">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full text-sm font-medium bg-transparent outline-none"
            />
          </div>

          {/* <button
            onClick={fetchContracts}
            className="p-3 mr-2 bg-[#F6F1F3] text-[#5B3E59] rounded-full hover:bg-stone-200 transition-all"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button> */}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="py-32 text-center text-stone-400 font-bold italic">
            Loading contracts...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredContracts.map(contract => (
              <ContractCard
                key={contract.contractID}
                contract={contract}
                onInvoiceClick={() => setSelectedContract(contract)}
              />
            ))}
          </div>
        )}

        {!loading && filteredContracts.length === 0 && (
          <div className="py-32 text-center text-stone-400 font-bold italic">
            No matching contracts found.
          </div>
        )}
      </div>

      {/* ✅ MODAL → CLOSE → TOAST */}
      <AddInvoiceModal
        isOpen={!!selectedContract}
        onClose={() => setSelectedContract(null)}
        contract={selectedContract}
        onSuccess={() => {
          fetchContracts();
          setSelectedContract(null);
          setTimeout(() => {
            showToast('Invoice created successfully!', 'success');
          }, 0);
        }}
      />
    </div>
  );
};

/* ================= CONTRACT CARD ================= */

const ContractCard = ({ contract, onInvoiceClick }) => {
  const isLease = contract.contractType?.toLowerCase() === 'sale';

  return (
    <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden">
      <div className="h-1.5 bg-[#5B3E59]" />

      <div className="p-8 space-y-6 flex-grow">

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#5B3E59] to-[#7d5d7a] rounded-2xl flex items-center justify-center font-black text-xl shadow-lg uppercase border-none"style={{ color: '#ffffff' }}>
                    {contract.tenantName?.charAt(0)}
                  </div>
            <div>
              <h4 className="text-lg font-black text-stone-900">
                {contract.contractType} Contract
              </h4>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mt-1">
                ID {contract.contractID?.slice(0, 8)}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider ${
              contract.status === 'Active'
                ? 'bg-green-50 text-green-600 border border-green-100'
                : 'bg-stone-100 text-stone-400 border border-stone-200'
            }`}
          >
            {contract.status}
          </span>
        </div>

        <div className="bg-[#fcfbf9] p-5 rounded-2xl border border-stone-100 space-y-4">
          <div className="flex items-center gap-3 text-stone-600">
            <HomeIcon className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-black">
              Unit {contract.unitNumber}
            </span>
          </div>

          <div className="flex items-center gap-3 text-stone-600">
            <UserIcon className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-black">
              {contract.tenantName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" /> Start
            </p>
            <p className="text-xs font-bold text-stone-700">
              {new Date(contract.startDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" /> End
            </p>
            <p className="text-xs font-bold text-stone-700">
              {new Date(contract.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {isLease && (
            <div className="p-6 pt-0">
              <button
                onClick={onInvoiceClick}
                // style={{ color: '#ffffff' }} guarantees the white text color
                style={{ color: '#ffffff' }}
                className="w-full bg-[#5B3E59] py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#4a3248] transition-all shadow-xl shadow-stone-200/50 flex items-center justify-center gap-2 border-none"
              >
                <BanknotesIcon className="w-4 h-4" />
                Create Invoice
              </button>
            </div>
          )}
    </div>
  );
};

export default ContractManagementPage;