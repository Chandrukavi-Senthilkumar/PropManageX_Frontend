import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const signupSchema = Yup.object().shape({
    adminName: Yup.string()
      .min(3, 'Name is too short')
      .required('Full Name is required'),
    adminMailId: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
  });

  const formik = useFormik({
    initialValues: { 
      adminName: '', 
      adminMailId: '', 
      phoneNumber: '' 
    },
    validationSchema: signupSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      setLoading(true);
      setStatus({ type: '', message: '' }); // Clear previous errors
      try {
        await authService.registerAdmin(values);
        // Navigate to OTP verification passing the email in state
        navigate('/verify-otp', { state: { email: values.adminMailId } });
      } catch (err) {
        setStatus({ 
          type: 'error', 
          message: err.response?.data?.message || err.message || "Signup failed." 
        });
      } finally {
        setLoading(false);
      }
    },
  });

  // Helper to render error messages
  const renderError = (fieldName) => (
    formik.touched[fieldName] && formik.errors[fieldName] ? (
      <div className="text-red-500 text-[10px] font-bold mt-1 ml-1 animate-pulse">
        {formik.errors[fieldName]}
      </div>
    ) : null
  );

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p className="text-gray-500 mb-5 font-medium">Join us to manage your properties better</p>

      {/* Backend/Global Error Message */}
      {status.message && (
        <div className={`p-4 mb-6 rounded-xl text-xs font-bold uppercase text-center border ${
          status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
        }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div className="flex flex-col">
          <div className={`bg-[#F3F4F6] p-3 rounded-xl border transition-all ${
            formik.touched.adminName && formik.errors.adminName ? 'border-red-400' : 'border-transparent focus-within:border-[#5B3E59]'
          }`}>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              {...formik.getFieldProps('adminName')}
              className="w-full bg-transparent outline-none text-sm font-semibold px-1"
              placeholder="John Doe"
            />
          </div>
          {renderError('adminName')}
        </div>

        {/* Email Field */}
        <div className="flex flex-col">
          <div className={`bg-[#F3F4F6] p-3 rounded-xl border transition-all ${
            formik.touched.adminMailId && formik.errors.adminMailId ? 'border-red-400' : 'border-transparent focus-within:border-[#5B3E59]'
          }`}>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Email Address</label>
            <input 
              type="email" 
              {...formik.getFieldProps('adminMailId')}
              className="w-full bg-transparent outline-none text-sm font-semibold px-1"
              placeholder="admin@havenix.com"
            />
          </div>
          {renderError('adminMailId')}
        </div>

        {/* Phone Number Field */}
        <div className="flex flex-col">
          <div className={`bg-[#F3F4F6] p-3 rounded-xl border transition-all ${
            formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-400' : 'border-transparent focus-within:border-[#5B3E59]'
          }`}>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Phone Number</label>
            <input 
              type="text" 
              {...formik.getFieldProps('phoneNumber')}
              className="w-full bg-transparent outline-none text-sm font-semibold px-1"
              placeholder="9876543210"
            />
          </div>
          {renderError('phoneNumber')}
        </div>

        <button 
          type="submit" 
          disabled={loading || !formik.isValid}
          className="w-full bg-[#5B3E59] text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#4A3248] transition-all shadow-lg shadow-purple-100 disabled:bg-gray-300 disabled:shadow-none"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm">
        Already have an account? <Link to="/login" className="text-[#5B3E59] font-bold hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;