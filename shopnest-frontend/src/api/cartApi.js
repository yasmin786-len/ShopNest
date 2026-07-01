import axiosInstance from './axiosInstance';

export const cartApi = {
  get: () => axiosInstance.get('/cart'),
  add: (productId, quantity) => axiosInstance.post('/cart', { productId, quantity }),
  update: (cartItemId, quantity) => axiosInstance.put(`/cart/${cartItemId}`, { quantity }),
  remove: (cartItemId) => axiosInstance.delete(`/cart/${cartItemId}`),
  clear: () => axiosInstance.delete('/cart'),
};
