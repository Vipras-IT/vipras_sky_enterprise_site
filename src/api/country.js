import api from './api';
const getCountries = () => {
  const url = '/positions';
  alert(url);
  return api.get(url);
};

const getStates = async (country) => {
  const url = `states/q?country=${country}`;
  return await api.get(url);
};

const getCities = async (country, state) => {
  const url = `state/cities/q?country=${country}&state=${state}`;
  return await api.get(url);
};

export default {
  getCountries,
  getCities,
  getStates,
};
