import { get } from 'lodash';
import axios from './api';

const addStock = (data) => axios.post(`/api/v1/stockmain`, data);

// Get all the Stocks Details from the API
const getStockdetails = () => {
  return axios.get(`/api/v1/stockmain`);
};

// Update All Stocks from the API
const updateStockdetails = (id, data) =>
  axios.post(`/api/v1/stockmain/${data.id}`, data);

const fetchStocksData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/stockmain?page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/stockmain?filter=${serializedData}`;
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

export default {
  addStock,
  getStockdetails,
  updateStockdetails,
  fetchStocksData,
};
