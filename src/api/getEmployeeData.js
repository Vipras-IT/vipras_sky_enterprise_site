import axios from './api';
import { get, isArray, isEmpty, trim } from 'lodash';

export const fetchEmployeeData = async (page, pageSize, pageFilter, siteId) => {
  let isActive = pageFilter.key === 'isActive' ? pageFilter.value : true;
  const offset = page + 1;
  const filter = { isActive };
  const serializedData = JSON.stringify(filter);
  let url = `/api/v1/employee?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

  const unitCodes = isArray(siteId) ? siteId : [];
  if (!isEmpty(unitCodes) && unitCodes[0] !== 'ALL') {
    // const filter = { siteCode: siteId, isActive };
    const filter = { siteCode: { $in: unitCodes }, isActive };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/employee?filter=${serializedData}&page=${offset}&limit=${pageSize}`;
  }

  if (trim(pageFilter.value).length > 1) {
    const siteIdNewArray = isArray(siteId) ? siteId : [];
    const finalSiteIds =
      !isEmpty(unitCodes) && unitCodes[0] !== 'ALL' ? siteIdNewArray : [];
    const isAllAccess = !isEmpty(unitCodes) && unitCodes[0] === 'ALL';
    const filter = !isAllAccess
      ? {
          [`${pageFilter.key}`]: pageFilter.value,
          siteCode: { $in: finalSiteIds },
          isActive,
        }
      : { [`${pageFilter.key}`]: pageFilter.value, isActive };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/employee?filter=${serializedData}&page=${offset}&limit=${pageSize}`;
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

export const fetchEmployeeVerificationData = async (
  page,
  pageSize,
  pageFilter,
  siteId,
) => {
  let isVerified = pageFilter.key === 'isVerified' ? pageFilter.value : false;
  const offset = page + 1;
  const filter = { isVerified };
  const serializedData = JSON.stringify(filter);
  let url = `/api/v1/employee?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

  const unitCodes = isArray(siteId) ? siteId : [];
  if (!isEmpty(unitCodes) && unitCodes[0] !== 'ALL') {
    // const filter = { siteCode: siteId, isActive };
    const filter = { siteCode: { $in: unitCodes }, isVerified };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/employee?filter=${serializedData}&page=${offset}&limit=${pageSize}`;
  }

  if (trim(pageFilter.value).length > 1) {
    const siteIdNewArray = isArray(siteId) ? siteId : [];
    const finalSiteIds =
      !isEmpty(unitCodes) && unitCodes[0] !== 'ALL' ? siteIdNewArray : [];
    const isAllAccess = !isEmpty(unitCodes) && unitCodes[0] === 'ALL';
    const filter = !isAllAccess
      ? {
          [`${pageFilter.key}`]: pageFilter.value,
          siteCode: { $in: finalSiteIds },
          isVerified,
        }
      : { [`${pageFilter.key}`]: pageFilter.value, isVerified };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/employee?filter=${serializedData}&page=${offset}&limit=${pageSize}`;
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

export const fetchEmployeeDetailsDataWithField = async (pageFilter) => {
  const filter = { [`${pageFilter.key}`]: pageFilter.value };
  const serializedData = JSON.stringify(filter);
  const url = `/api/v1/employee?filter=${serializedData}`;
  try {
    const response = await axios.get(url);
    const results = get(response, 'data.data', []) || [];

    const data = {
      results: results,
      count: results.length,
    };
    return data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

export const removeEmployee = async (employeeId, status) => {
  let url = `/api/v1/employee/remove/${employeeId}/${status}`;
  try {
    const response = await axios.get(url);
    return response;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};
