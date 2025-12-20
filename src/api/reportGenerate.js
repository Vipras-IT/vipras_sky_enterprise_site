import axios from './api';

const createReport = (data) => axios.post(`/api/v1/report`, data);

const updatedReport = (id, data) => axios.post(`/api/v1/report/${id}`, data);

const getGeneratedReport = (month, year) => {
  return axios.get(`/api/v1/report/${month}/${year}`);
};

export default {
  createReport,
  updatedReport,
  getGeneratedReport,
};
