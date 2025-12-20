import authApiClient from './AuthClient';

const getUser = (data) => authApiClient.post('/api/v1/users/login', data);

export default {
  getUser,
};
