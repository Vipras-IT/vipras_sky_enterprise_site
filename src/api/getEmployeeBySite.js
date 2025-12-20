import axios from './api';

const getEmployeeBySite = (siteId) => {
  const filter = { siteCode: siteId, isActive: true };
  const serializedData = JSON.stringify(filter);
  return axios.get(`/api/v1/employee?filter=${serializedData}`);
};
/* const getEmployeeBySitecode = (siteId, month, year, token) => {
  return axios.get(
    `/api/v1/salary/${siteId}/${month}/${year}`,
    {
      headers: {
        'erp-token': token
      }
    }
  );
};
const getEmployeeBySitecodeAndEmployee = (employeeId, month, year, token) => {
  return axios.get(
    `/api/v1/salary/byEmployee/${employeeId}/${month}/${year}`,
    {
      headers: {
        'erp-token': token
      }
    }
  );
}; */

const getOtherDeductions = (employeeIDNumber, month, year) => {
  return axios.get(
    `/api/v1/otherdeduction/byMonthReport/${employeeIDNumber}/${month}/${year}`,
  );
};

export default {
  getEmployeeBySite,
  // getEmployeeBySitecode,
  // getEmployeeBySitecodeAndEmployee,
  getOtherDeductions,
};
