import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from '../../components/Toast/Toast';

// Services
import { revenueReportService } from '../../services/revenueReportService';
import { invoiceService } from '../../services/invoiceService';

const RevenueReportPage = () => {
  const [reports, setReports] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({
    scope: 'All',
    from: '',
    to: '',
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const query = {
        ...(filters.scope !== 'All' ? { Scope: filters.scope } : {}),
        ...(filters.from ? { From: filters.from } : {}),
        ...(filters.to ? { To: filters.to } : {}),
      };
      const res = await revenueReportService.getReports(query);
      setReports(res?.data?.items || []);
    } catch (err) {
      showToast("Failed to load revenue reports", "error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchInvoices = useCallback(async () => {
    try {
      const invoiceFilter = {
        ...(filters.from ? { dueFrom: filters.from } : {}),
        ...(filters.to ? { dueTo: filters.to } : {}),
      };
      const res = await invoiceService.getInvoices(invoiceFilter);
      const items = res?.data?.items || res?.data || [];
      setInvoices(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Error loading invoices', err);
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
    fetchInvoices();
  }, [fetchReports, fetchInvoices]);

  const formik = useFormik({
    initialValues: {
      scope: 'Property',
      occupancyRate: 0,
      rentalYield: 0,
      collectionRate: 0,
    },
    validationSchema: Yup.object({
      scope: Yup.string().required('Required'),
      occupancyRate: Yup.number().min(0).max(100).required('Required'),
      rentalYield: Yup.number().min(0).required('Required'),
      collectionRate: Yup.number().min(0).max(100).required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values, generatedDate: new Date().toISOString() };
        if (editingReport) {
          await revenueReportService.updateReport(editingReport.reportID, payload);
        } else {
          await revenueReportService.createReport(payload);
        }

        setModalOpen(false);
        resetForm();

        setTimeout(() => {
          showToast(
            editingReport ? 'Report updated successfully!' : 'Report created successfully!', 
            'success'
          );
        }, 0);

        fetchReports();
      } catch (err) {
        setModalOpen(false);
        setTimeout(() => {
          showToast('Failed to save report', 'error');
        }, 0);
      }
    },
  });

  const openNew = () => {
    setEditingReport(null);
    formik.resetForm();
    setModalOpen(true);
  };

  const openEdit = (report) => {
    setEditingReport(report);
    formik.setValues({
      scope: report.scope,
      occupancyRate: report.occupancyRate,
      rentalYield: report.rentalYield,
      collectionRate: report.collectionRate,
    });
    setModalOpen(true);
  };

  const onDelete = async (id) => {
    if (window.confirm('Delete this revenue report?')) {
      try {
        await revenueReportService.deleteReport(id);
        showToast('Report deleted successfully!', 'success');
        fetchReports();
      } catch (err) {
        showToast("Delete failed", "error");
      }
    }
  };

  const totalInvoiceRevenue = useMemo(() => invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0), [invoices]);

  const monthlyRevenue = useMemo(() => {
    const map = {};
    invoices.forEach((inv) => {
      const d = new Date(inv.dueDate || inv.period);
      if (isNaN(d.getTime())) return;
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[k] = (map[k] || 0) + (inv.amount || 0);
    });
    return Object.entries(map)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [invoices]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Pipeline</h1>
            <p className="text-sm font-medium text-slate-500">Occupancy, Yield and Collection KPIs</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchReports} className="p-2 bg-white border rounded-lg hover:bg-slate-50">
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={openNew} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all">
              <PlusIcon className="w-5 h-5" /> New Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Reports" value={reports.length} />
          <StatCard title="Avg. Occupancy" value={`${(reports.reduce((a, r) => a + (r.occupancyRate || 0), 0) / Math.max(reports.length, 1)).toFixed(1)}%`} />
          <StatCard title="Invoice Revenue" value={`$${totalInvoiceRevenue.toLocaleString()}`} />
          <StatCard title="Avg. Rental Yield" value={`${(reports.reduce((a, r) => a + (r.rentalYield || 0), 0) / Math.max(reports.length, 1)).toFixed(1)}%`} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 items-end">
          <div className="flex-1 max-w-xs">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Scope</label>
            <select
              value={filters.scope}
              onChange={(e) => setFilters(f => ({ ...f, scope: e.target.value }))}
              className="w-full mt-1 border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold"
            >
              <option value="All">All Scopes</option>
              <option value="Property">Property</option>
              <option value="Period">Period</option>
            </select>
          </div>
          <div className="flex-1 max-w-xs">
            <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">From Date</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters(f => ({ ...f, from: e.target.value }))}
              className="w-full mt-1 border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold"
            />
          </div>
        </div>

        {/* Visibility Improved: Bar Chart instead of Line Chart */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Revenue Stream</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#0f172a" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400">Scope</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400">Occupancy</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400">Rental Yield</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400">Collection</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400">Date</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reports.map((report) => (
                <tr key={report.reportID} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-semibold text-slate-700">{report.scope}</td>
                  <td className="px-8 py-5 font-bold text-blue-600">{report.occupancyRate}%</td>
                  <td className="px-8 py-5 font-bold text-emerald-600">{report.rentalYield}%</td>
                  <td className="px-8 py-5 font-bold text-indigo-600">{report.collectionRate}%</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{new Date(report.generatedDate).toLocaleDateString()}</td>
                  <td className="px-8 py-5 text-right space-x-2">
                    <button onClick={() => openEdit(report)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(report.reportID)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-10 border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{editingReport ? 'Edit KPI' : 'New KPI Report'}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Manual Performance Entry</p>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-2 mb-1 block">Report Scope</label>
                <select
                  name="scope"
                  {...formik.getFieldProps('scope')}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-semibold text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none"
                >
                  <option value="Property">Property-Wide</option>
                  <option value="Period">Period-Based</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Occupancy %" name="occupancyRate" formik={formik} />
                <InputField label="Yield %" name="rentalYield" formik={formik} />
              </div>

              <InputField label="Collection Rate %" name="collectionRate" formik={formik} />

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest rounded-2xl shadow-xl hover:bg-slate-800">
                  {editingReport ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">{title}</p>
    <p className={`text-2xl font-bold text-slate-900`}>{value}</p>
  </div>
);

const InputField = ({ label, name, formik }) => (
  <div>
    <label className="text-[10px] font-bold uppercase text-slate-400 ml-2 mb-1 block">{label}</label>
    <input
      type="number"
      step="0.01"
      {...formik.getFieldProps(name)}
      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-semibold text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none"
    />
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-500 text-[9px] font-bold mt-1 ml-2 uppercase">{formik.errors[name]}</div>
    )}
  </div>
);

export default RevenueReportPage;