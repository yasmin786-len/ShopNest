import axiosInstance from './axiosInstance';

export const userApi = {
  getProfile: () => axiosInstance.get('/profile'),
  updateProfile: (payload) => axiosInstance.put('/profile', payload),
  changePassword: (payload) => axiosInstance.put('/profile/password', payload),
  getAllUsers: () => axiosInstance.get('/users'),
};

export const adminApi = {
  getDashboardStats: () => axiosInstance.get('/admin/dashboard'),
};
