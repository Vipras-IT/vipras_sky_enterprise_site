import axios from './api';

const updateShiftSchedule = (id, data) =>
  axios.post(`/api/v1/shift/${id}`, data);

const getShiftSchedule = (siteId, month, year) => {
  return axios.get(`/api/v1/shift/by/${siteId}/${month}/${year}`);
};

export default {
  getShiftSchedule,
  updateShiftSchedule,
};
