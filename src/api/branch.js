import axios from './api';

export const addBranch = (data) => axios.post(`/api/v1/branch`, data);

export const getBranchDetails = () => {
  return axios.get(`/api/v1/branch`);
};
