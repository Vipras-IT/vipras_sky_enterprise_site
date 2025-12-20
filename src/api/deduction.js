import { get, trim } from 'lodash';
import api from './api';

const AddSales = (data) => api.post(`/api/v1/Sales`, data);

const getSaledetails = (saleId) => {
  return api.get(`/api/v1/sales/${saleId}`);
};

const getProductdetails = () => {
  // const filter = { [`${pageFilter.key}`]: pageFilter.value };
  // const serializedData = JSON.stringify(filter);
  // const serializedDatas = JSON.stringify('STORE');
  return api.get(`/api/v1/product?filter=%7B%20%22type%22%3A%20%22STORE%22%7D`);
};

const getStockdetails = () => {
  return api.get(`/api/v1/stockmain`);
};

const updatesalesdetails = (data) => api.post(`/api/v1/sales/${data.id}`, data);
const fetchSalesData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/Sales?page=${offset}&limit=${pageSize}`;

  if (trim(pageFilter.value).length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/Sales?filter=${serializedData}`;
  }

  try {
    const response = await api.get(url);
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
const AddSaleReturn = (data) => api.post(`/api/v1/stockreturn`, data);
const fetchSaleReturnData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/stockreturn?page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/stockreturn?filter=${serializedData}`;
  }

  try {
    const response = await api.get(url);
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
  AddSales,
  getSaledetails,
  updatesalesdetails,
  fetchSalesData,
  AddSaleReturn,
  fetchSaleReturnData,
  getProductdetails,
  getStockdetails
};
