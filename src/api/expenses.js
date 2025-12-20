import axios from './api';

const postExpenses = (data) => axios.post(`/api/v1/expenses`, data);

const getAllExpenses = () => {
  return axios.get(`/api/v1/expenses/allexpenses`);
};

const getByImpressHolderDropDown = () => {
  return axios.get(`/api/v1/users/list/allUserDropdown/impressHolder`);
};

export default {
  postExpenses,
  getAllExpenses,
  getByImpressHolderDropDown,
};
