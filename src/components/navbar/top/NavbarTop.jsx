/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav } from 'react-bootstrap';
import classNames from 'classnames';
import AppContext from 'context/Context';
import Logo from 'components/common/Logo';
import NavbarTopDropDownMenus from './NavbarTopDropDownMenus';
import { navbarBreakPoint, topNavbarBreakpoint } from 'config/Config';
import TopNavRightSideNavItem from './TopNavRightSideNavItem';
import { useLocation } from 'react-router-dom';
import {
  // superAdminRoutes,
  // adminRoutes,
  // hrRoutes,
  // accountManagerRoutes,
  // accountAssistantRoutes,
  // crmRoutes,
  // crmAssistantRoutes,
  // gmOpsRoutes,
  // fmRoutes,
  // storeRoutes,
  // viprasMartRoutes,
  personalRoute,
  impressHolderRoutes,
  authorizedOfficerRoutes,
} from 'routes/routes';
import { getAcessMenuByRole } from 'api/accessmenu';
const NavbarTop = ({ role, access = [] }) => {
  // access = []
  const {
    config: { showBurgerMenu, navbarPosition, navbarCollapsed },
    setConfig,
  } = useContext(AppContext);

  const { pathname } = useLocation();
  const isChat = pathname.includes('chat');

  const [showDropShadow, setShowDropShadow] = useState(false);

  const [menuState, setMenuState] = useState([]);

  const getAccess = async (token) => {
    try {
      const response = await getAcessMenuByRole(token, role);
      const menuData = response.data.data.menu;
      setMenuState(menuData);
    } catch (error) {
      console.error('Error fetching access menu:', error);
      throw error;
    }
  };

  useEffect(() => {
    getAccess();
  }, [role]);

  const handleBurgerMenu = () => {
    (navbarPosition === 'top' || navbarPosition === 'double-top') &&
      setConfig('navbarCollapsed', !navbarCollapsed);
    (navbarPosition === 'vertical' || navbarPosition === 'combo') &&
      setConfig('showBurgerMenu', !showBurgerMenu);
  };

  const setDropShadow = () => {
    const el = document.documentElement;
    if (el.scrollTop > 0) {
      setShowDropShadow(true);
    } else {
      setShowDropShadow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', setDropShadow);
    return () => window.removeEventListener('scroll', setDropShadow);
  }, []);

  const burgerMenuRef = useRef();

  const hasImpressHolder = access.includes('IMPREST_HOLDER');

  const hasAuthorizedOfficer = access.includes('AUTH_OFFICERS');

  // let roleRoutes = superAdminRoutes;
  // if (role === 'ADMIN') {
  //   roleRoutes = adminRoutes;
  // }
  // if (role === 'FM') {
  //   roleRoutes = fmRoutes;
  // }
  // if (role === 'STORE_INCHARGE') {
  //   roleRoutes = storeRoutes;
  // }
  // if (role === 'ACCOUNTS_MANAGER') {
  //   roleRoutes = accountManagerRoutes;
  // }
  // if (role === 'ACCOUNTS_ASSISTANT') {
  //   roleRoutes = accountAssistantRoutes;
  // }
  // if (role === 'HR') {
  //   roleRoutes = hrRoutes;
  // }
  // if (role === 'VIPRAS_MART') {
  //   roleRoutes = viprasMartRoutes;
  // }
  // if (role === 'BDM' || role === 'CRM') {
  //   roleRoutes = crmRoutes;
  // }
  // if (role === 'CRM_ASSISTANT') {
  //   roleRoutes = crmAssistantRoutes;
  // }
  // if (role === 'GM' || role === 'OPS') {
  //   roleRoutes = gmOpsRoutes;
  // }

  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    const isPersonalRouteExists = menuState.find(
      (item) => item.label === 'My Activity',
    );
    if (!isPersonalRouteExists) {
      let yourTransaction = personalRoute;
      if (hasImpressHolder) {
        const isTransactionExists = yourTransaction[0].children.find(
          (item) => item.name === 'Add Transaction',
        );
        if (!isTransactionExists) {
          yourTransaction[0].children.push(...impressHolderRoutes);
        }
      }
      if (hasAuthorizedOfficer) {
        const yourAttenance = yourTransaction[0].children.find(
          (item) => item.name === 'Your Manual Attendance Report',
        );
        if (!yourAttenance) {
          yourTransaction[0].children.push(...authorizedOfficerRoutes);
        }
      }
      menuState.unshift(...yourTransaction);
    }
  }

  return (
    <Navbar
      className={classNames('navbar-glass fs--1 navbar-top sticky-kit', {
        // 'navbar-glass-shadow': showDropShadow
        'navbar-glass-shadow': showDropShadow && !isChat,
      })}
      expand={
        navbarPosition === 'top' ||
        navbarPosition === 'combo' ||
        navbarPosition === 'double-top'
          ? topNavbarBreakpoint
          : true
      }
    >
      <NavbarTopElements
        navbarCollapsed={navbarCollapsed}
        navbarPosition={navbarPosition}
        handleBurgerMenu={handleBurgerMenu}
        burgerMenuRef={burgerMenuRef}
        menuState={menuState}
      />
    </Navbar>
  );
};

const NavbarTopElements = ({
  navbarPosition,
  handleBurgerMenu,
  navbarCollapsed,
  menuState,
}) => {
  const burgerMenuRef = useRef();
  return (
    <>
      <Navbar.Toggle
        ref={burgerMenuRef}
        className={classNames('toggle-icon-wrapper me-md-3 me-2', {
          'd-lg-none':
            navbarPosition === 'top' || navbarPosition === 'double-top',
          [`d-${navbarBreakPoint}-none`]:
            navbarPosition === 'vertical' || navbarPosition === 'combo',
        })}
        as="div"
      >
        <button
          className="navbar-toggler-humburger-icon btn btn-link d-flex flex-center"
          onClick={handleBurgerMenu}
          id="burgerMenu"
        >
          <span className="navbar-toggle-icon">
            <span className="toggle-line" />
          </span>
        </button>
      </Navbar.Toggle>

      <Logo at="navbar-top" width={75} id="topLogo" />

      <Navbar.Collapse in={navbarCollapsed} className="scrollbar pb-3 pb-lg-0">
        <Nav navbar>
          <NavbarTopDropDownMenus roleRoutes={menuState} />
        </Nav>
      </Navbar.Collapse>
      <TopNavRightSideNavItem />
    </>
  );
};

NavbarTopElements.propTypes = {
  navbarPosition: PropTypes.string,
  handleBurgerMenu: PropTypes.func,
  navbarCollapsed: PropTypes.bool,
  role: PropTypes.string,
};
export default NavbarTop;
