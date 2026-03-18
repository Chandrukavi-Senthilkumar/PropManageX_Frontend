import React, { useState } from 'react';
import { contractService } from '../../services/contractService';
import { XMarkIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export const AddContractModal = ({ isOpen, onClose, dealID, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        dealID: dealID,
        contractType: 'Sale',
        startDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD for input
        endDate: '',
        contractValue: 0
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Format dates back to ISO string for your API
            const payload = {
                ...formData,
                dealID: dealID,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                contractValue: parseFloat(formData.contractValue)
            };
            await contractService.createContract(payload);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Contract Error:", err);
            alert("Failed to create contract. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-slideUp">
                <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <DocumentCheckIcon className="w-6 h-6 text-blue-400" /> New Contract
                        </h2>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Finalizing Deal: {dealID.slice(0,8)}...</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Contract Type</label>
                        <select 
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500"
                            value={formData.contractType}
                            onChange={(e) => setFormData({...formData, contractType: e.target.value})}
                        >
                            <option>Sale</option>
                            <option>Lease</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Start Date</label>
                            <input 
                                type="date" required
                                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">End Date</label>
                            <input 
                                type="date" required
                                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold"
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Final Contract Value ($)</label>
                        <input 
                            type="number" required
                            placeholder="0.00"
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-black text-blue-600"
                            value={formData.contractValue}
                            onChange={(e) => setFormData({...formData, contractValue: e.target.value})}
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Creating Contract...' : 'Generate & Save Contract'}
                    </button>
                </form>
            </div>
        </div>
    );
};