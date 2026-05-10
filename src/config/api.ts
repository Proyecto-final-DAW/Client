import axios from 'axios';

const LOCAL_API_BASE_URL = import.meta.env.VITE_LOCAL_API_BASE_URL;
const PROD_API_BASE_URL = import.meta.env.VITE_PROD_API_BASE_URL;

const USE_LOCAL_API = import.meta.env.VITE_USE_LOCAL_API === 'true';

const RESOLVED_BASE_URL = USE_LOCAL_API
  ? LOCAL_API_BASE_URL
  : PROD_API_BASE_URL;

// Fail-fast at module init if the env var resolution produced
// `undefined` — vite ships the bundle either way, but every API call
// then hits `https://undefined/users/auth/login` and fails with a
// confusing CORS or DNS error. Throwing here surfaces the
// misconfiguration the moment the app boots in dev.
if (!RESOLVED_BASE_URL || typeof RESOLVED_BASE_URL !== 'string') {
  throw new Error(
    `API_BASE_URL is not set. Configure VITE_${USE_LOCAL_API ? 'LOCAL' : 'PROD'}_API_BASE_URL in your .env file (or flip VITE_USE_LOCAL_API).`
  );
}

export const API_BASE_URL: string = RESOLVED_BASE_URL;

// `withCredentials` is intentionally NOT set. Auth lives in the
// `Authorization: Bearer <jwt>` header attached by the interceptor
// below; we never read or write a session cookie. Forcing
// `withCredentials: true` on top of header auth used to make the
// browser send cookies on every cross-origin call, which (a) does
// nothing useful, and (b) makes CORS unforgiving — the server has
// to echo the exact origin and `credentials: true`, and a wildcard
// origin silently breaks. Plain header auth is enough.
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
  getStatsHistory: `${API_BASE_URL}/stats/history`,
  getDashboardCards: `${API_BASE_URL}/users/cards`,
  getWeeklySummary: `${API_BASE_URL}/sessions/weekly-summary`,
  createSession: `${API_BASE_URL}/sessions`,
  getSessionHistory: `${API_BASE_URL}/sessions/history`,
  routines: `${API_BASE_URL}/routines`,
  deleteRoutine: (routineId: string) => `${API_BASE_URL}/routines/${routineId}`,
  updateRoutine: (routineId: string) => `${API_BASE_URL}/routines/${routineId}`,
  getDiet: (userId: number) => `${API_BASE_URL}/diet/${userId}`,
  getDietState: `${API_BASE_URL}/diet/state`,
  logDietToday: `${API_BASE_URL}/diet/log`,
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
  getStreakStatus: `${API_BASE_URL}/streak/status`,
  getCharacterState: `${API_BASE_URL}/character/state`,
  chooseCharacterClass: `${API_BASE_URL}/character/choose`,
  getCharacterCatalog: `${API_BASE_URL}/character/catalog`,
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

      // Redirect to `/` (the marketing landing) instead of `/login` so
      // the post-401 destination matches `ProtectedRoute`'s redirect
      // for unauthenticated users — both flows now land in the same
      // place. The landing has the explicit "iniciar sesion" CTA.
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);
