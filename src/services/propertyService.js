import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL
    ? `${process.env.REACT_APP_API_BASE_URL}/api/Property`
    : 'http://localhost:5154/api/Property';

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${Cookies.get('accessToken')}`,
    'Content-Type': 'application/json',
  },
});


export const propertyService = {
  getProperties: async (params) => {
    // Added .then(res => res.data) to match SaleService style
    return await axios.get(API_BASE_URL, { params, ...getHeaders() }).then(res => res.data);
  },

  getPropertyById: async (id) => {
    // Added .then(res => res.data)
    return await axios.get(`${API_BASE_URL}/${id}`, getHeaders()).then(res => res.data);
  },

  createProperty: async (propertyData) => {
    const response = await axios.post(API_BASE_URL, propertyData, getHeaders());
    return response.data; 
  },

  updateProperty: async (id, propertyData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, propertyData, getHeaders());
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await axios.delete(
      `${API_BASE_URL}/${id}`,
      getHeaders()
    );
    return response.data;
  },
};