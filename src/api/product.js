import instance from './axios';

export const getProducts = async (params) => {
  const response = await instance.get('/product', { params });
  return response.data;
};

export const createProduct = async (data) => {
  const response = await instance.post('/product', data);
  return response;
};
