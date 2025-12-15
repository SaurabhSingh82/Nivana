// This typically points to your backend server port (usually 5000 or 8000 for Node/Express)
import axios from 'axios';
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

// axios instance that auto-attaches token from localStorage and handles 401s
const instance = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

instance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        // if user's on client, refresh to /login
        if (typeof window !== 'undefined') {
          window.location.replace('/login');
        }
      } catch (e) {}
    }
    return Promise.reject(err);
  }
);

export const apiService = {
  login: async (credentials) => {
    const res = await instance.post('/auth/login', credentials);
    return res.data;
  },
  signup: async (userInfo) => {
    const res = await instance.post('/auth/signup', userInfo);
    return res.data;
  },
  getDashboard: async () => {
    const res = await instance.get('/dashboard');
    return res.data;
  },
  logMood: async (moodData) => {
    const res = await instance.post('/moods', moodData);
    return res.data;
  },
  getAssessmentHistory: async () => {
    const res = await instance.get('/assessments/history');
    return res.data;
  },
  startAssessment: async (age) => {
    const res = await instance.post('/assessments/start', { age });
    return res.data;
  },
  submitAssessment: async (payload) => {
    const res = await instance.post('/assessments/submit', payload);
    return res.data;
  },
};