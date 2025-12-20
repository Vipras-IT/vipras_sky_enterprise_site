import axios from './api';
import { get } from 'lodash';

const AddOtherDeductuion = (data) => axios.post(`/api/v1/otherdeduction`, data);
const getOtherDeductuiondetails = (id) => {
  return axios.get(`/api/v1/otherdeduction/${id}`);
};

const deleteOtherDeductuion = (id) => {
  return axios.delete(`/api/v1/otherdeduction/${id}`);
};

const updateOtherDeductuiondetails = (data) =>
  axios.post(`/api/v1/otherdeduction/${data.id}`, data);

const fetchOtherDeductuionData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  const defaultFilter = { from: null, to: null };
  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/otherdeduction?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

  if (
    (pageFilter.from && pageFilter.from !== null) ||
    (pageFilter.to && pageFilter.to !== null) ||
    pageFilter.value.trim().length > 1
  ) {
    let filter = {
      from: pageFilter.from,
      to: pageFilter.to,
    };
    if (pageFilter.value.trim().length > 1) {
      filter = { ...filter, [`${pageFilter.key}`]: pageFilter.value };
    }
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/otherdeduction?filter=${serializedData}`;
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
  AddOtherDeductuion,
  getOtherDeductuiondetails,
  updateOtherDeductuiondetails,
  fetchOtherDeductuionData,
  deleteOtherDeductuion,
};
