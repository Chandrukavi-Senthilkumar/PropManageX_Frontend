import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL
    ? `${process.env.REACT_APP_API_BASE_URL}/api/Booking`
    : 'http://localhost:5154/api/Booking';

const getHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Cookies.get('accessToken')}`,
  },
});

export const bookingService = {
  // ✅ Book a unit
  bookUnit: async (unitId) => {
    const response = await axios.post(
      API_BASE_URL,
      { unitId },
      getHeaders()
    );
    return response.data;
  },

  // ✅ Get my bookings
  getMyBookings: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/my-bookings`,
      getHeaders()
    );
    return response.data;
  },
};