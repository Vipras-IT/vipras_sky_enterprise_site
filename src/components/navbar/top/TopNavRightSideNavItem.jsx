import ProfileDropdown from 'components/navbar/top/ProfileDropdown';

import { Nav } from 'react-bootstrap';

const TopNavRightSideNavItem = () => {
  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto flex-row align-items-center"
      as="ul"
    >
      <ProfileDropdown />
    </Nav>
  );
};

export default TopNavRightSideNavItem;
