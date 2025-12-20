// import api from 'api';
import { get } from 'lodash';
import api from './api';

const addCrm = (data) => api.post(`/api/v1/CRM`, data);

const getByIdCRM = (id) => {
  return api.get(`/api/v1/CRM/${id}`);
};

const getByUserDropDown = () => {
  return api.get(`/api/v1/users/list/allUserDropdown`);
};

const getByAuthUserDropDown = () => {
  return api.get(`/api/v1/users/list/allUserDropdown/authOfficer`);
};

const getBySubcontractorUserDropDown = () => {
  return api.get(`/api/v1/users/list/allUserDropdown/subContractor`);
};

const updateCRM = (data) => api.post(`/api/v1/CRM/${data.id}`, data);

const getCrm = () => api.get(`/api/v1/CRM`);
const fetchSaleReturnData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/CRM?page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/CRM?filter=${serializedData}`;
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
  addCrm,
  fetchSaleReturnData,
  getCrm,
  updateCRM,
  getByIdCRM,
  getByUserDropDown,
  getByAuthUserDropDown,
  getBySubcontractorUserDropDown,
};
