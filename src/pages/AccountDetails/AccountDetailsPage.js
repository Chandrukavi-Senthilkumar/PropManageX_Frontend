import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AccountDetailsPage = () => {
  const { userName, userRole, profileDetails } = useSelector((state) => state.auth);

  if (!profileDetails) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        <p className="text-sm text-gray-500">No profile loaded yet. Please refresh profile or log in.</p>
        <div className="mt-4">
          <Link to="/dashboard" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Account Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-xs font-semibold text-gray-500">Email</p>
          <p className="text-base text-gray-800">{profileDetails.AdminEmail || profileDetails.email || 'N/A'}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-xs font-semibold text-gray-500">Role</p>
          <p className="text-base text-gray-800">{profileDetails.Role || profileDetails.role || userRole}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-xs font-semibold text-gray-500">Phone</p>
          <p className="text-base text-gray-800">{profileDetails.PhoneNumber || profileDetails.phoneNumber || 'N/A'}</p>
        </div>
      </div>
      <div className="mt-6">
        <Link to="/dashboard" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
