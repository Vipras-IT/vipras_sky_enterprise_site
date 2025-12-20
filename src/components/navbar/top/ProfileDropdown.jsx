import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import avatarImg from 'assets/avatar.png';
import Avatar from 'components/common/Avatar';
import { useAuth } from 'hooks/useAuth';
import { get } from 'lodash';

const ProfileDropdown = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const profile = window.localStorage.getItem('user');
  const profileInfo = profile ? JSON.parse(profile) : {};

  return (
    <Dropdown navbar={true} as="li">
      <Dropdown.Toggle
        bsPrefix="toggle"
        as={Link}
        to="#!"
        className="pe-0 ps-2 nav-link"
      >
        <Avatar src={avatarImg} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-caret dropdown-menu-card  dropdown-menu-end">
        <div className="bg-white rounded-2 py-2 dark__bg-1000">
          <Dropdown.Item href="#!">
            {get(profileInfo, 'fullName', '')}
          </Dropdown.Item>
          <Dropdown.Item href="#!">
            {get(profileInfo, 'employeeId', '')}
          </Dropdown.Item>
          <Dropdown.Item href="#!">
            {get(profileInfo, 'designation', '')}
          </Dropdown.Item>
          <Dropdown.Item href="#!">
            {get(profileInfo, 'role', '')}
          </Dropdown.Item>
          <Dropdown.Item href="#!">
            {get(profileInfo, 'unitCodes[0]', '')}
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
