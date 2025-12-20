import api from './api';

export const getCompareAgreedActual = (month, year) => {
  return api.get(`/api/v1/site/AllSiteComparison/${month}/${year}`);
};
