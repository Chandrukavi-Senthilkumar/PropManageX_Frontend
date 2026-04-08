import React, { useEffect, useState } from 'react';
import {
  WrenchScrewdriverIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CheckCircleIcon,
  HomeIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import { maintenanceService } from '../../services/maintenanceService';
import { bookingService } from '../../services/bookingService';
import Toast from '../../components/Toast/Toast';

/* ======================
   CREATE REQUEST MODAL
====================== */
const CreateRequestModal = ({ isOpen, onClose, unitID, onSuccess, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Plumbing',
    description: '',
    priority: 'High',
  });

  // If modal is closed, return null AFTER all hooks have been declared
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const payload = {
      UnitID: unitID,
      Category: formData.category, 
      Description: formData.description,
      Priority: formData.priority,
      RaisedDate: formattedDate 
    };

    try {
      await maintenanceService.createRequest(payload);
      showToast('Request submitted successfully!', 'success');
      onSuccess(unitID);
      onClose();
      setFormData({ category: 'Plumbing', description: '', priority: 'High' });
    } catch (err) {
      console.error("Submission Error:", err.response?.data);
      showToast('Failed to submit request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#4B3856]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md relative shadow-2xl transition-all">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-black text-[#4B3856] mb-6">New Request</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Category</label>
            <select
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4B3856] outline-none font-bold text-[#4B3856]"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Issue Details</label>
            <textarea
              required
              rows="3"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4B3856] outline-none font-medium text-gray-600"
              placeholder="What needs fixing?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Priority</label>
            <select
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4B3856] outline-none font-bold"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#4B3856] text-white py-4 rounded-2xl font-black hover:bg-[#3a2b42] shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Confirm Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ======================
   MAIN PAGE COMPONENT
====================== */
const MyProperties = () => {
  const [bookedUnits, setBookedUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUnitId, setExpandedUnitId] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  // Toast State must be in the parent to be accessible
  const [toast, setToast] = useState({ 
    visible: false, 
    message: '', 
    type: 'success' 
  });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const fallbackImg = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80";

  const fetchBookedUnits = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getBookedUnits();
      setBookedUnits(res?.data || []);
    } catch (err) {
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (unitID) => {
    try {
      const res = await maintenanceService.getRequestsByProperty(unitID);
      setMaintenanceData(prev => ({ ...prev, [unitID]: res?.data || [] }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHistory = (unitID) => {
    if (expandedUnitId === unitID) {
      setExpandedUnitId(null);
    } else {
      setExpandedUnitId(unitID);
      fetchHistory(unitID);
    }
  };

  useEffect(() => {
    fetchBookedUnits();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#4B3856] tracking-widest">LOADING...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8 bg-[#FDFCFD] min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-[#4B3856]">My Home Haven</h1>
        <p className="text-gray-400 mt-2 font-medium">Manage your active units and service history.</p>
      </header>

      <div className="space-y-8">
        {bookedUnits.map((item) => (
          <div key={item.unitId} className="bg-white rounded-[3rem] shadow-sm border border-gray-50 overflow-hidden transition-all duration-500">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 h-64 lg:h-auto overflow-hidden">
                <img src={item.property.imageUrl || fallbackImg} className="w-full h-full object-cover" alt="Property" />
              </div>

              <div className="p-8 lg:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-black text-[#4B3856] leading-tight">{item.property.name}</h2>
                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mt-1">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {item.property.location}
                  </div>
                  <p className="mt-4 font-black text-gray-700">Unit {item.unit.unitNumber} • {item.unit.bedroomCount} BHK</p>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => { setSelectedUnitId(item.unitId); setIsModalOpen(true); }}
                    className="flex-1 bg-[#4B3856] text-white px-6 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-[#3a2b42] shadow-lg transition-all active:scale-95"
                  >
                    <PlusIcon className="w-5 h-5" /> Request Fix
                  </button>
                  <button 
                    onClick={() => toggleHistory(item.unitId)}
                    className={`px-6 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-2 transition-all ${
                      expandedUnitId === item.unitId ? 'bg-gray-100 text-[#4B3856]' : 'bg-purple-50 text-[#4B3856]'
                    }`}
                  >
                    <WrenchScrewdriverIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {expandedUnitId === item.unitId && (
              <div className="bg-[#FAF9FA] border-t border-gray-50 p-8 space-y-4 animate-in slide-in-from-top duration-500">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Maintenance Log</h3>
                {maintenanceData[item.unitId]?.length > 0 ? (
                  maintenanceData[item.unitId].map((req) => (
                    <div key={req.requestID} className="bg-white p-5 rounded-[1.5rem] flex items-center justify-between border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${req.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {req.status === 'Completed' ? <CheckCircleIcon className="w-6 h-6" /> : <ClockIcon className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-black text-[#4B3856]">{req.category}</p>
                          <p className="text-xs text-gray-500">{req.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${req.status === 'Completed' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                          {req.status}
                        </span>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{req.raisedDate}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-gray-400 font-bold italic">No requests found.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <CreateRequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showToast={showToast}
        unitID={selectedUnitId}
        onSuccess={(uid) => {
          setExpandedUnitId(uid); 
          fetchHistory(uid);
        }}
      />

      {/* RENDER TOAST HERE AT THE ROOT OF THE COMPONENT */}
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

export default MyProperties;