import { get } from 'lodash';
import api from './api';
const addImprestHolder = (data) => api.post(`/api/v1/imprest`, data);

const getImprestHolder = () => {
  return api.get(`/api/v1/imprest`);
};

const fetchAddImprestData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/imprest?page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/imprest?filter=${serializedData}`;
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
  addImprestHolder,
  getImprestHolder,
  fetchAddImprestData,
};
