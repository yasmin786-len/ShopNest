import axiosInstance from './axiosInstance';

export const productApi = {
  getAll: (params) => axiosInstance.get('/products', { params }),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  search: (keyword, params) => axiosInstance.get('/products/search', { params: { keyword, ...params } }),
  getByCategory: (categoryId, params) => axiosInstance.get(`/products/category/${categoryId}`, { params }),
  getFeatured: () => axiosInstance.get('/products/featured'),
  getTrending: () => axiosInstance.get('/products/trending'),
  getNewArrivals: () => axiosInstance.get('/products/new-arrivals'),
  getFlashDeals: () => axiosInstance.get('/products/flash-deals'),
  create: (payload) => axiosInstance.post('/products', payload),
  update: (id, payload) => axiosInstance.put(`/products/${id}`, payload),
  remove: (id) => axiosInstance.delete(`/products/${id}`),
};
