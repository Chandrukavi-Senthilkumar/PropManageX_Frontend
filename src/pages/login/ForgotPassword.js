import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import {
    EnvelopeIcon,
    KeyIcon,
    LockClosedIcon,
    ArrowLeftIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const ForgotPasswordFlow = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.forgotPassword(formData.email);
            setStep(2);
            setMessage({ type: 'success', text: 'Verification code sent to your email.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Email not found or service unavailable.' });
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: Verify OTP ---
    // --- Inside your ForgotPasswordFlow Component ---

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare the payload object to match your service argument 'verifyData'
            const verifyData = {
                adminMailId: formData.email, // Mapping the state 'email' to 'adminMailId'
                otp: formData.otp
            };

            // Call your service: apiClient.post('/verify-otp', verifyData)
            await authService.verifyOtp(verifyData);

            // If successful, move to Step 3 (Set Password)
            setStep(3);
            setMessage({ type: 'success', text: 'OTP Verified' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Invalid OTP. Please check the code.' });
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 3: Set New Password ---
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match.' });
        }
        setLoading(true);
        try {
            await authService.setPassword({
                adminMailId: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });
            setStep(4); // Success state
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to reset password. Try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA] p-4 font-sans">
            <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-[40px] border border-gray-100 relative overflow-hidden">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1.5 bg-blue-600 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>

                {/* Back Button */}
                {step > 1 && step < 4 && (
                    <button onClick={() => setStep(step - 1)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-xs font-bold uppercase">
                        <ArrowLeftIcon className="w-4 h-4" /> Back
                    </button>
                )}

                {/* --- UI STEPS --- */}

                {/* STEP 1: EMAIL INPUT */}
                {step === 1 && (
                    <div className="animate-fadeIn">
                        <div className="p-4 bg-blue-50 rounded-2xl w-fit mb-6"><EnvelopeIcon className="w-8 h-8 text-blue-600" /></div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Reset Password</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Enter email to recover account</p>

                        <form onSubmit={handleRequestOTP} className="space-y-6">
                            <input
                                type="email" required placeholder="admin@propmanagex.com"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-100 font-bold"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <button disabled={loading} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
                                {loading ? "Processing..." : "Continue"}
                            </button>
                        </form>
                    </div>
                )}

                {/* STEP 2: OTP INPUT */}
                {step === 2 && (
                    <div className="animate-fadeIn">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-gray-900 leading-tight">Verify Identity</h2>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">
                                Code sent to: {formData.email}
                            </p>
                        </div>

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">6-Digit Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    placeholder="000000"
                                    className="w-full px-6 py-5 bg-gray-50 rounded-[24px] outline-none text-center text-3xl font-black tracking-[0.5em] border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-inner"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || formData.otp.length < 6}
                                className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
                            >
                                {loading ? "Authenticating..." : "Verify & Continue"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors py-2"
                            >
                                Change Email Address
                            </button>
                        </form>
                    </div>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {step === 3 && (
                    <div className="animate-fadeIn">
                        <div className="p-4 bg-green-50 rounded-2xl w-fit mb-6"><LockClosedIcon className="w-8 h-8 text-green-600" /></div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Set Password</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Choose a strong new password</p>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <input
                                type="password" required placeholder="New Password"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-green-100"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <input
                                type="password" required placeholder="Confirm Password"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-green-100"
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            <button disabled={loading} className="w-full py-5 bg-green-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
                                {loading ? "Updating..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                )}

                {/* STEP 4: SUCCESS */}
                {step === 4 && (
                    <div className="text-center animate-fadeIn py-10">
                        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-gray-900 mb-2">All Set!</h2>
                        <p className="text-gray-400 font-bold text-sm mb-10">Your password has been updated successfully.</p>
                        <button onClick={() => navigate('/login')} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest">
                            Back to Login
                        </button>
                    </div>
                )}

                {/* Error Messages */}
                {message.text && step < 4 && (
                    <div className={`mt-6 p-4 rounded-2xl text-[10px] font-black uppercase text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        {message.text}
                    </div>
                )}

                {step === 1 && (
                    <Link to="/login" className="block text-center mt-8 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                        Cancel and return to login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordFlow;