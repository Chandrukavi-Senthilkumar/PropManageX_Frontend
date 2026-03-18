import React, { useEffect, useState } from 'react';
import { contractService } from '../../services/contractService';
import { invoiceService } from '../../services/invoiceService';
import { 
    DocumentTextIcon, 
    UserIcon, 
    HomeIcon, 
    MagnifyingGlassIcon,
    ArrowPathIcon,
    BanknotesIcon,
    CalendarIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { AddInvoiceModal } from '../../components/Modals/AddInvoiceModal';

const ContractManagementPage = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedContract, setSelectedContract] = useState(null);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const res = await contractService.getContracts();
            // Handling both direct array and .data wrapper
            setContracts(Array.isArray(res) ? res : res.data || []);
        } catch (err) {
            console.error("Error loading contracts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const filteredContracts = contracts.filter(c => 
        c.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contractType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight underline decoration-blue-500/30">Contract Vault</h1>
                    <p className="text-gray-500 font-medium">Digital registry for sales and rental agreements.</p>
                </div>
                
                <div className="flex gap-3">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search tenant, unit, or type..." 
                            className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none w-80 shadow-sm focus:ring-2 focus:ring-blue-500/10 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={fetchContracts}
                        className="p-3.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowPathIcon className={`w-6 h-6 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-4">
                    <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Verifying Block... Syncing Registry</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredContracts.map((contract) => (
                        <ContractCard 
                            key={contract.contractID} 
                            contract={contract} 
                            onInvoiceClick={() => setSelectedContract(contract)}
                        />
                    ))}
                </div>
            )}

            {!loading && filteredContracts.length === 0 && (
                <div className="py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100 text-center">
                    <DocumentTextIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold italic">No records found matching your query.</p>
                </div>
            )}

            {/* Modal for Invoicing */}
            <AddInvoiceModal 
                isOpen={!!selectedContract} 
                onClose={() => setSelectedContract(null)} 
                contract={selectedContract}
                onSuccess={fetchContracts}
            />
        </div>
    );
};

/* --- CONTRACT CARD COMPONENT --- */
const ContractCard = ({ contract, onInvoiceClick }) => {
    const isSale = contract.contractType?.toLowerCase() === 'sale';
    
    return (
        <div className="bg-white rounded-[44px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col">
            <div className="p-8 flex-grow">
                {/* Status & ID */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                            ID: {contract.contractID?.slice(0, 8)}
                        </span>
                    </div>
                    <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase ${contract.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {contract.status}
                    </span>
                </div>

                {/* Primary Info */}
                <h3 className="text-2xl font-black text-gray-900 mb-6">{contract.contractType} Agreement</h3>

                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-[24px]">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500"><HomeIcon className="w-5 h-5"/></div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Unit Asset</p>
                            <p className="font-bold text-gray-800">Unit {contract.unitNumber}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-[24px]">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-yellow-600"><UserIcon className="w-5 h-5"/></div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Signatory</p>
                            <p className="font-bold text-gray-900">{contract.tenantName}</p>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3"/> Start
                        </p>
                        <p className="text-xs font-bold text-gray-700">{new Date(contract.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3"/> End
                        </p>
                        <p className="text-xs font-bold text-gray-700">{new Date(contract.endDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-gray-50/50 flex gap-3">
                {isSale && (
                    <button 
                        onClick={onInvoiceClick}
                        className="flex-1 bg-white border border-blue-100 text-blue-600 py-3 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                        <BanknotesIcon className="w-4 h-4" /> Create Invoice
                    </button>
                )}

            </div>
        </div>
    );
};

export default ContractManagementPage;