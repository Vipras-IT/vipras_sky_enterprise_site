import axios from './api';
import { monthNames } from 'helpers/utils';
import { get, trim } from 'lodash';

const getInvoicedetails = () => {
  return axios.get(`/api/v1/invoice/UC110/January-2024`);
};
const addInvoice = (data) => axios.post(`/api/v1/invoice`, data);

const updateInvoice = (data) => axios.post(`/api/v1/invoice/${data.id}`, data);

const getByIdInvoicedetails = (id) => {
  return axios.get(`/api/v1/invoice/${id}`);
};

const getInvoice = () => {
  return axios.get(`/api/v1/invoice`);
};

const InvoiceReportBySiteId = (month, searchType, searchKeyword) => {
  const filter = {
    month: month,
    isGstInvoice: true,
  };
  if (searchType && searchKeyword) {
    filter[searchType] = searchKeyword;
  }
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/invoice?filter=${serializedData}`);
};

const SubContracterInvoiceReportBySiteId = (
  month,
  searchType,
  searchKeyword,
) => {
  const filter = {
    month: month,
    isGstInvoice: false,
  };
  if (searchType && searchKeyword) {
    filter[searchType] = searchKeyword;
  }
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/invoice?filter=${serializedData}`);
};

const fetchInvoicedetails = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/invoice?page=${offset}&limit=${pageSize}`;

  if (trim(pageFilter.key).length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/invoice?filter=${serializedData}`;
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

const getInvoiceMonthly = (siteId, month, year) => {
  return axios.get(`/api/v1/invoice/create/${siteId}/${year}/${month}`);
};

const getProfitLossReport = (month, year) => {
  return axios.get(
    `/api/v1/impresttransaction/profit/loss/report/${month}/${year}`,
  );
};

const getGrossProfitAndLoss = (month, year) => {
  return axios.get(`/api/v1/invoice/profit/loss/${month}/${year}`);
};

const getViprasMartProfitAndLoss = (siteId, month, year) => {
  const monthNameObj = monthNames.find((m) => m.value === month - 1);
  const filter = {
    month: `${monthNameObj?.label}-${year}`,
    siteId: siteId,
  };
  const serializedData = JSON.stringify(filter);

  return axios.get(`/api/v1/profit/lose?filter=${serializedData}`);
};

const getCollectionExpenses = (month, year) => {
  const monthNameObj = monthNames.find((m) => m.value === month - 1);
  const filter = {
    month: `${monthNameObj?.label}-${year}`,
  };
  const serializedData = JSON.stringify(filter);
  return axios.get(
    `/api/v1/impresttransaction/generate/overdraft?filter=${serializedData}`,
  );
};

const getServicesProfitAndLoss = (month, year, departmentServices) => {
  const monthNameObj = monthNames.find((m) => m.value === month - 1);
  const filter = {
    month: `${monthNameObj?.label}-${year}`,
    departmentName: departmentServices,
  };
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/department-report?filter=${serializedData}`);
};

const getAdminProfitAndLoss = (month, year, departmentServices) => {
  return axios.get(
    `/api/v1/profit/lose/department/${month}/${year}/${departmentServices}`,
  );
};

const getOverheadCalculation = (month, year) => {
  return axios.get(`/api/v1/profit/lose/${month}/${year}`);
};

const getGarbageDisposal = (month, year) => {
  return axios.get(`/api/v1/profit/lose/garbage/${month}/${year}`);
};

const getSubSite = (type) => {
  return axios.get(`/api/v1/site/list/allUserDropdown/subContractor/site?type=${type}`);
};

const getHkConsumable = async (currentMonth, currentYear) => {
  let url = `/api/v1/profit/lose/generateProfitLoseReport/${currentMonth}/${currentYear}`;
  try {
    const response = await axios.get(url);
    const results = get(response, 'data.data', []) || [];
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

const fetchInvoiceOutStanding = (
  unitCode,
  month,
  year,
  searchType,
  searchKeyword,
) => {
  const filter = {
    siteId: unitCode,
    month: `${month}-${year}`,
    invoiceType: 'GST',
    isGstInvoice: true,
  };
  if (searchType && searchKeyword) {
    filter[searchType] = searchKeyword;
  }
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/invoice/outstanding?filter=${serializedData}`);
};

const fetchSubContractorInvoiceOutStanding = (
  unitCode,
  month,
  year,
  searchType,
  searchKeyword,
) => {
  const defaultFilter = {
    siteId: unitCode,
    month: `${month}-${year}`,
    invoiceType: 'SUB_CONTRACTOR',
    isGstInvoice: false,
  };
  if (searchType && searchKeyword) {
    defaultFilter[searchType] = searchKeyword;
  }
  const serializedData = JSON.stringify(defaultFilter);
  return axios.get(`/api/v1/invoice/outstanding?filter=${serializedData}`);
};

export default {
  getInvoicedetails,
  fetchInvoicedetails,
  getInvoice,
  getByIdInvoicedetails,
  InvoiceReportBySiteId,
  addInvoice,
  getInvoiceMonthly,
  SubContracterInvoiceReportBySiteId,
  getProfitLossReport,
  updateInvoice,
  getGrossProfitAndLoss,
  fetchInvoiceOutStanding,
  getViprasMartProfitAndLoss,
  getHkConsumable,
  getOverheadCalculation,
  getGarbageDisposal,
  getServicesProfitAndLoss,
  fetchSubContractorInvoiceOutStanding,
  getCollectionExpenses,
  getAdminProfitAndLoss,
  getSubSite,
};
