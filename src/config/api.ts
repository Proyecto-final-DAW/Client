import axios from 'axios';

const LOCAL_API_BASE_URL = import.meta.env.VITE_LOCAL_API_BASE_URL;
const PROD_API_BASE_URL = import.meta.env.VITE_PROD_API_BASE_URL;

const USE_LOCAL_API = import.meta.env.VITE_USE_LOCAL_API === 'true';

export const API_BASE_URL = USE_LOCAL_API
  ? LOCAL_API_BASE_URL
  : PROD_API_BASE_URL;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/users/auth/login`,
  onboarding: `${API_BASE_URL}/users/onboarding`,
};
