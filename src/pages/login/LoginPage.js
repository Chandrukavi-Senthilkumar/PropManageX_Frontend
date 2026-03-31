import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService'; // Direct Service Import

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect back to where they were going, or the Properties page
  const from = location.state?.from || '/Property';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { 
        email: '', 
        password: '' 
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        // 1. Call the login service directly
        // This service handles Cookies.set and localStorage inside authService.login
        const response = await authService.login({
            email: values.email,
            password: values.password
        });

        if (response) {
            // 2. Navigation
            // The DashboardLayout will handle the fetchAdminProfile via the service on load
            navigate(from, { replace: true });
        }
      } catch (err) {
        // Handle the specific error structure from your .NET backend
        const errorMessage = err.response?.data?.errors?.email?.[0] || 
                           err.response?.data?.message || 
                           "Invalid email or password";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA] p-4 font-sans">
      <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-[40px] border border-gray-100">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">PropManage<span className="text-blue-600">X</span></h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Admin Portal Login</p>
        </div>
        
        {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-2xl text-xs font-black uppercase text-center border border-red-100 animate-shake">
                {error}
            </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Email Address</label>
            <input
              type="email"
              {...formik.getFieldProps('email')}
              placeholder="admin@propmanagex.com"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-100 focus:bg-white transition-all font-bold text-gray-800"
            />
            {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 ml-2 mb-1">Password</label>
            <input
              type="password"
              {...formik.getFieldProps('password')}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-100 focus:bg-white transition-all font-bold text-gray-800"
            />
             {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 uppercase text-xs tracking-widest ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-blue-600 shadow-blue-100'
            }`}
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-xs text-gray-500 font-bold">
            New to the platform? <Link to="/signup" className="text-blue-600 hover:underline">Create Account</Link>
          </p>
          <Link to="/forgot-password" underline className="block text-[10px] text-red-400 font-black uppercase tracking-widest hover:text-red-600">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;