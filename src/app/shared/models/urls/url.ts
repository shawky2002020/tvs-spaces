const BASE_URL = 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/`;


// AUthentication URLs
export const AUTH_URLS = {
  LOGIN: `${API_URL}auth/login`,
  REGISTER: `${API_URL}auth/signup`,
  LOGOUT: `${API_URL}auth/logout`,
  REFRESH:`${API_URL}auth/refresh`
};
