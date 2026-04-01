import React, { useEffect, useState } from 'react';
import {
  PlusIcon,
  WrenchScrewdriverIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import { propertyService } from '../../services/propertyService';
import { unitAmenityService } from '../../services/unitAmenityService';
import { maintenanceService } from '../../services/maintenanceService';
import { bookingService } from '../../services/bookingService';

/* ======================
   ADD REQUEST MODAL
====================== */
const AddRequestModal = ({ isOpen, onClose, onSuccess, unitID }) => {
  const [formData, setFormData] = useState({
    category: 'Plumbing',
    description: '',
    priority: 'High',
    status: 'Open',
    raisedDate: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const formatDate = (date) => {
    const [y, m, d] = date.split('-');
    return `${d}-${m}-${y}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await maintenanceService.createRequest({
        unitID,
        ...formData,
        raisedDate: formatDate(formData.raisedDate),
      });

      alert('Request created ✅');
      onSuccess();
      onClose();
    } catch {
      alert('Failed to create request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-black mb-6 text-center">
          Maintenance Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full p-3 border rounded-xl"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Cleaning</option>
            <option>Others</option>
          </select>

          <textarea
            required
            className="w-full p-3 border rounded-xl"
            placeholder="Describe issue"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

/* ======================
   MAIN COMPONENT
====================== */
const MyProperty = () => {
  const [property, setProperty] = useState(null);
  const [units, setUnits] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeUnitID, setActiveUnitID] = useState(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const propRes = await propertyService.getProperties();
      const prop = propRes?.data?.items?.[0];

      if (!prop) return;

      setProperty(prop);

      const [unitRes, reqRes] = await Promise.all([
        unitAmenityService.getUnits({ PropertyID: prop.propertyID }),
        maintenanceService.getRequestsByProperty(prop.propertyID),
      ]);

      setUnits(unitRes?.data?.items || []);
      setRequests(reqRes?.data?.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleBookUnit = async (unitID) => {
    try {
      await bookingService.bookUnit(unitID);
      alert('Unit booked ✅');
      await fetchInitialData();
    } catch (err) {
      alert(err.response?.data?.message || 'Already booked');
    }
  };

  if (loading) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* PROPERTY */}
      <div className="bg-white p-6 rounded-3xl shadow">
        <h1 className="text-2xl font-black">{property?.name}</h1>
        <p className="text-gray-500">{property?.location}</p>
      </div>

      {/* UNITS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {units.map((unit) => (
          <div key={unit.unitID} className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-black text-lg">
              Unit {unit.unitNumber} • {unit.bedroomCount} BHK
            </h3>

            <p className="text-blue-600 text-xl font-black">
              ₹{unit.basePrice?.toLocaleString()}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleBookUnit(unit.unitID)}
                disabled={unit.isBooked}
                className={`px-4 py-2 rounded-xl font-bold ${
                  unit.isBooked
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white'
                }`}
              >
                {unit.isBooked ? 'Booked' : 'Book'}
              </button>

              <button
                onClick={() => {
                  setActiveUnitID(unit.unitID);
                  setShowModal(true);
                }}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl"
              >
                <PlusIcon className="w-4 h-4 inline" /> Request
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MAINTENANCE */}
      <div className="bg-white rounded-3xl shadow">
        <div className="p-6 flex items-center gap-2">
          <WrenchScrewdriverIcon className="w-5 h-5" />
          <h2 className="font-black">Maintenance History</h2>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4">Category</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.maintenanceID} className="border-t">
                <td className="p-4">{r.category}</td>
                <td>{r.description}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchInitialData}
        unitID={activeUnitID}
      />
    </div>
  );
};

export default MyProperty;