/* eslint-disable react/prop-types */
import { useContext } from 'react';
import NavbarDropdown from './NavbarDropdown';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from 'context/Context';

const NavbarTopDropDownMenus = ({ roleRoutes }) => {
  const {
    config: { navbarCollapsed, showBurgerMenu },
    setConfig,
  } = useContext(AppContext);

  const handleDropdownItemClick = () => {
    if (navbarCollapsed) {
      setConfig('navbarCollapsed', !navbarCollapsed);
    }
    if (showBurgerMenu) {
      setConfig('showBurgerMenu', !showBurgerMenu);
    }
  };
  return (
    <>
      {roleRoutes.map(
        (item, index) =>
          item.children.some((child) => child.isSelected === true) && (
            <NavbarDropdown key={index} title={item.label}>
              {item.children
                .filter((child) => child.isSelected === true)
                .map((child, childIndex) => (
                  <Dropdown.Item
                    key={childIndex}
                    as={Link}
                    className={
                      child.isSelected === true ? 'link-600' : 'text-500'
                    }
                    target={child.to.startsWith('http') ? '_blank' : undefined}
                    to={child.to}
                    rel={
                      child.to.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    onClick={handleDropdownItemClick}
                  >
                    {child.name}
                  </Dropdown.Item>
                ))}
            </NavbarDropdown>
          ),
      )}
    </>
  );
};

export default NavbarTopDropDownMenus;
