import { useEffect, useState } from 'react';
import { ProfileList } from './MenuList';
import { Button } from 'react-bootstrap';
import { Select } from 'antd';
import { getAcessMenuByRole, updateAccessMenu } from '../../../api/accessmenu';
import { toast } from 'react-toastify';
export default function AccessMenu() {
  const [menuState, setMenuState] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState();

  useEffect(() => {
    const initialProfile = ProfileList.find(
      (profile) => profile.name === 'SUPER_ADMIN',
    );
    if (initialProfile) {
      setSelectedProfile(initialProfile.name);
    }
  }, []);

  const getAccess = async (token) => {
    try {
      if (!selectedProfile) return;
      const response = await getAcessMenuByRole(token, selectedProfile);
      const menuData = response.data.data;
      setMenuState(menuData);
    } catch (error) {
      console.error('Error fetching access menu:', error);
      throw error;
    }
  };

  useEffect(() => {
    getAccess();
  }, [selectedProfile]);

  const handleButtonClick = (label, childName, isYes) => {
    setMenuState((prevState) => ({
      ...prevState,
      menu: prevState.menu.map((item) => {
        if (item.label === label) {
          return {
            ...item,
            children: item.children.map((child) => {
              if (child.name === childName) {
                return { ...child, isSelected: isYes };
              }
              return child;
            }),
          };
        }
        return item;
      }),
    }));
  };

  const handleClick = async (token) => {
    try {
      const updatedMenuState = {
        menu: menuState.menu,
        role: menuState.role,
        id: menuState.id,
      };
      await updateAccessMenu(updatedMenuState, token);
      toast.success('Access menu updated successfully');
    } catch (error) {
      console.error('Error updating access menu:', error);
      toast.error('Access menu updation failed');
    }
  };

  const handleProfileSelection = (profileName) => {
    setSelectedProfile(profileName);
  };

  return (
    <div className="d-flex align-items-start flex-wrap bg-white gap-2 justify-content-center p-4">
      <div>
        <Select
          className="m-1"
          placeholder="Select Profile"
          value={selectedProfile}
          onChange={handleProfileSelection}
          options={ProfileList.map((profile) => ({
            value: profile.name,
            label: profile.name,
          }))}
          style={{ width: 200 }}
        />
      </div>
      <div
        className="d-flex flex-column align-items-start justify-content-start p-2 shadow w-100"
        style={{
          overflowY: 'scroll',
          backgroundColor: '#fffffb',
        }}
      >
        <table>
          <tbody className="d-flex flex-wrap gap-3">
            {menuState?.menu?.map((item, index) => (
              <div key={index}>
                <tr>
                  <td
                    className="font-semibold text-black py-2 fw-bold "
                    style={{ fontSize: '1.1rem' }}
                  >
                    {item.label}
                  </td>
                </tr>
                {item.children.map((child, childIndex) => (
                  <tr key={childIndex} className="">
                    <td className=" p-1">{child.name}</td>
                    <td className="p-1">
                      <div className="d-flex align-items-center">
                        <Button
                          variant={
                            child.isSelected === true
                              ? 'success'
                              : 'outline-success'
                          }
                          size="sm"
                          onClick={() =>
                            handleButtonClick(item.label, child.name, true)
                          }
                          className="me-2"
                        >
                          Yes
                        </Button>
                        <Button
                          variant={
                            child.isSelected === false
                              ? 'danger'
                              : 'outline-danger'
                          }
                          size="sm"
                          onClick={() =>
                            handleButtonClick(item.label, child.name, false)
                          }
                        >
                          No
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </div>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center align-items-center my-2 w-100">
          <Button
            style={{ backgroundColor: '#0039a6', border: 'none' }}
            onClick={handleClick}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
