import axiosInstance from './axiosInstance';

export const wishlistApi = {
  get: () => axiosInstance.get('/wishlist'),
  add: (productId) => axiosInstance.post('/wishlist', { productId }),
  remove: (wishlistItemId) => axiosInstance.delete(`/wishlist/${wishlistItemId}`),
};
