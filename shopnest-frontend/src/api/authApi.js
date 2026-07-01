import axiosInstance from './axiosInstance';

export const authApi = {
  register: (payload) => axiosInstance.post('/auth/register', payload),
  login: (payload) => axiosInstance.post('/auth/login', payload),
  refresh: (refreshToken) => axiosInstance.post('/auth/refresh', { refreshToken }),
  logout: () => axiosInstance.post('/auth/logout'),
};
