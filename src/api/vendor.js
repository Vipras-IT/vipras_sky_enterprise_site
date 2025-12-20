import axios from './api';
import { get } from 'lodash';

const getVendordetails = (vendorCode) => {
  const filter = { vendorCode: vendorCode };
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/vendor?filter=${serializedData}`);
};

const getVentorNameDetails = () => {
  return axios.get(`/api/v1/vendor`);
};

const getvendorByvendor = (vendorCode) => {
  const filter = { vendorCode: vendorCode };
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/vendor?filter=${serializedData}`);
};

const updateVendor = (data) => axios.post(`/api/v1/vendor/${data.id}`, data);

const getVendorByID = (id) => {
  return axios.get(`/api/v1/vendor/${id}`);
};

const updatevendordetails = (data) => axios.post(`/api/v1/vendor`, data);

const fetchvendorData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/vendor?page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/vendor?filter=${serializedData}`;
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
  getVendordetails,
  updatevendordetails,
  fetchvendorData,
  updateVendor,
  getVendorByID,
  getVentorNameDetails,
  getvendorByvendor,
};
