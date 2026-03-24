import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = "http://localhost:5154/api/Property";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${Cookies.get('accessToken')}`,
  }
});

export const propertyService = {
  getProperties: async (params) => {
    return await axios.get(API_BASE_URL, { params, ...getHeaders() });
  },

  getPropertyById: async (id) => {
    return await axios.get(`${API_BASE_URL}/${id}`, getHeaders());
  },

  createProperty: async (propertyData) => {
    // Standard JSON POST
    const response = await axios.post(API_BASE_URL, propertyData, getHeaders());
    return response.data; 
  },

  updateProperty: async (id, propertyData) => {
    // PUT request to update existing property
    const response = await axios.put(`${API_BASE_URL}/${id}`, propertyData, getHeaders());
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, getHeaders());
    return response.data;
  },

};