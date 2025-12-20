import axios from './api';
import { get } from 'lodash';

const Addpurchase = (data) => axios.post(`/api/v1/purchase`, data);

const AddAssets = (data) => axios.post(`/api/v1/asset`, data);

const getpurchasedetails = (data) => {
  return axios.get(`/api/v1/purchase/${data}`);
};

const getpurchasedetailsbyid = (id) => {
  return axios.get(`/api/v1/purchase/${id}`);
};

const updatepurchasedetails = (data) =>
  axios.post(`/api/v1/purchase/${data.id}`, data);

const fetchData = async (
  page,
  pageSize,
  pageFilter,
  purchaseType,
  todayYears,
  todayMonth,
) => {
  const offset = page + 1;
  const baseFilter = {
    purchaseType,
    month: `${todayYears}-${todayMonth}`,
  };
  

  if (pageFilter?.value?.trim()?.length > 1) {
    baseFilter[pageFilter.key] = pageFilter.value;
  }

  const serializedBaseFilter = JSON.stringify(baseFilter);

  // let url = `/api/v1/purchase?page=${offset}&limit=${pageSize}&filter=${serializedBaseFilter}`;

  // if (pageFilter.value.trim().length > 1) {
  //   const dynamicFilter = { [`${pageFilter.key}`]: pageFilter.value };
  //   const serializedDynamicFilter = JSON.stringify(dynamicFilter);
  //   url = `/api/v1/purchase?filter=${serializedDynamicFilter}`;
  // }

  let url = `/api/v1/purchase?page=${offset}&limit=${pageSize}&filter=${serializedBaseFilter}`;

  try {
    const response = await axios.get(url);

    const results = get(response, 'data.data.items', []) || [];
    const hasError = get(response, 'data.success');

    return {
      results,
      count: get(response, 'data.data.totalItems'),
      hasError,
    };
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const fetchpurchaseData = async (
  page,
  pageSize,
  pageFilter,
  currentYear,
  currentMonth,
) => {
  return fetchData(
    page,
    pageSize,
    pageFilter,
    'STORE',
    currentYear,
    currentMonth,
  );
};

const fetchpurchaseAssetData = async (
  page,
  pageSize,
  pageFilter,
  currentYear,
  currentMonth,
) => {
  return fetchData(
    page,
    pageSize,
    pageFilter,
    'ASSET',
    currentYear,
    currentMonth,
  );
};
const fetchpurchaseHKData = async (
  page,
  pageSize,
  pageFilter,
  currentYear,
  currentMonth,
) => {
  return fetchData(page, pageSize, pageFilter, 'HK', currentYear, currentMonth);
};

export default {
  Addpurchase,
  AddAssets,
  getpurchasedetails,
  updatepurchasedetails,
  fetchpurchaseData,
  fetchpurchaseAssetData,
  fetchpurchaseHKData,
  getpurchasedetailsbyid,
};
