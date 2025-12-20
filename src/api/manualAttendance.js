import axios from './api';
import { get } from 'lodash';

// Get all the Stocks Details from the API
const getManualattendancedetails = () => {
  return axios.get(`/api/v1/manualAttendace`);
};

const getManualattendancedetailsUnitcode = (formattedDate, currentSiteId) => {
  const filters = {
    siteId: currentSiteId,
    month: formattedDate,
  };
  const queryString = JSON.stringify(filters);
  if (typeof queryString === 'string') {
    const trimmedValue = queryString.trim();
    return axios.get(`/api/v1/manualAttendace?filter=${trimmedValue}`);
  }
};

const getAttendanceByEmployee = (todayYears, todayMonth, siteIdss, days) => {
  return axios.get(
    `/api/v1/employee-attendace/bySiteAttendance/${days}/${siteIdss}/${todayMonth}/${todayYears}`,
  );
};


const fetchManualattendanceData = async (
  page,
  pageSize,
  pageFilter,
  todayYears,
  todayMonth
) => {
  const offset = page + 1;
  const baseMonth = `${todayMonth}-${todayYears}`;
  let filter = { month: baseMonth };
  const value = pageFilter?.value;
  const key = pageFilter?.key;

    if (value) {
    if (typeof value === 'string' || typeof value === 'number') {
      const trimmedValue = value?.toString().trim();
      if (trimmedValue) {
        filter[key] = trimmedValue;
      }
    } else if (typeof value === 'object') {
      if (value.employeeNumber) {
        filter[key] = value.employeeNumber;
      }
      
       if (value.from && value.to) {
        filter.from = value.from;
        filter.to = value.to;
      }
    }
  }

 
  if (pageFilter?.from && pageFilter?.to) {
    filter.from = pageFilter.from;
    filter.to = pageFilter.to;
  }

  const serializedFilter = encodeURIComponent(JSON.stringify(filter));
  const url = `/api/v1/manualAttendace?page=${offset}&limit=${pageSize}&filter=${serializedFilter}`;
  try {
    const response = await axios.get(url);
    const items = get(response, 'data.data.items', []);
    const hasError = get(response, 'data.success');
    const count = get(response, 'data.data.totalItems');

    return {
      results: items,
      count,
      hasError,
    };
  } catch (e) {
    throw new Error(`API error: ${e?.message}`);
  }
};


// const fetchManualattendanceData = async (
//   page,
//   pageSize,
//   pageFilter,
//   // month,
//   todayYears,
//   todayMonth,
// ) => {
//   const offset = page + 1;
//   const monthFilter = { month: `${todayMonth}-${todayYears}` };
//   const serializedData = JSON.stringify(monthFilter);
//   let url = `/api/v1/manualAttendace?page=${offset}&limit=${pageSize}&filter=${serializedData}`;

//   if (
//     typeof pageFilter.value === 'string' ||
//     typeof pageFilter.value === 'number'
//   ) {
//     const filterValue = pageFilter.value ? pageFilter.value.trim() : '';
//     if (filterValue) {
//       const filter = {
//         [`${pageFilter.key}`]: filterValue,
//         month: `${todayMonth}-${todayYears}`,
//       };
//       const serializedData = JSON.stringify(filter);
//       url = `/api/v1/manualAttendace?filter=${serializedData}`;
//     }
//   } else if (
//     typeof pageFilter.value === 'object' &&
//     'employeeNumber' in pageFilter.value
//   ) {
//     if (pageFilter.value.employeeNumber) {
//       const filter = {
//         [`${pageFilter.key}`]: pageFilter.value.employeeNumber,
//         month: `${todayMonth}-${todayYears}`,
//       };
//       const serializedData = JSON.stringify(filter);
//       url = `/api/v1/manualAttendace?filter=${serializedData}`;
//     }
//   }
//   if (
//     (pageFilter.from && pageFilter.from !== null) ||
//     (pageFilter.to && pageFilter.to !== null) ||
//     pageFilter.value.trim().length > 1
//   ) {
//     let filter = {
//       from: pageFilter.from,
//       to: pageFilter.to,
//     };
//     if (pageFilter.value.trim().length > 1) {
//       filter = { ...filter, [`${pageFilter.key}`]: pageFilter.value };
//     }
//   }
//   try {
//     const response = await axios.get(url);
//     const results = get(response, 'data.data.items', []) || [];

//     const hasError = get(response, 'data.success');

//     const data = {
//       results: results,
//       count: get(response, 'data.data.totalItems'),
//       hasError,
//     };
//     return data;
//   } catch (e) {
//     throw new Error(`API error:${e?.message}`);
//   }
// };

const bulkfetchManualattendanceData = async (
  page,
  pageSize,
  pageFilter,
  // month,
  todayYears,
  todayMonth,
) => {
  const offset = page + 1;

  const defaultFilter = {
    isBulkDuty: true,
    month: `${todayMonth}-${todayYears}`,
  };

  // const monthFilter = { month: `${todayMonth}-${todayYears}` };
  const serializedData = JSON.stringify(defaultFilter);
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
        isBulkDuty: true,
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
        isBulkDuty: true,
      };
      const serializedData = JSON.stringify(filter);
      url = `/api/v1/manualAttendace?filter=${serializedData}`;
    }
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

const fetchYourManualattendanceData = async (
  page,
  pageSize,
  pageFilter,
  id,
  todayYears,
  todayMonth,
) => {
  const offset = page + 1;
  const defaultFilter = {
    operationManagerId: id,
    month: `${todayMonth}-${todayYears}`,
  };
  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/manualAttendace?filter=${serializedData}&page=${offset}&limit=${pageSize}`;
 
  if (
    (typeof pageFilter.value === 'string' ||
      typeof pageFilter.value === 'number') &&
    String(pageFilter.value).trim().length > 0
  ) {
    let filter = {
      [`${pageFilter.key}`]: pageFilter.value,
      month: `${todayMonth}-${todayYears}`,
    };
    filter = { ...filter, operationManagerId: id };
    const serializedData = JSON.stringify(filter);

    url = `/api/v1/manualAttendace?filter=${serializedData}`;
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

  // if (!pageFilter.value.trim().length > 1) {
  //   let filter = { [`${pageFilter.key}`]: pageFilter.value };
  //   filter = { ...filter, operationManagerId: id };
  //   console.log(filter);
  //   const serializedData = JSON.stringify(filter);
  //   console.log(serializedData);
  //   url = `/api/v1/manualAttendace?filter=${serializedData}`;
  // }

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
  getManualattendancedetails,
  fetchManualattendanceData,
  fetchYourManualattendanceData,
  getManualattendancedetailsUnitcode,
  bulkfetchManualattendanceData,
  getAttendanceByEmployee,
};
