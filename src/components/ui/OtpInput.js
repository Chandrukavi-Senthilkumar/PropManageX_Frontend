import React from 'react';

const OtpInput = ({ value, onChange, error, touched, loading }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">Verification Code</label>
      <input
        type="text"
        name="otp"
        value={value}
        onChange={onChange}
        maxLength="6"
        placeholder="Enter 6-digit OTP"
        disabled={loading}
        className={`w-full px-4 py-3 text-center text-2xl tracking-widest border rounded-lg outline-none transition-all ${
          touched && error ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-400'
        }`}
      />
      {touched && error && (
        <p className="text-red-500 text-xs mt-1 text-center">{error}</p>
      )}
    </div>
  );
};

export default OtpInput;