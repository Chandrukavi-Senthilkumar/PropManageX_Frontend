import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        await authService.login(values);
        localStorage.setItem('userName', values.email);
        localStorage.setItem('userRole', 'Administrator');
        navigate(from);
      } catch (err) {
        setError(err.errors?.AdminMailId?.[0] || "Invalid email or password");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to PropManageX</h2>
        
        {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded text-sm text-center">{error}</div>}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email" name="email"
              {...formik.getFieldProps('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password" name="password"
              {...formik.getFieldProps('password')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-sm text-blue-600 hover:underline">Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;