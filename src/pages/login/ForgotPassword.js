import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/authService';

const ForgotPasswordFlow = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    // 1. Define Validation Schemas for each step
    const schemas = [
        Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        Yup.object({
            otp: Yup.string().matches(/^[0-9]{6}$/, 'Must be exactly 6 digits').required('OTP is required'),
        }),
        Yup.object({
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm your password'),
        })
    ];

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: schemas[step - 1], // Dynamically select schema based on step
        onSubmit: async (values) => {
            setStatus({ type: '', message: '' });
            setLoading(true);
            try {
                if (step === 1) {
                    await authService.forgotPassword(values.email);
                    setStep(2);
                    setStatus({ type: 'success', message: 'Verification code sent to your email.' });
                } else if (step === 2) {
                    await authService.verifyOtp({ adminMailId: values.email, otp: values.otp });
                    setStep(3);
                    setStatus({ type: 'success', message: 'OTP Verified' });
                } else if (step === 3) {
                    await authService.setPassword({
                        adminMailId: values.email,
                        password: values.password,
                        confirmPassword: values.confirmPassword
                    });
                    setStep(4);
                }
            } catch (err) {
                setStatus({ 
                    type: 'error', 
                    message: err.response?.data?.message || "Action failed. Please try again." 
                });
            } finally {
                setLoading(false);
            }
        },
    });

    const renderError = (fieldName) => (
        formik.touched[fieldName] && formik.errors[fieldName] ? (
            <div className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{formik.errors[fieldName]}</div>
        ) : null
    );

    return (
        <div className="animate-fade-in-up relative">
            {/* Progress Bar */}
            <div className="absolute -top-10 left-0 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#5B3E59] transition-all duration-500" 
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>

            {step > 1 && step < 4 && (
                <button 
                    onClick={() => { setStep(step - 1); setStatus({type:'', message:''}); }} 
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-[#5B3E59] transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Go Back
                </button>
            )}

            <form onSubmit={formik.handleSubmit}>
                {/* --- STEP 1: EMAIL --- */}
                {step === 1 && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Forgot Password?</h2>
                        <p className="text-gray-500 mb-8 font-medium">Enter your email to recover your account</p>
                        <div className={`bg-[#F3F4F6] p-3.5 rounded-2xl border-2 transition-all ${formik.errors.email && formik.touched.email ? 'border-red-400' : 'border-transparent focus-within:border-[#5B3E59]'}`}>
                            <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 ml-1">Email Address</label>
                            <input 
                                type="email" name="email"
                                placeholder="admin@havenix.com"
                                className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 px-1"
                                {...formik.getFieldProps('email')}
                            />
                        </div>
                        {renderError('email')}
                        <button type="submit" disabled={loading} className="w-full bg-[#5B3E59] text-white py-4 rounded-xl font-bold mt-8 hover:bg-[#4A3248] transition-all shadow-lg">
                            {loading ? "Processing..." : "Send Reset Code"}
                        </button>
                    </div>
                )}

                {/* --- STEP 2: OTP --- */}
                {step === 2 && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Verify Identity</h2>
                        <p className="text-gray-500 mb-8 font-medium">Code sent to <span className="text-[#5B3E59] font-bold">{formik.values.email}</span></p>
                        <input 
                            type="text" name="otp" maxLength="6" placeholder="000000"
                            className={`w-full bg-[#F3F4F6] text-center text-3xl font-black tracking-[0.5em] py-5 rounded-2xl border-2 outline-none transition-all ${formik.errors.otp && formik.touched.otp ? 'border-red-400' : 'border-transparent focus:border-[#5B3E59]'}`}
                            {...formik.getFieldProps('otp')}
                        />
                        {renderError('otp')}
                        <button type="submit" disabled={loading} className="w-full bg-[#5B3E59] text-white py-4 rounded-xl font-bold mt-8 hover:bg-[#4A3248] transition-all shadow-lg">
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                )}

                {/* --- STEP 3: SET PASSWORD --- */}
                {step === 3 && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Set Password</h2>
                        <p className="text-gray-500 mb-8 font-medium">Create a strong new password</p>
                        
                        <div className="space-y-4">
                            <div className={`bg-[#F3F4F6] p-3.5 rounded-2xl border-2 transition-all ${formik.errors.password && formik.touched.password ? 'border-red-400' : 'border-transparent focus-within:border-[#5B3E59]'}`}>
                                <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 ml-1">New Password</label>
                                <input 
                                    type="password" name="password" placeholder="************"
                                    className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 px-1"
                                    {...formik.getFieldProps('password')}
                                />
                            </div>
                            {renderError('password')}

                            <div className={`bg-[#F3F4F6] p-3.5 rounded-2xl border-2 transition-all ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-400' : 'border-transparent focus-within:border-[#5B3E59]'}`}>
                                <label className="block text-[10px] uppercase font-black text-gray-400 mb-1 ml-1">Confirm Password</label>
                                <input 
                                    type="password" name="confirmPassword" placeholder="************"
                                    className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 px-1"
                                    {...formik.getFieldProps('confirmPassword')}
                                />
                            </div>
                            {renderError('confirmPassword')}
                        </div>
                        
                        <button type="submit" disabled={loading} className="w-full bg-[#5B3E59] text-white py-4 rounded-xl font-bold mt-8 hover:bg-[#4A3248] transition-all shadow-lg">
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                )}
            </form>

            {/* --- STEP 4: SUCCESS --- */}
            {step === 4 && (
                <div className="text-center animate-fade-in-up py-6">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Password Reset!</h2>
                    <p className="text-gray-500 font-medium mb-10">You can now use your new password to login.</p>
                    <button onClick={() => navigate('/login')} className="w-full bg-[#5B3E59] text-white py-4 rounded-xl font-bold hover:bg-[#4A3248] transition-all shadow-lg">
                        Login Now
                    </button>
                </div>
            )}

            {/* Status Messages */}
            {status.message && step < 4 && (
                <div className={`mt-8 p-4 rounded-xl text-[10px] font-black uppercase text-center border ${status.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {status.message}
                </div>
            )}

            {step === 1 && (
                <Link to="/login" className="block text-center mt-10 text-xs font-black text-gray-400 hover:text-[#5B3E59] transition-colors uppercase tracking-[0.2em]">
                    Back to Login
                </Link>
            )}
        </div>
    );
};

export default ForgotPasswordFlow;