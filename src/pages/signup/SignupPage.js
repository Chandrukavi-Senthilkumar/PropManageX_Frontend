import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // 1. Validation Schema
  const signupSchema = Yup.object().shape({
    adminName: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Admin Name is required'),
    adminMailId: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
  });

  // 2. Formik Logic
  const formik = useFormik({
    initialValues: {
      adminName: '',
      adminMailId: '',
      phoneNumber: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setStatus({ type: '', message: '' });
      try {
        await authService.registerAdmin(values);
        
        // Success: Redirect to Verify OTP and pass the email in state
        navigate('/verify-otp', { 
          state: { email: values.adminMailId } 
        });
        
      } catch (err) {
        setStatus({ 
          type: 'error', 
          message: err.message || "Signup failed. Please check your details." 
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">PropManageX</h2>
          <p className="text-gray-500 mt-2">Create your admin account</p>
        </div>

        {/* Status Message */}
        {status.message && (
          <div className={`p-4 mb-6 rounded-lg text-center text-sm font-medium ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Admin Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Name</label>
            <input
              type="text"
              name="adminName"
              placeholder="John Doe"
              {...formik.getFieldProps('adminName')}
              className={`w-full px-4 py-2 border rounded-lg transition-all outline-none focus:ring-2 ${
                formik.touched.adminName && formik.errors.adminName 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {formik.touched.adminName && formik.errors.adminName && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.adminName}</p>
            )}
          </div>

          {/* Email ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="adminMailId"
              placeholder="admin@propmanagex.com"
              {...formik.getFieldProps('adminMailId')}
              className={`w-full px-4 py-2 border rounded-lg transition-all outline-none focus:ring-2 ${
                formik.touched.adminMailId && formik.errors.adminMailId 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {formik.touched.adminMailId && formik.errors.adminMailId && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.adminMailId}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="9876543210"
              {...formik.getFieldProps('phoneNumber')}
              className={`w-full px-4 py-2 border rounded-lg transition-all outline-none focus:ring-2 ${
                formik.touched.phoneNumber && formik.errors.phoneNumber 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-transform active:scale-95 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
          </p>
          <Link to="/forgot-password" title="Reset Password" className="text-xs text-red-400 hover:text-red-600 transition-colors underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;