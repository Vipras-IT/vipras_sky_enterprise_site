import { get } from 'lodash';
import api from './api';

const addTodayAttendance = (data) => api.post(`/api/v1/bulk-attendace`, data);

const addTodayNewAttendance = (data) =>
  api.post(`/api/v1/bulk-attendace/add`, data);

const updateAttendance = (data) =>
  api.post(`/api/v1/bulk-attendace/${data.id}`, data);

const updateAttendanceByEmployee = (employeeNumber, data) =>
  api.post(`/api/v1/bulk-attendace/update/${employeeNumber}`, data);

const getAttendancedetails = (id) => {
  return api.get(`/api/v1/bulk-attendace/${id}`);
};

const fetchManualattendanceData = async (
  page,
  pageSize,
  pageFilter,
  // month,
  todayYears,
  todayMonth,
) => {
  const offset = page + 1;
  const monthFilter = { month: `${todayMonth}-${todayYears}` };
  const serializedData = JSON.stringify(monthFilter);
  let url = `/api/v1/manualAttendace?page=${offset}&limit=${pageSize}&filter=${serializedData}`;

  if (
    typeof pageFilter.value === 'string' ||
    typeof pageFilter.value === 'number'
  ) {
    const filterValue = pageFilter.value ? pageFilter.value.trim() : '';
    if (filterValue) {
      const filter = {
        [`${pageFilter.key}`]: filterValue,
        month: `${todayMonth}-${todayYears}`,
      };
      const serializedData = JSON.stringify(filter);
      url = `/api/v1/manualAttendace?filter=${serializedData}`;
    }
  } else if (
    typeof pageFilter.value === 'object' &&
    'employeeNumber' in pageFilter.value
  ) {
    if (pageFilter.value.employeeNumber) {
      const filter = {
        [`${pageFilter.key}`]: pageFilter.value.employeeNumber,
        month: `${todayMonth}-${todayYears}`,
      };
      const serializedData = JSON.stringify(filter);
      url = `/api/v1/manualAttendace?filter=${serializedData}`;
    }
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
  addTodayAttendance,
  addTodayNewAttendance,
  updateAttendance,
  updateAttendanceByEmployee,
  getAttendancedetails,
  fetchManualattendanceData,
};
