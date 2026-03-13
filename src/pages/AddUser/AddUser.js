import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/authService';
import { UserPlusIcon, EnvelopeIcon, PhoneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const AddUserPage = () => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phoneNumber: '',
            role: 'Admin'
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Full name is required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Must be 10 digits').required('Required'),
            role: Yup.string().oneOf([
                'Admin',
                'BuyerAndTenant',
                'SalesAndLeasingAgent',
                'PropertyManager',
                'FinanceAnalyst'
            ], 'Invalid Role').required('Required')
        }),
        onSubmit: async (values, { resetForm }) => {
            console.log("!!! SUBMIT REACHED !!!", values); // Confirmation log
            setLoading(true);
            try {
                const response = await authService.addUser(values);
                console.log("API Success:", response);
                alert("User added successfully!");
                resetForm();
            } catch (err) {
                console.error("API Error:", err);
                alert(err.response?.data?.message || err.message || "Failed to add user");
            } finally {
                setLoading(false);
            }
        }
    });

    // CRITICAL: Log errors to see why Formik might be blocking the submit
    if (Object.keys(formik.errors).length > 0) {
        console.log("Formik Validation Errors:", formik.errors);
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Add New Team Member</h1>
                <p className="text-gray-500">Create a new account and assign professional roles.</p>
            </div>

            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Form submit attempted");
                    formik.handleSubmit();
                }} 
                className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 space-y-6"
            >
                {/* Name Input */}
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
                    <div className="relative mt-2">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                            <UserPlusIcon className="w-5 h-5" />
                        </span>
                        <input
                            name="name"
                            {...formik.getFieldProps('name')}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="e.g. Chandru Kavin"
                        />
                    </div>
                    {formik.touched.name && formik.errors.name && <p className="text-red-500 text-xs mt-2 ml-1">{formik.errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            {...formik.getFieldProps('email')}
                            className="w-full mt-2 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Phone</label>
                        <input
                            name="phoneNumber"
                            {...formik.getFieldProps('phoneNumber')}
                            className="w-full mt-2 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</p>}
                    </div>
                </div>

                {/* Role */}
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">User Role</label>
                    <select
                        name="role"
                        {...formik.getFieldProps('role')}
                        className="w-full mt-2 p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                    >
                        <option value="Admin">Administrator</option>
                        <option value="BuyerAndTenant">Buyer & Tenant</option>
                        <option value="SalesAndLeasingAgent">Sales & Leasing Agent</option>
                        <option value="PropertyManager">Property Manager</option>
                        <option value="FinanceAnalyst">Finance Analyst</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Create Account'}
                </button>
            </form>
        </div>
    );
};

export default AddUserPage;