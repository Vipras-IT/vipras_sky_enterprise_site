// AxiosInterceptor.js
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import api from './api';

const AxiosInterceptor = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        if (response.data.message === 'jwt expired') {
          navigate('/login', { replace: true });
          console.warn('Token expired, redirecting to login page...');
          localStorage.removeItem('user');
          localStorage.removeItem('siteIds');
          localStorage.removeItem('role');
        }
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('user');
          navigate('/login');
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return children;
};

export default AxiosInterceptor;
