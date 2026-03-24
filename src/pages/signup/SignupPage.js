import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom'; // Removed useOutletContext
import { authService } from '../../services/authService';

const SignupPage = () => {
  // REMOVED: const { setEmail } = useOutletContext(); 
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

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
        
        // Instead of setEmail, we pass the email directly to the next page via location state
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
    // Added a wrapper div since we removed the Layout's styling
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-[40px] flex flex-col justify-center border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">PropManageX</h2>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-2">Create Admin Account</p>
        </div>

        {status.message && (
          <div className={`p-4 mb-6 rounded-2xl text-center text-sm font-bold ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Admin Name</label>
            <input
              type="text"
              placeholder="John Doe"
              {...formik.getFieldProps('adminName')}
              className={`w-full px-5 py-4 bg-gray-50 rounded-2xl transition-all outline-none border-2 ${
                formik.touched.adminName && formik.errors.adminName 
                ? 'border-red-200' 
                : 'border-transparent focus:border-blue-100'
              }`}
            />
            {formik.touched.adminName && formik.errors.adminName && (
              <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{formik.errors.adminName}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="admin@propmanagex.com"
              {...formik.getFieldProps('adminMailId')}
              className={`w-full px-5 py-4 bg-gray-50 rounded-2xl transition-all outline-none border-2 ${
                formik.touched.adminMailId && formik.errors.adminMailId 
                ? 'border-red-200' 
                : 'border-transparent focus:border-blue-100'
              }`}
            />
            {formik.touched.adminMailId && formik.errors.adminMailId && (
              <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{formik.errors.adminMailId}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="9876543210"
              {...formik.getFieldProps('phoneNumber')}
              className={`w-full px-5 py-4 bg-gray-50 rounded-2xl transition-all outline-none border-2 ${
                formik.touched.phoneNumber && formik.errors.phoneNumber 
                ? 'border-red-200' 
                : 'border-transparent focus:border-blue-100'
              }`}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{formik.errors.phoneNumber}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 uppercase text-xs tracking-widest ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
            }`}
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-xs text-gray-500 font-bold">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
          <Link to="/forgot-password" underline className="block text-[10px] text-red-400 font-black uppercase tracking-widest hover:text-red-600">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;