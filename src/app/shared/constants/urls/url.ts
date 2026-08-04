import { environment } from '../../../../environments/environment';

const API_URL = environment.apiUrl.endsWith('/')
  ? environment.apiUrl
  : `${environment.apiUrl}/`;

export const AUTH_URLS = {
  LOGIN: `${API_URL}auth/login`,
  REGISTER: `${API_URL}auth/signup`,
  LOGOUT: `${API_URL}auth/logout`,
  REFRESH: `${API_URL}auth/refresh`,
};

export const USER_URLS = {
  EDIT: `${API_URL}user/edit`,
};

export const BOOKING_URLS = {
  BASE: `${API_URL}bookings`,
  AVAILABILITY: `${API_URL}bookings/availability`,
  CALCULATE_PRICE: `${API_URL}bookings/calculate-price`,
  CREATE: `${API_URL}bookings`,
  SPACES: `${API_URL}bookings/spaces`,
  SPACE_BY_ID: (id: string) => `${API_URL}bookings/spaces/${id}`,
  SPACE_BY_SLUG: (slug: string) => `${API_URL}bookings/spaces/slug/${slug}`,
  AVAILABILITY_GRID: (spaceId: string, date: string) =>
    `${API_URL}bookings/${spaceId}/availability/${date}`,
  UNAVAILABLE_DATES: (spaceId: string, year: number, month: number) =>
    `${API_URL}bookings/${spaceId}/unavailable-dates/${year}/${month}`,
};

export const DASHBOARD_URLS = {
  STATS: `${API_URL}dashboard/stats`,
};
