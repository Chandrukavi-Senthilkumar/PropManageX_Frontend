import React, { useEffect, useState } from 'react';
import { 
    MapPinIcon, 
    PlusIcon,
    WrenchScrewdriverIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { propertyService } from '../../services/propertyService';
import { unitAmenityService } from '../../services/unitAmenityService';
import { maintenanceService } from '../../services/maintenanceService';

// MODAL COMPONENT
const AddRequestModal = ({ isOpen, onClose, onSuccess, unitID }) => {
    const [formData, setFormData] = useState({
        category: 'Plumbing',
        description: '',
        priority: 'High',
        status: 'Open',
        raisedDate: new Date().toISOString().split('T')[0] 
    });

    if (!isOpen) return null;

    const formatDateForBackend = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                unitID: unitID,
                category: formData.category,
                description: formData.description,
                priority: formData.priority,
                status: formData.status,
                raisedDate: formatDateForBackend(formData.raisedDate)
            };

            await maintenanceService.createRequest(payload);
            
            // SUCCESS ALERT
            alert("Request created successfully!!!");
            
            onSuccess(); 
            onClose();
            setFormData({ 
                category: 'Plumbing', description: '', priority: 'High', status: 'Open', 
                raisedDate: new Date().toISOString().split('T')[0] 
            });
        } catch (err) {
            console.error("Submission Error:", err.response?.data || err.message);
            alert("Failed to create request. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 font-sans">
            <div className="bg-white rounded-[40px] w-full max-w-lg p-8 relative shadow-2xl animate-fadeIn border border-slate-100">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-black text-gray-800 mb-2 tracking-tight text-center">Request Maintenance</h2>
                <p className="text-center text-[10px] font-black text-blue-600 mb-8 uppercase tracking-[0.2em]">Unit Mapping: Active</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                        <select className="w-full mt-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                            <option>Plumbing</option><option>Electrical</option><option>Cleaning</option><option>Others</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea required className="w-full mt-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none h-24 focus:ring-2 focus:ring-blue-500" placeholder="Describe the issue..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Priority</label>
                            <select className="w-full mt-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                            <select className="w-full mt-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}><option>Open</option><option>InProgress</option><option>Completed</option></select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Raised Date</label>
                        <input type="date" className="w-full mt-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none" value={formData.raisedDate} onChange={(e) => setFormData({...formData, raisedDate: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-blue-700 transition-all mt-2">Submit Request</button>
                </form>
            </div>
        </div>
    );
};

// MAIN COMPONENT
const MyProperty = () => {
    const [property, setProperty] = useState(null);
    const [units, setUnits] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeUnitID, setActiveUnitID] = useState(null);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const propResponse = await propertyService.getProperties();
            const myProp = propResponse?.data?.data?.items?.[0] || propResponse?.data?.items?.[0];
            
            if (myProp) {
                setProperty(myProp);
                const [unitRes, maintRes] = await Promise.all([
                    unitAmenityService.getUnits({ PropertyID: myProp.propertyID }),
                    maintenanceService.getRequestsByProperty(myProp.propertyID)
                ]);

                setUnits(unitRes?.data?.items || unitRes?.data || []);
                const rawMaintData = maintRes?.data?.items || maintRes?.items || maintRes?.data || maintRes;
                setRequests(Array.isArray(rawMaintData) ? rawMaintData : []);
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchInitialData(); }, []);

    const handleRequestClick = (unitID) => {
        setActiveUnitID(unitID);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-20 text-center font-bold text-slate-400 font-sans">Syncing...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 pb-20 mt-4 font-sans animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* PROPERTY CARD */}
                <div className="lg:col-span-4 flex">
                    <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-blue-900/5 border border-slate-100 w-full flex flex-col">
                        <div className="h-52 w-full relative">
                            <img src={property?.imageUrl} alt={property?.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 bg-white flex-grow">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                                    <p className="text-xs font-black text-green-600 uppercase">{property?.status}</p>
                                </div>
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Units</p>
                                    <p className="text-xs font-black text-blue-600">{units.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* UNIT CARDS */}
                <div className="lg:col-span-8 flex gap-6">
                    {units.slice(0, 2).map(unit => (
                        <div key={unit.unitID} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex-1 flex flex-col justify-between hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-lg font-black">{unit.unitNumber}</div>
                                <button 
                                    onClick={() => handleRequestClick(unit.unitID)}
                                    className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-lg font-black text-slate-900">{unit.bedroomCount} BHK Residence</h4>
                                <p className="text-2xl font-black text-blue-600 mt-2 tracking-tighter">₹{unit.basePrice?.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TABLE SECTION */}
            <div className="mt-12 bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center gap-3">
                    <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-600"><WrenchScrewdriverIcon className="w-6 h-6" /></div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Maintenance History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Description</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Priority</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {requests.map((req, idx) => (
                                <tr key={req.maintenanceID || idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 text-sm font-bold text-slate-700">{req.category}</td>
                                    <td className="px-8 py-5 text-sm text-slate-500 font-medium max-w-xs truncate">{req.description}</td>
                                    <td className="px-8 py-5"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${req.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{req.priority}</span></td>
                                    <td className="px-8 py-5"><span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-orange-100">{req.status || 'Open'}</span></td>
                                    <td className="px-8 py-5 text-sm text-slate-400 font-bold tracking-tighter">{req.raisedDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddRequestModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchInitialData} 
                unitID={activeUnitID}
            />
        </div>
    );
};

export default MyProperty;