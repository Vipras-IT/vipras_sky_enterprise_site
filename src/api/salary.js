import axios from './api';

const getSalaryBySitecode = async (
  siteId,
  month,
  year,
  status = '',
  searchType = '',
  searchKeyword = '',
) => {
  // Base URL construction
  let url = `/api/v1/salary/${siteId}/${month}/${year}`;

  // Initialize the filter object
  const filter = {};

  // Add status filter if available
  if (status) {
    filter.status = status;
  }

  // Add name and nameBydata filters if available
  if (searchType && searchKeyword) {
    filter[searchType] = searchKeyword;
  }

  // Append filter to the URL if any filter is applied
  if (Object.keys(filter).length > 0) {
    const serializedFilter = JSON.stringify(filter);
    url += `?filter=${serializedFilter}`;
  }

  try {
    const response = await axios.get(url);

    return response;
  } catch (error) {
    throw new Error(
      `API error: ${
        error?.response?.data?.message || error?.message || 'Unknown error'
      }`,
    );
  }
};

const getClubedSalaryBySitecode = async (month, year) => {
  const filter = { isMultiSite: true };
  const serializedData = JSON.stringify(filter);
  let url = `/api/v1/salary/ALL/${month}/${year}?filter=${serializedData}`;
  try {
    return await axios.get(url);
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const getInactiveSalaryBySitecode = async (
  siteId,
  month,
  year,
  salaryPaid,
  salaryNotPaid,
  searchType,
  searchKeyword,
) => {
  let url = `/api/v1/salary/inactive/${siteId}/${month}/${year}`;

  const filter = {};

  if (salaryPaid) {
    filter.isSalaryPaid = salaryPaid;
  } else if (salaryNotPaid === 'false') {
    filter.isSalaryPaid = 'false';
  }

  if (searchType && searchKeyword) {
    filter[searchType] = searchKeyword;
  }

  if (Object.keys(filter).length > 0) {
    const serializedFilter = JSON.stringify(filter);
    url += `?filter=${serializedFilter}`;
  }

  // if (salaryPaid) {
  //   console.log('salaryPaid ');
  //   const filter = { isSalaryPaid: salaryPaid };
  //   const serializedData = JSON.stringify(filter);
  //   url = `/api/v1/salary/inactive/${siteId}/${month}/${year}?filter=${serializedData}`;
  // } else if (salaryNotPaid === 'false') {
  //   const filter = { isSalaryPaid: 'false' };
  //   const serializedData = JSON.stringify(filter);
  //   url = `/api/v1/salary/inactive/${siteId}/${month}/${year}?filter=${serializedData}`;
  // } else {
  //   url = `/api/v1/salary/inactive/${siteId}/${month}/${year}`;
  // }

  try {
    return await axios.get(url);
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

const getSalaryByEmployee = (employeeId, month, year) => {
  return axios.get(`/api/v1/salary/byEmployee/${employeeId}/${month}/${year}`);
};

const generateSalaryReportBySiteId = (siteId, month, year) => {
  return axios.get(
    `/api/v1/salary/generateSalaryReport/${siteId}/${month}/${year}`,
  );
};

const generateInvoiceReportBySiteId = (siteId, month, year) => {
  return axios.get(`/api/v1/invoice/create/${siteId}/${month}/${year}`);
};

const generateSitePLReportBySiteId = (siteId, month, year) => {
  return axios.get(
    `/api/v1/profit/lose/generateProfitLoseReport/${siteId}/${month}/${year}`,
  );
};

const updateSalaryReport = (data, status, month) =>
  axios.post(`/api/v1/salary/update/byemployee/${month}/${status}`, data);

export default {
  getSalaryBySitecode,
  getSalaryByEmployee,
  generateSalaryReportBySiteId,
  generateInvoiceReportBySiteId,
  getInactiveSalaryBySitecode,
  updateSalaryReport,
  getClubedSalaryBySitecode,
  generateSitePLReportBySiteId,
};
