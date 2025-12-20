import axios from './api';
import { get } from 'lodash';

const addProduct = (data) => axios.post(`/api/v1/product`, data);

const getProductDetails = () => {
  return axios.get(`/api/v1/product`);
};

const getProductDetailsFilter = (filter) => {
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/product?filter=${serializedData}`);
};

const updateProductDetails = (data) =>
  axios.post(`/api/v1/product/${data.id}`, data);

const getProductDetailsById = (id) => {
  return axios.get(`/api/v1/product/${id}`);
};

const fetchProductData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/product?page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/product?filter=${serializedData}`;
  }

  try {
    const response = await axios.get(url);
    const results = get(response, 'data.data.items', []) || [];

    const hasError = get(response, 'data.success');

    const data = {
      results: results,
      count: get(response, 'data.data.totalItems'),
      hasError,
    };
    return data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const deleteByProduct = (id) => {
  return axios.delete(`/api/v1/product/${id}`);
};

export default {
  addProduct,
  getProductDetails,
  fetchProductData,
  getProductDetailsById,
  updateProductDetails,
  deleteByProduct,
  getProductDetailsFilter
};
