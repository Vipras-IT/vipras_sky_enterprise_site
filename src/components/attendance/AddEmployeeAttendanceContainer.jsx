import { useEffect, useState } from 'react';
import AddAttendance from './AddEmployeeAttendance';
import { get, isEmpty } from 'lodash';
import attendanceAPI from 'api/attendance';
import { useAuth } from 'hooks/useAuth';
import { Col, Row, Select, Space } from 'antd';
import { toast } from 'react-toastify';
import { monthNames } from 'helpers/utils';
import moment from 'moment';
import Loading from './Loading';

const AddAttendanceContainer = () => {
  const { user } = useAuth();
  const todayDate = new Date();
  const [attendanceData, setAttendanceData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignRole, setAssignRole] = useState('');

  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  let siteIdsOptions = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      value: siteIdArray[0],
      label: item,
    });
  });

  const userData = JSON.parse(window.localStorage.getItem('user'));
  const userRole = userData.role;// 'EMPLOYEE'
  const loggedEmployeeNumber = userData.employeeId; //user employeeId


  let userSiteIds = get(user, 'unitCodes');
  let userDefaultSiteId = '';
  if (userSiteIds && userSiteIds[0] === 'ALL') {
    userDefaultSiteId = get(siteIdsOptions[0], 'value', '');
  } else if (userSiteIds && userSiteIds.length > 0) {
    siteIdsOptions = siteIdsOptions.filter((item) =>
      userSiteIds.includes(item.value),
    );
    userDefaultSiteId = userSiteIds[0];
  }
  const [currentSiteId, setCurrentSiteId] = useState(userDefaultSiteId);

  useEffect(() => {
    getTodayAttendance();
  }, [currentSiteId]);

  const getTodayAttendance = () => {
    setModalVisible(true);
    const currentMonthName = monthNames[todayDate.getMonth()].label;
    const month = `${currentMonthName}-${todayDate.getFullYear()}`;
    const date = moment().format('YYYY-MM-DD');
    if (userRole === 'EMPLOYEE') { //check role
      attendanceAPI
        .getTodayEmpAttendance(currentSiteId, date, month, loggedEmployeeNumber)
        .then((response) => {
          let todayAttendance = get(response, 'data.data', []);
          if (userRole === 'EMPLOYEE') { //check role
            todayAttendance = todayAttendance.filter(
              (item) =>
                item.employeeNumber === loggedEmployeeNumber
            );
          }
          setAttendanceData(todayAttendance);
          setModalVisible(false);
        })
        .catch(() => {
          toast.error('Get Attendance failed!', {
            theme: 'colored',
          });
          setModalVisible(false);
        });

    } else {
      attendanceAPI
        .getTodayAttendance(currentSiteId, date, month)
        .then((response) => {
          let todayAttendance = get(response, 'data.data', []);
          if (userRole === 'EMPLOYEE') { //check role
            todayAttendance = todayAttendance.filter(
              (item) =>
                item.employeeNumber === loggedEmployeeNumber
            );
          }
          setAttendanceData(todayAttendance);
          setModalVisible(false);
        })
        .catch(() => {
          toast.error('Get Attendance failed!', {
            theme: 'colored',
          });
          setModalVisible(false);
        });
    }
  };

  const handleSubmitAttendance = (attendace) => {
    setModalVisible(true);
    const {
      employeeNumber,
      checkIn,
      checkOut,
      day,
      shift,
      checkoutMonth,
      designation,
      employeeName,
    } = attendace;
    const currentMonthName = monthNames[todayDate.getMonth()].label;
    const month = isEmpty(checkoutMonth)
      ? `${currentMonthName}-${todayDate.getFullYear()}`
      : checkoutMonth;
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      siteId: currentSiteId,
      employeeNumber,
      day,
      checkIn,
      checkOut,
      month,
      shift,
      date: checkIn,
      role: designation,
      employeeName,
      createdBy: Number(userData.employeeId),
    };
    attendanceAPI
      .addTodayAttendance(postData)
      .then((response) => {
        if (get(response, 'data.success')) {
          toast.success('Attendance updated successfully', {
            theme: 'colored',
          });
          getTodayAttendance();
        } else {
          setModalVisible(false);
          toast.error('Attendance updated failed', {
            theme: 'colored',
          });
        }
      })
      .catch(() => {
        setModalVisible(false);
        toast.error('Attendance updated failed', {
          theme: 'colored',
        });
      });
  };

  const handleAddNewEmployee = ({ shift, employeeNumber, employeeName }) => {
    setModalVisible(true);
    const currentMonthName = monthNames[todayDate.getMonth()].label;
    const month = `${currentMonthName}-${todayDate.getFullYear()}`;
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      siteId: currentSiteId,
      employeeNumber,
      day: todayDate.getDate(),
      checkIn: null,
      checkOut: null,
      createdBy: Number(userData.employeeId),
      month,
      shift,
      date: new Date(),
      role: assignRole,
      employeeName,
    };
    attendanceAPI
      .addTodayNewAttendance(postData)
      .then((response) => {
        if (get(response, 'data.success')) {
          toast.success('Attendance added successfully', {
            theme: 'colored',
          });
          getTodayAttendance();
        } else {
          toast.error(get(response, 'data.message', ''), {
            theme: 'colored',
          });
          setModalVisible(false);
        }
      })
      .catch(() => {
        toast.error('Attendance added failed', {
          theme: 'colored',
        });
        setModalVisible(false);
      });
  };

  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
  };

  const handleAssignRoleChange = (value) => {
    setAssignRole(value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const style = {
    padding: '8px 0',
  };

  const siteIdDetails = siteIdsOptions.find(
    (item) => item.value === currentSiteId,
  );
  const siteName = siteIdDetails ? siteIdDetails.label : '';

  return (
    <>
      <Loading visible={modalVisible} />
      {siteIdsOptions.length > 1 && (
        <Row align="middle">
          <Col span={15}>
            <h5>{siteName} </h5>
          </Col>
          <Col style={style} span={4} offset={1}>
            <Space wrap>
              <Select
                defaultValue={currentSiteId}
                showSearch
                style={{
                  width: 410,
                }}
                onChange={handleChangeSiteId}
                options={siteIdsOptions}
                filterOption={filterOption}
              />
            </Space>
          </Col>
        </Row>
      )}
      {isEmpty(attendanceData) && (
        <div className="text-center">
          <h3>No records found!</h3>
        </div>
      )}
      {!isEmpty(attendanceData) && (
        <AddAttendance
          employeeData={attendanceData}
          unitCode={currentSiteId}
          handleUpdateAttendace={handleSubmitAttendance}
          handleAddNewEmployee={handleAddNewEmployee}
          onAssignRole={handleAssignRoleChange}
        />
      )}
    </>
  );
};

export default AddAttendanceContainer;
