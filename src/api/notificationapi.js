import axios from './api';
import { get } from 'lodash';

const postNotification = (data) => axios.post(`/api/v1/notification`, data);

const postRole = (data) => axios.post(`/api/v1/role`, data);

const getRole = () => {
  return axios.get(`/api/v1/role/allrole`);
};

const getAllRoles = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/role?page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/role?filter=${serializedData}`;
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

const NotificationgetAll = () => {
  const currentDate = new Date()
    .toISOString()
    .slice(0, 10)
    .split('-')
    .reverse()
    .join('-');
  const [day, month, year] = currentDate.split('-');
  const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
  const filter = { date: isoDate };
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/notification?filter=${serializedData}`);
};

const deleteRoleById = (id) => {
  return axios.delete(`/api/v1/role/${id}`);
};

export default {
  postNotification,
  NotificationgetAll,
  postRole,
  getRole,
  getAllRoles,
  deleteRoleById,
};
