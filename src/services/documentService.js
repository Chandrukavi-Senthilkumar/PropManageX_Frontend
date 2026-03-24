import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = "http://localhost:5154/api/Document";

const getHeaders = () => {
  const token = Cookies.get('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const documentService = {
  getDocuments: async (params) => {
    const response = await axios.get(API_BASE_URL, { params, ...getHeaders() });
    return response.data;
  },

  getDocumentById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`, getHeaders());
    return response.data;
  },

  downloadDocument: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}/download`, {
      ...getHeaders(),
      responseType: 'blob',
    });
    return response.data;
  },

  uploadDocument: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/upload`, data, {
      ...getHeaders(),
      headers: {
        ...getHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateDocument: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
      ...getHeaders(),
      headers: {
        ...getHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, getHeaders());
    return response.data;
  },
};
