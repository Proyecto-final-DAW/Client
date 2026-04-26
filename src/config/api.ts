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
  logout: `${API_BASE_URL}/users/auth/logout`,
  getExercises: `${API_BASE_URL}/exercises`,
  profile: `${API_BASE_URL}/profile/me`,
  changePassword: `${API_BASE_URL}/profile/me/password`,
  initStats: `${API_BASE_URL}/stats/init`,
  getStats: `${API_BASE_URL}/users/stats`,
  getDashboardCards: `${API_BASE_URL}/users/cards`,
  getWeeklySummary: `${API_BASE_URL}/sessions/weekly-summary`,
  createSession: `${API_BASE_URL}/sessions`,
  getSessionHistory: `${API_BASE_URL}/sessions/history`,
  routines: `${API_BASE_URL}/routines`,
  deleteRoutine: (routineId: string) => `${API_BASE_URL}/routines/${routineId}`,
  addExerciseToRoutine: (routineId: string) =>
    `${API_BASE_URL}/routines/${routineId}/exercises`,
  removeExerciseFromRoutine: (routineId: string, exerciseId: string) =>
    `${API_BASE_URL}/routines/${routineId}/exercises/${exerciseId}`,
  reorderExercises: (routineId: string) =>
    `${API_BASE_URL}/routines/${routineId}/exercises/reorder`,
  getDiet: (userId: number) => `${API_BASE_URL}/diet/${userId}`,
  onboarding: (userId: number) => `${API_BASE_URL}/onboarding/${userId}/submit`,
  calculateMacros: (userId: number) =>
    `${API_BASE_URL}/users/${userId}/macros/calculate`,
  getPerformedExercises: (userId: number) =>
    `${API_BASE_URL}/progress/${userId}/exercises-performed`,
  getExerciseProgress: (userId: number, exerciseId: string) =>
    `${API_BASE_URL}/progress/${userId}/exercise/${exerciseId}`,
  getWeightHistory: (userId: number) =>
    `${API_BASE_URL}/progress/${userId}/weight`,
  getMilestones: `${API_BASE_URL}/milestones`,
  getMilestonesUnlocked: `${API_BASE_URL}/milestones/me`,
};

axios.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const token = localStorage.getItem('auth_token');
  if (!token) return config;

  const headers = (config.headers ?? {}) as Record<string, unknown>;
  const hasAuthHeader = typeof headers.Authorization === 'string';

  if (!hasAuthHeader) {
    config.headers = {
      ...(headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    } as never;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
