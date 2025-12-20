import axios from './api';
import { get } from 'lodash';

const updateTickets = (data) => axios.post(`/api/v1/CRM/${data.id}`, data);
const getTicketsdetails = (id) => {
  return axios.get(`/api/v1/CRM/${id}`);
};
const getTicket = (id) => {
  const defaultFilter = { assignedEmployeeId: id };
  const serializedData = JSON.stringify(defaultFilter);
  return axios.get(`/api/v1/CRM?filter=${serializedData}`);
};

const getTickets = (id, call) => {
  const defaultFilter = { assignedEmployeeId: id, typeOfCall: call };
  const serializedData = JSON.stringify(defaultFilter);
  return axios.get(`/api/v1/CRM?filter=${serializedData}`);
};
const fetchImprestHolderData = async (page, pageSize, pageFilter, id) => {
  const offset = page + 1;
  const defaultFilter = { assignedEmployeeId: id };
  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/CRM?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    let filter = { [`${pageFilter.key}`]: pageFilter.value };
    filter = { ...filter, assignedEmployeeId: id };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/CRM?filter=${serializedData}`;
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
const fetchImprestHolderDatas = async (
  page,
  pageSize,
  pageFilter,
  id,
  role,
) => {
  const offset = page + 1;
  // const defaultFilter = { assignedEmployeeId: id, ticketType: 'INTERNAL' };
  let defaultFilter = {
    $or: [
      { assignedEmployeeId: id },
      { firstLevelEmployeeId: id },
      { secondLevelEmployeeId: id },
      { createdBy: id },
    ],
    ticketType: 'INTERNAL',
  };

  if (role === 'SUPER_ADMIN') {
    defaultFilter = {
      ticketType: 'INTERNAL',
    };
  }

  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/CRM?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    let filter = { [`${pageFilter.key}`]: pageFilter.value };
    filter = { ...filter };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/CRM?filter=${serializedData}`;
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
  fetchImprestHolderData,
  updateTickets,
  getTicketsdetails,
  getTicket,
  getTickets,
  fetchImprestHolderDatas,
};
