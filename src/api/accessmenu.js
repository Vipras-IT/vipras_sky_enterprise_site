// import axios from 'axios';
import api from './api';

export const getAcessMenu = (token, role) => {
  return api.get(`/api/v1/access?filter={ "role": "${role}"}`);
};

export const getAcessMenuByRole = (token, role) => {
  return api.get(`/api/v1/access/verified/${role}`, {});
};

export const updateAccessMenu = (data, token) => {
  const idToUpdate = data?.id;
  const url = `/api/v1/access/${idToUpdate}`;
  return api.put(url, data, { headers: { 'erp-token': token } });
};
