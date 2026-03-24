import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = "http://localhost:5154/api";

const getHeaders = () => {
  const token = Cookies.get('accessToken'); // OR Cookies.get('token') - check your Login logic!
  console.log("Unit API Token:", token); // DEBUG THIS
  
  return {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const unitAmenityService = {
  
  // --- Units ---

  getUnits: async (params) => {
    const response = await axios.get(`${API_BASE_URL}/Unit`, { 
      params, 
      ...getHeaders() 
    });
    return response.data;
  },

  getUnitById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/Unit/${id}`, getHeaders());
    return response.data;
  },

  createUnit: async (unitData) => {
    const response = await axios.post(`${API_BASE_URL}/Unit`, unitData, getHeaders());
    return response.data;
  },

  updateUnit: async (id, unitData) => {
    const response = await axios.put(`${API_BASE_URL}/Unit/${id}`, unitData, getHeaders());
    return response.data;
  },

  deleteUnit: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/Unit/${id}`, getHeaders());
    return response.data;
  },

  // --- Amenities ---


  getAmenities: async (params) => {
    const response = await axios.get(`${API_BASE_URL}/Amenity`, { 
      params, 
      ...getHeaders() 
    });
    return response.data;
  },


  createAmenity: async (amenityData) => {
    const response = await axios.post(`${API_BASE_URL}/Amenity`, amenityData, getHeaders());
    return response.data;
  },

  getAmenityById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/Amenity/${id}`, getHeaders());
    return response.data;
  },

  updateAmenity: async (id, amenityData) => {
    const response = await axios.put(`${API_BASE_URL}/Amenity/${id}`, amenityData, getHeaders());
    return response.data;
  },

  deleteAmenity: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/Amenity/${id}`, getHeaders());
    return response.data;
  }
};