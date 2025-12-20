import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = user?.token || '';

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    if (response.data.message === 'jwt expired') {
      console.warn('Token expired, redirecting to login page...');
      localStorage.removeItem('user');
      localStorage.removeItem('siteIds');
      localStorage.removeItem('role');
      // navigate('/', { replace: true });
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data.message === 'jwt expired') {
      console.warn('Token expired, redirecting to login page...');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  },
);
export default axios;
