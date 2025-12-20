// import axios from '../helpers/axiosConfig';
import { get, isArray, isEmpty, trim } from 'lodash';
import api from './api';

const addSite = (data) => api.post(`/api/v1/site`, data);

const addShiftSchedule = (data) => api.post(`/api/v1/shift`, data);

const getShiftScheduleById = (siteId, month) => {
  return api.get(`/api/v1/shift/by/${siteId}/${month}`);
};

const getAttendanceById = (siteId) => {
  return api.get(
    `/api/v1/erp?collection=erp_attendance&field_name=siteId&field_value=${siteId}`,
  );
};

const updateSite = (data) => api.post(`/api/v1/site/${data.id}`, data);

const updateShiftSchedule = (id, data) => api.post(`/api/v1/shift/${id}`, data);

const getSitedetails = (siteId) => {
  return api.get(`/api/v1/site/${siteId}`);
};

const getSitedetailsBySiteCode = (siteId) => {
  return api.get(`/api/v1/site/by/${siteId}`);
};

const getAllSiteIds = () => {
  return api.get(`/api/v1/site/allSiteIds`);
};

const getAllRole = () => {
  return api.get(`/api/v1/role/allrole`);
};

const fetchSiteData = async (page, pageSize, pageFilter, siteId) => {
  let isActive = pageFilter.key === 'isActive' ? pageFilter.value : true;
  const offset = page + 1;
  const filter = { isActive };
  const serializedData = JSON.stringify(filter);
  let url = `/api/v1/site?page=${offset}&limit=${pageSize}&filter=${serializedData}`;

  const unitCodes = isArray(siteId) ? siteId : [];
  if (!isEmpty(unitCodes) && unitCodes[0] !== 'ALL') {
    // const filter = { siteCode: siteId, isActive };
    const filter = { unitcode: { $in: unitCodes }, isActive };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/site?filter=${serializedData}&page=${offset}&limit=${pageSize}`;
  }

  if (trim(pageFilter.value).length > 1) {
    const siteIdNewArray = isArray(siteId) ? siteId : [];
    const finalSiteIds =
      !isEmpty(unitCodes) && unitCodes[0] !== 'ALL' ? siteIdNewArray : [];
    const isAllAccess = !isEmpty(unitCodes) && unitCodes[0] === 'ALL';
    const filter = !isAllAccess
      ? {
          [`${pageFilter.key}`]: pageFilter.value,
          unitcode: { $in: finalSiteIds },
          isActive,
        }
      : { [`${pageFilter.key}`]: pageFilter.value, isActive };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/site?filter=${serializedData}&page=${offset}&limit=${pageSize}`;
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
  addSite,
  updateSite,
  getSitedetails,
  fetchSiteData,
  getSitedetailsBySiteCode,
  addShiftSchedule,
  getShiftScheduleById,
  updateShiftSchedule,
  getAttendanceById,
  getAllSiteIds,
  getAllRole,
};
