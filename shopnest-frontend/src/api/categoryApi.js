import axiosInstance from './axiosInstance';

export const categoryApi = {
  getAll: () => axiosInstance.get('/categories'),
  getById: (id) => axiosInstance.get(`/categories/${id}`),
  create: (payload) => axiosInstance.post('/categories', payload),
  update: (id, payload) => axiosInstance.put(`/categories/${id}`, payload),
  remove: (id) => axiosInstance.delete(`/categories/${id}`),
};
