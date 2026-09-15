import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

// During local Vite development, use the same-origin /api proxy. This avoids
// browser CORS issues while keeping production deployments configurable.
const baseURL = import.meta.env.DEV ? '/api' : configuredApiUrl || '/api';

export const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lilyAdminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const requestUrl = String(error.config?.url || '');
      const isLoginRequest = requestUrl.includes('/auth/login');

      if (!isLoginRequest) {
        localStorage.removeItem('lilyAdminToken');
        localStorage.removeItem('lilyAdminUser');
        window.dispatchEvent(new Event('lily-admin-unauthorized'));
      }
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = 'Something went wrong.') {
  if (error?.code === 'ERR_NETWORK') {
    return 'Unable to reach the Lily server. Make sure npm run dev is running and the backend is connected.';
  }

  if (error?.code === 'ECONNABORTED') {
    return 'The server took too long to respond. Please try again.';
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}
