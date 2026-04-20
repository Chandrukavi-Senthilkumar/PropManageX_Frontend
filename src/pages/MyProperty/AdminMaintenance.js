import React, { useEffect, useState } from 'react';
import { 
    WrenchScrewdriverIcon, 
    UserGroupIcon, 
    BanknotesIcon, 
    CheckCircleIcon, 
    ClockIcon, 
    XMarkIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { maintenanceService } from '../../services/maintenanceService';
import Toast from '../../components/Toast/Toast';

const MaintenanceAdmin = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vendorData, setVendorData] = useState({
        vendorName: '',
        cost: 0,
        assignedDate: new Date().toISOString().split('T')[0],
        completionDate: ''
    });

    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

    const fetchAllRequests = async () => {
        try {
            setLoading(true);
            const res = await maintenanceService.getAllRequests();
            setRequests(res?.data || []);
        } catch (err) {
            showToast('Failed to load maintenance requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllRequests(); }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await maintenanceService.updateStatus(id, newStatus);
            showToast(`Status updated to ${newStatus}`);
            fetchAllRequests();
        } catch (err) {
            showToast('Update failed', 'error');
        }
    };

    const handleVendorSubmit = async (e) => {
        e.preventDefault();
        try {
            await maintenanceService.assignVendor({
                requestID: selectedRequest.requestID,
                ...vendorData,
                cost: parseFloat(vendorData.cost)
            });
            showToast('Vendor and costs updated successfully');
            setIsModalOpen(false);
            fetchAllRequests();
        } catch (err) {
            showToast('Assignment failed', 'error');
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#4B3856]">LOADING ADMIN PANEL...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 min-h-screen">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-[#4B3856]">Operations Center</h1>
                    <p className="mt-2 font-medium text-gray-500">Manage vendor assignments and repair statuses.</p>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-6">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Pending</p>
                        <p className="text-xl font-black text-orange-500">{requests.filter(r => r.status !== 'Completed').length}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Total</p>
                        <p className="text-xl font-black text-[#4B3856]">{requests.length}</p>
                    </div>
                </div>
            </header>

            <div className="grid gap-6">
                {requests.map((req) => (
                    <div key={req.requestID} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                            {/* Request Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-purple-100 text-[#4B3856] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {req.category}
                                    </span>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${req.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {req.priority} Priority
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-[#4B3856]">{req.description}</h3>
                               
                                <p className="text-sm text-gray-400 mt-1 font-bold italic">Raised: {req.raisedDate}</p>
                                {req.vendorName && (
                                    <div className="mt-4 flex gap-4 text-sm font-bold text-gray-600">
                                        <div className="flex items-center gap-1"><UserGroupIcon className="w-4 h-4 text-purple-400"/> {req.vendorName}</div>
                                        <div className="flex items-center gap-1"><BanknotesIcon className="w-4 h-4 text-green-400"/> ${req.cost}</div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-3 lg:border-l lg:pl-8 border-gray-100">
                                <select 
                                    value={req.status}
                                    onChange={(e) => handleStatusUpdate(req.requestID, e.target.value)}
                                    className="p-4 bg-gray-50 border-none rounded-2xl font-black text-xs text-[#4B3856] focus:ring-2 focus:ring-[#4B3856] outline-none"
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>

                                <button 
                                    onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                                    className="bg-[#4B3856] text-white px-6 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-[#3a2b42] transition-all active:scale-95"
                                >
                                    <AdjustmentsHorizontalIcon className="w-4 h-4" /> Assign Vendor
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Vendor Assignment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#4B3856]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#F3EEF2] p-8 rounded-[2.5rem] w-full max-w-md relative shadow-2xl">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-black text-[#4B3856] mb-2">Assign Vendor</h2>
                        <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Request: {selectedRequest?.category}</p>

                        <form onSubmit={handleVendorSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Vendor Name</label>
                                <input 
                                    type="text" required
                                    className="w-full p-4 bg-white rounded-2xl outline-none font-bold"
                                    placeholder="e.g. Acme Plumbing"
                                    value={vendorData.vendorName}
                                    onChange={(e) => setVendorData({...vendorData, vendorName: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Cost ($)</label>
                                    <input 
                                        type="number" required
                                        className="w-full p-4 bg-white rounded-2xl outline-none font-bold"
                                        value={vendorData.cost}
                                        onChange={(e) => setVendorData({...vendorData, cost: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Date</label>
                                    <input 
                                        type="date" required
                                        className="w-full p-4 bg-white rounded-2xl outline-none font-bold text-xs"
                                        value={vendorData.assignedDate}
                                        onChange={(e) => setVendorData({...vendorData, assignedDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button className="w-full bg-[#4B3856] text-white py-4 rounded-2xl font-black mt-4 shadow-lg hover:bg-[#3a2b42] transition-all">
                                Update Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {toast.visible && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast({ ...toast, visible: false })} 
                />
            )}
        </div>
    );
};

export default MaintenanceAdmin;