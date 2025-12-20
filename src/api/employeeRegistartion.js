import axios from './api';

const addEmployee = (data) => axios.post(`/api/v1/employee`, data);

const updateEmployee = (data) =>
  axios.post(`/api/v1/employee/${data.id}`, data);

export default {
  addEmployee,
  updateEmployee,
};
