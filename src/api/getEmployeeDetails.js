import api from './api';

const getEmployeeDetails = (employeeId) => {
  return api.get(`/api/v1/employee/${employeeId}`);
};

const getEmployeeDetailsById = (employeeId) => {
  return api.get(`/api/v1/employee/employeeNumber/${employeeId}`);
};

const removeEmployee = (employeeId, status) => {
  return api.get(`/api/v1/employee/remove/${employeeId}/${status}`);
};
const VerifiedEmployee = (employeeId, status) => {
  return api.get(`/api/v1/employee/verified/${employeeId}/${status}`);
};

const getEmployeeByEmployeeNumber = (employeeNumber) => {
  const filter = { employeeNumber: employeeNumber, isActive: true };
  const serializedData = JSON.stringify(filter);
  return api.get(`/api/v1/employee?filter=${serializedData}`);
};

export default {
  getEmployeeDetails,
  removeEmployee,
  getEmployeeByEmployeeNumber,
  getEmployeeDetailsById,
  VerifiedEmployee,
};
