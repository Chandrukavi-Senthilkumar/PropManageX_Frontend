import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL
    ? `${process.env.REACT_APP_API_BASE_URL}/api/Property`
    : 'http://localhost:5154/api/Property';

// 1. Updated getHeaders to handle dynamic Content-Type
const getHeaders = (isFormData = false) => {
  const headers = {
    Authorization: `Bearer ${Cookies.get('accessToken')}`,
  };

  // ONLY add application/json for standard requests.
  // For FormData, we DELETE the key so the browser sets the boundary automatically.
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return { headers };
};

export const propertyService = {
  getProperties: async (params) => {
    return await axios
      .get(API_BASE_URL, { params, ...getHeaders() })
      .then((res) => res.data);
  },

  getPropertyById: async (id) => {
    return await axios
      .get(`${API_BASE_URL}/${id}`, getHeaders())
      .then((res) => res.data);
  },

  // 2. Updated createProperty to handle FormData
  createProperty: async (propertyData) => {
    // Check if we are sending FormData (for images)
    const isFormData = propertyData instanceof FormData;
    
    const response = await axios.post(
      API_BASE_URL, 
      propertyData, 
      getHeaders(isFormData)
    );
    return response.data;
  },

  updateProperty: async (id, propertyData) => {
    const isFormData = propertyData instanceof FormData;
    const response = await axios.put(
      `${API_BASE_URL}/${id}`, 
      propertyData, 
      getHeaders(isFormData)
    );
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