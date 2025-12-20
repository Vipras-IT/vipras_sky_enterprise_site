import axios from './api';

const updateShiftSchedule = (id, data) =>
  axios.post(`/api/v1/siteshift/${id}`, data);

const getShiftSchedule = (siteId, month, year) => {
  return axios.get(`/api/v1/siteshift/by/${siteId}/${month}/${year}`);
};

export default {
  getShiftSchedule,
  updateShiftSchedule,
};
