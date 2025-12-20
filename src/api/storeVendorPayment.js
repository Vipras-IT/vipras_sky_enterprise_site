import { get } from 'lodash';
import axios from './api';

const postStoreVendordetails = (data) =>
  axios.post(`/api/v1/storevendor`, data);

const getStoreVendordetails = (id) => {
  return axios.get(`/api/v1/storevendor/${id}`);
};

const updateStoreVendordManagementdetails = (data) =>
  axios.post(`/api/v1/storevendor/${data.id}`, data);

const fetchStoreVendordManagementData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/storevendor?page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/storevendor?filter=${serializedData}`;
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
  postStoreVendordetails,
  getStoreVendordetails,
  updateStoreVendordManagementdetails,
  fetchStoreVendordManagementData,
};
