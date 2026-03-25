import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:5154/api/RevenueReport';

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${Cookies.get('accessToken')}`,
    'Content-Type': 'application/json',
  },
});

export const revenueReportService = {
  getReports: async (params) => {
    const response = await axios.get(API_BASE_URL, { params, ...getHeaders() });
    return response.data;
  },

  getReportById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, getHeaders());
    return response.data;
  },

  createReport: async (data) => {
    const response = await axios.post(API_BASE_URL, data, getHeaders());
    return response.data;
  },

  updateReport: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data, getHeaders());
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, getHeaders());
    return response.data;
  },
};