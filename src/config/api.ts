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
  register: `${API_BASE_URL}/users/auth/register`,
  login: `${API_BASE_URL}/users/auth/login`,
  getExercises: `${API_BASE_URL}/exercises`,
  profile: `${API_BASE_URL}/profile/me`,
  changePassword: `${API_BASE_URL}/profile/me/password`,
  statsInit: `${API_BASE_URL}/stats/init`,
  dashboardCards: `${API_BASE_URL}/users/cards`,
  onboarding: (userId: number) => `${API_BASE_URL}/onboarding/${userId}/submit`,
  macrosCalculate: (userId: number) =>
    `${API_BASE_URL}/users/${userId}/macros/calculate`,
  performedExercises: (userId: number) =>
    `${API_BASE_URL}/progress/${userId}/exercises-performed`,
  exerciseProgress: (userId: number, exerciseId: string) =>
    `${API_BASE_URL}/progress/${userId}/exercise/${exerciseId}`,
};
