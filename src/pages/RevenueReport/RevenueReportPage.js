import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  fetchRevenueReports,
  createRevenueReport,
  updateRevenueReport,
  deleteRevenueReport,
  clearRevenueNotification,
} from '../../redux/slices/revenueSlice';
import { invoiceService } from '../../services/invoiceService';

const initialForm = {
  scope: 'Property',
  occupancyRate: 0,
  rentalYield: 0,
  collectionRate: 0,
};

const initialFilters = {
  scope: 'All',
  from: '',
  to: '',
  propertyId: '',
};

const toMonthKey = (dtStr) => {
  const d = new Date(dtStr);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getQuarter = (month) => Math.floor((month - 1) / 3) + 1;

const RevenueReportPage = () => {
  const dispatch = useDispatch();
  const { reports = [], status = 'idle', error = null, notification = null } =
    useSelector((state) => state.revenue || {});

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);

  const [filters, setFilters] = useState(initialFilters);
  const [invoices, setInvoices] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    const query = {
      ...(filters.scope !== 'All' ? { scope: filters.scope } : {}),
      ...(filters.from ? { from: filters.from } : {}),
      ...(filters.to ? { to: filters.to } : {}),
    };
    dispatch(fetchRevenueReports(query));
  }, [dispatch, filters]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => dispatch(clearRevenueNotification()), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  const fetchInvoices = useCallback(async () => {
    try {
      setInvoiceLoading(true);
      const invoiceFilter = {
        ...(filters.propertyId ? { contractID: filters.propertyId } : {}),
        ...(filters.from ? { dueFrom: filters.from } : {}),
        ...(filters.to ? { dueTo: filters.to } : {}),
      };
      const res = await invoiceService.getInvoices(invoiceFilter);
      const items = res?.data?.items || res?.data || [];
      setInvoices(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Error loading invoices', err);
      setInvoices([]);
    } finally {
      setInvoiceLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const totalInvoiceRevenue = useMemo(() => invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0), [invoices]);

  const monthlyRevenue = useMemo(() => {
    const map = {};
    invoices.forEach((inv) => {
      const k = toMonthKey(inv.dueDate || inv.period);
      if (!k) return;
      map[k] = (map[k] || 0) + (inv.amount || 0);
    });
    return Object.entries(map)
      .map(([month, amount]) => ({ month, revenue: amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [invoices]);

  const quarterlyRevenue = useMemo(() => {
    const map = {};
    invoices.forEach((inv) => {
      const d = new Date(inv.dueDate || inv.period);
      if (Number.isNaN(d.getTime())) return;
      const q = `${d.getFullYear()}-Q${getQuarter(d.getMonth() + 1)}`;
      map[q] = (map[q] || 0) + (inv.amount || 0);
    });
    return Object.entries(map)
      .map(([quarter, amount]) => ({ quarter, revenue: amount }))
      .sort((a, b) => a.quarter.localeCompare(b.quarter));
  }, [invoices]);

  const avgOccupancy = reports.length ? reports.reduce((sum, item) => sum + (item.occupancyRate || 0), 0) / reports.length : 0;

  const openNew = () => {
    setEditing(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (report) => {
    setEditing(report);
    setForm({
      scope: report.scope,
      occupancyRate: report.occupancyRate,
      rentalYield: report.rentalYield,
      collectionRate: report.collectionRate,
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      scope: form.scope,
      occupancyRate: parseFloat(form.occupancyRate),
      rentalYield: parseFloat(form.rentalYield),
      collectionRate: parseFloat(form.collectionRate),
    };

    if (editing) {
      await dispatch(updateRevenueReport({ id: editing.reportID, values: payload }));
    } else {
      await dispatch(createRevenueReport(payload));
    }

    setModalOpen(false);
  };

  const onDelete = (id) => {
    if (window.confirm('Delete this revenue report?')) {
      dispatch(deleteRevenueReport(id));
    }
  };

  const applyFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Revenue Reports</h1>
            <p className="text-sm text-gray-500">Financial, collection and occupancy KPIs per report period.</p>
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700">
            <PlusIcon className="w-4 h-4" /> New Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs uppercase tracking-wide text-slate-500">Revenue Reports</p>
            <p className="text-2xl font-bold">{reports.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs uppercase tracking-wide text-slate-500">Average Occupancy</p>
            <p className="text-2xl font-bold">{avgOccupancy.toFixed(2)}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Invoice Revenue</p>
            <p className="text-2xl font-bold">${totalInvoiceRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs uppercase tracking-wide text-slate-500">Current Period Yield (avg)</p>
            <p className="text-2xl font-bold">{(reports.reduce((a, r) => a + (r.rentalYield || 0), 0) / Math.max(reports.length, 1)).toFixed(2)}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="flex flex-col text-xs text-slate-500">
              Scope
              <select value={filters.scope} onChange={(e) => applyFilter('scope', e.target.value)} className="mt-1 border border-gray-200 rounded-lg px-2 py-1">
                <option value="All">All</option>
                <option value="Property">Property</option>
                <option value="Period">Period</option>
              </select>
            </label>
            <label className="flex flex-col text-xs text-slate-500">
              From
              <input type="date" value={filters.from} onChange={(e) => applyFilter('from', e.target.value)} className="mt-1 border border-gray-200 rounded-lg px-2 py-1" />
            </label>
            <label className="flex flex-col text-xs text-slate-500">
              To
              <input type="date" value={filters.to} onChange={(e) => applyFilter('to', e.target.value)} className="mt-1 border border-gray-200 rounded-lg px-2 py-1" />
            </label>
            <label className="flex flex-col text-xs text-slate-500">
              Property / Contract ID
              <input type="text" placeholder="GUID" value={filters.propertyId} onChange={(e) => applyFilter('propertyId', e.target.value)} className="mt-1 border border-gray-200 rounded-lg px-2 py-1" />
            </label>
            <div className="text-xs text-gray-500 italic">Filters are applied automatically.</div>
          </div>
        </div>

        {notification && (
          <div className={`p-3 rounded-lg text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notification.message}
          </div>
        )}

        {status === 'loading' && <p className="text-sm text-gray-500">Loading revenue reports...</p>}
        {invoiceLoading && <p className="text-sm text-gray-500">Loading invoices...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
            <h3 className="text-sm font-semibold mb-3">Monthly Invoice Revenue</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyRevenue} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
            <h3 className="text-sm font-semibold mb-3">Quarterly Invoice Revenue</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={quarterlyRevenue} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs text-gray-500 uppercase">Scope</th>
                <th className="px-4 py-3 text-xs text-gray-500 uppercase">Occupancy</th>
                <th className="px-4 py-3 text-xs text-gray-500 uppercase">Rental Yield</th>
                <th className="px-4 py-3 text-xs text-gray-500 uppercase">Collection</th>
                <th className="px-4 py-3 text-xs text-gray-500 uppercase">Generated</th>
                <th className="px-4 py-3 text-xs text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.reportID} className="border-b border-gray-100">
                  <td className="px-4 py-3">{report.scope}</td>
                  <td className="px-4 py-3">{(report.occupancyRate || 0).toFixed(2)}%</td>
                  <td className="px-4 py-3">{(report.rentalYield || 0).toFixed(2)}%</td>
                  <td className="px-4 py-3">{(report.collectionRate || 0).toFixed(2)}%</td>
                  <td className="px-4 py-3">{new Date(report.generatedDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(report)} className="px-2 py-1 text-blue-600 bg-blue-50 rounded-lg flex items-center gap-1"><PencilSquareIcon className="w-4 h-4" />Edit</button>
                    <button onClick={() => onDelete(report.reportID)} className="px-2 py-1 text-red-600 bg-red-50 rounded-lg flex items-center gap-1"><TrashIcon className="w-4 h-4" />Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Revenue Report' : 'Create Revenue Report'}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase text-gray-500">Scope</span>
                <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                  <option value="Property">Property</option>
                  <option value="Period">Period</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase text-gray-500">Occupancy Rate (%)</span>
                <input type="number" step="0.01" value={form.occupancyRate} onChange={(e) => setForm({ ...form, occupancyRate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase text-gray-500">Rental Yield (%)</span>
                <input type="number" step="0.01" value={form.rentalYield} onChange={(e) => setForm({ ...form, rentalYield: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase text-gray-500">Collection Rate (%)</span>
                <input type="number" step="0.01" value={form.collectionRate} onChange={(e) => setForm({ ...form, collectionRate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </label>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReportPage;
