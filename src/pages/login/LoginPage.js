import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect back to where they were going, or the Property page
  const from = location.state?.from || '/Property';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { 
        email: '', 
        password: '' 
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        // Call the login service directly
        const response = await authService.login({
            email: values.email,
            password: values.password
        });

        if (response) {
            navigate(from, { replace: true });
        }
      } catch (err) {
  const errors = err.response?.data?.errors;

  if (errors) {
    formik.setErrors({
      email: errors.email?.[0],
      password: errors.password?.[0],
    });
  } else {
    setError("Invalid email or password");
  }
      } finally {
        setLoading(false);
      }
    },
  });

  // Helper to render field-specific validation errors
  const renderError = (fieldName) => (
    formik.touched[fieldName] && formik.errors[fieldName] ? (
      <div className="text-red-500 text-[10px] font-bold mt-1 ml-1">
        {formik.errors[fieldName]}
      </div>
    ) : null
  );

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-gray-500 mb-8 font-medium">Let's login to grab amazing deals</p>

      {/* Global Backend Error Alert */}
      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase text-center border border-red-100 animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="flex flex-col">
          <div className={`bg-[#F3F4F6] p-3 rounded-xl border transition-all ${
            formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-transparent focus-within:border-[#5B3E59]'
          }`}>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Email</label>
            <input 
              type="email" 
              {...formik.getFieldProps('email')}
              className="w-full bg-transparent outline-none text-sm font-semibold px-1"
              placeholder="rownok@gmail.com"
            />
          </div>
          {renderError('email')}
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <div className={`bg-[#F3F4F6] p-3 rounded-xl border transition-all ${
            formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-transparent focus-within:border-[#5B3E59]'
          }`}>
             <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Password</label>
             <input 
               type="password" 
               {...formik.getFieldProps('password')}
               className="w-full bg-transparent outline-none text-sm font-semibold px-1"
               placeholder="************"
             />
          </div>
          {renderError('password')}
        </div>

        <div className="flex justify-between items-center text-xs px-1">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-600">
            <input type="checkbox" className="accent-[#5B3E59] w-4 h-4" /> Remember me
          </label>
          <Link to="/forgot-password" title="Forgot Password?" className="text-gray-900 font-bold hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#5B3E59] text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#4A3248] transition-all shadow-lg shadow-purple-100 disabled:bg-gray-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm">
        Don't have an account? <Link to="/signup" className="text-[#5B3E59] font-bold hover:underline">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;