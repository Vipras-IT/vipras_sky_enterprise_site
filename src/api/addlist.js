import { get } from 'lodash';
import api from './api';

const addUsers = (data) => api.post(`/api/v1/users`, data);

const updateUsers = (data) => api.post(`/api/v1/users/update/user`, data);

const getUserdetails = (userId) => {
  return api.get(`/api/v1/users/${userId}`);
};
const fetchusermanagementData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  const filter = { status: true };
  const serializedData = JSON.stringify(filter);
  let url = `/api/v1/users?page=${offset}&limit=${pageSize}&filter=${serializedData}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value, status: true };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/users?filter=${serializedData}`;
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
  addUsers,
  getUserdetails,
  fetchusermanagementData,
  updateUsers,
};
