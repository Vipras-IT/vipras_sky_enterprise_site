import axios from './api';
import { get } from 'lodash';

const addDocument = (data) => axios.post(`/api/v1/document`, data);
const addDmrDocument = (data) => axios.post(`/api/v1/dmr`, data);

const getDocumentByFilter = (type) => {
  const filter = { bucket: type };
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/document?filter=${serializedData}`);
};

const getDmrDocumentByFilter = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  const defaultFilter = { from: null, to: null };
  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/dmr?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

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
    url = `/api/v1/dmr?filter=${serializedData}`;
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

const getDmrFmDocumentByFilter = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  const defaultFilter = { from: null, to: null };
  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/dmr/fm/list?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

  if (
    (pageFilter.from && pageFilter.from !== null) ||
    (pageFilter.to && pageFilter.to !== null)
  ) {
    let filter = {
      from: pageFilter.from,
      to: pageFilter.to,
    };
    filter = { ...filter };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/dmr/fm/list?filter=${serializedData}`;
  }

  try {
    const response = await axios.get(url);
    const results = get(response, 'data', []) || [];
    const finalData = (results?.data ?? []).sort((a, b) => {
      const numA = parseInt(a.employeeNumber?.replace(/\D/g, '') || '0', 10);
      const numB = parseInt(b.employeeNumber?.replace(/\D/g, '') || '0', 10);
      return numA - numB;
    });

    const hasError = get(response, 'data.success');

    const data = {
      results: finalData,
      count: get(response, 'data.data.totalItems'),
      hasError,
    };
    return data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};


export default {
  addDocument,
  getDocumentByFilter,
  addDmrDocument,
  getDmrDocumentByFilter,
  getDmrFmDocumentByFilter,
};
