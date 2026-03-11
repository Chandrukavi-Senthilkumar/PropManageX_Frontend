import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import OtpInput from '../../components/ui/OtpInput';

const VerifyOtpPage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromState = location.state?.email || "";

  const formik = useFormik({
    initialValues: {
      adminMailId: emailFromState,
      otp: '',
    },
    validationSchema: Yup.object({
      adminMailId: Yup.string().email('Invalid email').required('Email is required'),
      otp: Yup.string().length(6, 'OTP must be 6 digits').required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setStatus({ type: '', message: '' });
      try {
        await authService.verifyOtp(values);
        setStatus({ type: 'success', message: 'OTP Verified! Redirecting to login...' });
       navigate('/set-password', { state: { email: values.adminMailId } });
      } catch (err) {
        setStatus({ type: 'error', message: err.message || "Invalid OTP" });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Please enter the code sent to <br/>
          <span className="font-semibold text-gray-700">{formik.values.adminMailId}</span>
        </p>

        {status.message && (
          <div className={`p-3 mb-6 rounded text-center text-sm ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <OtpInput
            value={formik.values.otp}
            onChange={formik.handleChange}
            error={formik.errors.otp}
            touched={formik.touched.otp}
            loading={loading}
          />

          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className={`w-full py-3 font-bold text-white rounded-lg shadow-md transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify & Proceed'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            type="button" 
            className="text-sm text-blue-600 hover:underline font-medium"
            onClick={() => {/* Add Resend OTP Logic Here */}}
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;