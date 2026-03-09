import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const SetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const location = useLocation();
    const navigate = useNavigate();
   const emailFromState = location.state?.email || "";

    // Password Criteria Logic
    const getCriteria = (pw) => [
        { label: "At least 8 characters", met: pw.length >= 8 },
        { label: "At least one number", met: /[0-9]/.test(pw) },
        { label: "At least one special character (@$!%*?)", met: /[@$!%*?&]/.test(pw) },
        { label: "At least one uppercase letter", met: /[A-Z]/.test(pw) },
    ];

    const formik = useFormik({
        initialValues: {
            adminMailId: emailFromState,
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password too short'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required'),
        }),

        onSubmit: async (values) => {


            try {

                const payload = {
                    adminMailId: values.adminMailId, 
                    password: values.password,
                    confirmPassword: values.confirmPassword
                };
                await authService.setPassword(payload);
                navigate('/dashboard');
            } catch (err) {
                setStatus({ type: 'error', message: err.message });
            }
        }

    });

    const criteria = getCriteria(formik.values.password);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Set Your Password</h2>
                <p className="text-center text-gray-500 mb-6 text-sm">Create a strong password for {emailFromState}</p>

                {status.message && (
                    <div className={`p-3 mb-4 rounded text-center text-sm ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">New Password</label>
                        <input
                            type="password"
                            name="password"
                            {...formik.getFieldProps('password')}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Password Criteria UI */}
                    <div className="grid grid-cols-1 gap-1 py-2">
                        {criteria.map((item, index) => (
                            <div key={index} className="flex items-center text-xs">
                                <span className={`mr-2 ${item.met ? 'text-green-500' : 'text-gray-300'}`}>
                                    {item.met ? '✔' : '○'}
                                </span>
                                <span className={item.met ? 'text-green-600' : 'text-gray-500'}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            {...formik.getFieldProps('confirmPassword')}
                            className={`w-full px-4 py-2 mt-1 border rounded-lg outline-none focus:ring-2 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:ring-blue-400'
                                }`}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formik.isValid}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Setting Password...' : 'Finish Setup'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPasswordPage;