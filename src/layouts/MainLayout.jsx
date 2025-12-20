/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AppContext from 'context/Context';
import classNames from 'classnames';
import NavbarTop from 'components/navbar/top/NavbarTop';
import Footer from 'components/footer/Footer';
import { useAuth } from 'hooks/useAuth';
import { isEmpty } from 'lodash';

const MainLayout = () => {
  const { hash, pathname } = useLocation();
  const {
    config: { isFluid },
  } = useContext(AppContext);
  const { user } = useAuth();
  if (isEmpty(user)) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    setTimeout(() => {
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }
    }, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={isFluid ? 'container-fluid' : 'container'}>
      <div className={classNames('content')}>
        <NavbarTop role={user.role} access={user.access} />
        {/*------ Main Routes ------*/}
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
