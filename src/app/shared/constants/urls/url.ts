const BASE_URL = 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/`;

// Authentication URLs
export const AUTH_URLS = {
  LOGIN: `${API_URL}auth/login`,
  REGISTER: `${API_URL}auth/signup`,
  LOGOUT: `${API_URL}auth/logout`,
  REFRESH: `${API_URL}auth/refresh`,
};

// User URLs
export const USER_URLS = {
  EDIT: `${API_URL}user/edit`,
};

// Booking URLs
export const BOOKING_URLS = {
  BASE: `${API_URL}bookings`,
  AVAILABILITY: `${API_URL}bookings/availability`,
  CALCULATE_PRICE: `${API_URL}bookings/calculate-price`,
  CREATE: `${API_URL}bookings`,
  SPACES: `${API_URL}bookings/spaces`,
  SPACE_BY_ID: (id: string) => `${API_URL}bookings/spaces/${id}`,
  AVAILABILITY_GRID: (spaceId: string, date: string) => `${API_URL}bookings/${spaceId}/availability/${date}`,
  UNAVAILABLE_DATES: (spaceId: string, year: number, month: number) => `${API_URL}bookings/${spaceId}/unavailable-dates/${year}/${month}`,
};


