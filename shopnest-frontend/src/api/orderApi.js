import axiosInstance from './axiosInstance';

export const orderApi = {
  placeOrder: (payload) => axiosInstance.post('/orders', payload),
  getMyOrders: () => axiosInstance.get('/orders'),
  getAllOrders: (params) => axiosInstance.get('/orders/all', { params }),
  getById: (id) => axiosInstance.get(`/orders/${id}`),
  updateStatus: (id, orderStatus) => axiosInstance.put(`/orders/${id}`, { orderStatus }),
};
