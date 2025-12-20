import axios from './api';
import { monthNames } from 'helpers/utils';
import { get } from 'lodash';

const AddImprestHolderTransaction = (data) =>
  axios.post(`/api/v1/impresttransaction`, data);

const getSubTransdetails = (subId) => {
  return axios.get(`/api/v1/impresttransaction/${subId}`);
};

const updateSubTransdetails = (data) =>
  axios.post(`/api/v1/impresttransaction/${data.id}`, data);

const getImprestHolderTransaction = (id, month, year) => {
  return axios.get(
    `/api/v1/impresttransaction/report/${id}/${month + 1}/${year}`,
  );
};

export const deleteImprestHolderTransaction = (id) => {
  return axios.delete(`/api/v1/impresttransaction/${id}`);
};

const getImprestHolderAttendance = (id, month, year) => {
  return axios.get(
    `/api/v1/employee-attendace/byEmployee/report/${id}/${month}/${year}`,
  );
};

const getSiteExpenses = (month, year) => {
  return axios.get(`/api/v1/impresttransaction/site/report/${month}/${year}`);
};

const getSiteProfitLose = (month, year, searchType, searchKeyword) => {
  const filter = {
    month: `${month}-${year}`,
  };
  if (searchType && searchKeyword) {
    filter[searchType] = searchKeyword;
  }
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/profit/lose?filter=${serializedData}`);
};

const getImprestExpenses = (month, year) => {
  return axios.get(
    `/api/v1/impresttransaction/imprest/report/${month}/${year}`,
  );
};

const getImprestHolder = (filter) => {
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/impresttransaction?filter=${serializedData}`);
};
const getEmployeeVerification = () => {
  const filter = { isVerified: false };
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/employee?filter=${serializedData}`);
};

const getTicketReport = (employeeId) => {
  return axios.get(`/api/v1/CRM/getTicketInfo/${employeeId}/3/2024`);
};

const fetchOtherDeductuionData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let defaultFilter = {
    from: null,
    to: null,
  };

  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/impresttransaction?filter=${serializedData}&page=${offset}&limit=${pageSize}`;
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
    url = `/api/v1/impresttransaction?filter=${serializedData}`;
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

const fetchImprestHolderData = async (page, pageSize, pageFilter, id) => {
  const offset = page + 1;
  // const defaultFilter = { imprestholderId: id };

  let defaultFilter = {
    $or: [
      { isVerified: 'APPROVED' },
      { isVerified: 'REJECTED' },
      { isVerified: 'PENDING' },
    ],
    imprestholderId: id,
    from: null,
    to: null,
  };

  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/impresttransaction?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

  if (
    (pageFilter.from && pageFilter.from !== null) ||
    (pageFilter.to && pageFilter.to !== null) ||
    pageFilter.value.trim().length > 1
  ) {
    let filters = {
      from: pageFilter.from,
      to: pageFilter.to,
    };
    if (pageFilter.value.trim().length > 1) {
      let filter = { ...filters, [`${pageFilter.key}`]: pageFilter.value };
      console.log(filter, 'filter');
      filter = {
        ...filter,
        $or: [
          { isVerified: 'APPROVED' },
          { isVerified: 'REJECTED' },
          { isVerified: 'PENDING' },
        ],
        imprestholderId: id,
      };
      const serializedData = JSON.stringify(filter);
      url = `/api/v1/impresttransaction?filter=${serializedData}`;
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
const fetchPendingImprestHolderData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  const defaultFilter = { isVerified: 'PENDING', from: null, to: null };
  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/impresttransaction?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

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
    filter = { ...filter, isVerified: 'PENDING' };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/impresttransaction?filter=${serializedData}`;
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

const fetchAccountsData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  const defaultFilter = { createType: 'ACCOUNTS', from: null, to: null };
  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/impresttransaction?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

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
    filter = { ...filter, createType: 'ACCOUNTS' };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/impresttransaction?filter=${serializedData}`;
  }

  if (pageFilter.key === 'credit' || pageFilter.key === 'debit') {
    let filter = { [`${pageFilter.key}`]: 0 };
    filter = {
      ...filter,
      createType: 'ACCOUNTS',
      from: pageFilter.from,
      to: pageFilter.to,
    };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/impresttransaction?filter=${serializedData}`;
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

const fetchAccountsDetails = async (
  status,
  month,
  year,
  searchType,
  searchKeyword,
) => {
  const monthNameObj = monthNames.find((m) => m.value === month - 1);
  const defaultFilter = {
    createType: 'ACCOUNTS',
    from: null,
    to: null,
    month: `${monthNameObj?.label}-${year}`,
  };
  if (status) {
    defaultFilter.status = status;
  }
  if (searchType && searchKeyword) {
    defaultFilter[searchType] = searchKeyword;
  }
  const serializedData = JSON.stringify(defaultFilter);

  let url = `/api/v1/impresttransaction/accounts/list?filter=${serializedData}`;
  // console.log(status);
  // if (status === 'PAID') {
  //   const filter = {
  //     createType: 'ACCOUNTS',
  //     from: null,
  //     to: null,
  //     status: 'PAID'
  //   };
  //   const serializedData = JSON.stringify(filter);
  //   url = `/api/v1/impresttransaction?filter=${serializedData}`;
  // } else if (status === 'NOT_PAID') {
  //   const filter = {
  //     createType: 'ACCOUNTS',
  //     from: null,
  //     to: null,
  //     status: 'NOT_PAID'
  //   };
  //   const serializedData = JSON.stringify(filter);
  //   url = `/api/v1/impresttransaction?filter=${serializedData}`;
  // } else if (status === 'HOLD') {
  //   const filter = { status: 'HOLD' };
  //   const serializedData = JSON.stringify(filter);
  //   url = `/api/v1/impresttransaction?filter=${serializedData}`;
  // } else {
  //   url = `/api/v1/impresttransaction?filter=${serializedData}`;
  // }

  try {
    return await axios.get(url);
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const updateAccountsDetails = (data, status) =>
  axios.post(`/api/v1/impresttransaction/update/byids/${status}`, data);

export default {
  AddImprestHolderTransaction,
  fetchOtherDeductuionData,
  fetchImprestHolderData,
  getImprestHolderTransaction,
  getImprestHolder,
  fetchAccountsData,
  getImprestHolderAttendance,
  getTicketReport,
  getSubTransdetails,
  updateSubTransdetails,
  fetchAccountsDetails,
  getEmployeeVerification,
  updateAccountsDetails,
  fetchPendingImprestHolderData,
  getSiteExpenses,
  getImprestExpenses,
  getSiteProfitLose,
};
