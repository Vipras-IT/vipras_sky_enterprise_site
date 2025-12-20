import { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
// import { configureAxios } from '../helpers/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (user) {
  //     configureAxios();
  //   }
  // }, [user]);

  const login = async (data) => {
    setUser(data);
    // navigate('/dashboard/profile', { replace: true });
  };

  const logout = () => {
    setUser(null);
    // navigate('/', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = { children: PropTypes.node };

export const useAuth = () => {
  return useContext(AuthContext);
};
