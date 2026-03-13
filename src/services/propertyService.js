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

  createProperty: async (propertyData) => {
    // Standard JSON POST
    const response = await axios.post(API_BASE_URL, propertyData, getHeaders());
    return response.data; 
  },

};