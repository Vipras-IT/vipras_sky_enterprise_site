import { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Select,
  Input,
  Button,
  notification,
  Divider,
  Typography,
} from 'antd';
import { UserOutlined, HistoryOutlined } from '@ant-design/icons';
import siteAPI from 'api/siteCreation';
import { get } from 'lodash';
import useAPI from 'hooks/useApi';
import { useAuth } from 'hooks/useAuth';
import attendaceAPI from 'api/attendance';
import { isEmpty } from 'lodash';
import {
  getEmployeeShiftOptions,
  getErrorMessage,
  monthNames,
} from 'helpers/utils';
import employeeAPI from 'api/getEmployeeDetails';
import { toast } from 'react-toastify';
import crmAPI from 'api/crm';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const UpdateAttendance = () => {
  const getEmployeeAPI = useAPI(employeeAPI.getEmployeeByEmployeeNumber);
  const updateAttendanceAPI = useAPI(attendaceAPI.updateAttendanceByEmployee);
  const getAllAuthorizedOfficersAPI = useAPI(crmAPI.getByAuthUserDropDown);
  const navigate = useNavigate();
  const putAttendanceAPI = useAPI(attendaceAPI.updateAttendance);
  const getOtherDeductionAPI = useAPI(attendaceAPI.getAttendancedetails);
  const params = useParams();
  const shiftoption = getEmployeeShiftOptions();
  const [api, contextHolder] = notification.useNotification();
  const { user } = useAuth();
  const openNotificationWithIcon = (type, message) => {
    api[type]({
      message: message,
    });
  };
  const siteIdsString = window.localStorage.getItem('siteIds');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [role, setRole] = useState('');
  const [assignRole, setAssignRole] = useState('');
  const [noOfDuty, setNoOfDuty] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  let siteIdsOptions = [];
  // const assignedForOptions = [];
  const [authOfficers, setAuthOfficers] = useState([]);
  useEffect(() => {
    getAllAuthorizedOfficersAPI.request(get(user, 'token'));
  }, []);
  useEffect(() => {
    if (
      get(getAllAuthorizedOfficersAPI, 'data.success') &&
      !isEmpty(get(getAllAuthorizedOfficersAPI, 'data.data'))
    ) {
      let options = get(getAllAuthorizedOfficersAPI, 'data.data', []);
      if (get(user, 'role', '') === 'FM') {
        options = options.filter(
          (item) => item.value === get(user, 'employeeId', ''),
        );
      }
      setAuthOfficers(options);
    }
  }, [getAllAuthorizedOfficersAPI.data]);
  useEffect(() => {
    if (getAllAuthorizedOfficersAPI.error) {
      toast.error('Bulk Attendance updated failed', {
        theme: 'colored',
      });
    }
  }, [getAllAuthorizedOfficersAPI.error]);
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  let userSiteIds = get(user, 'unitCodes');
  if (userSiteIds && userSiteIds.length > 0 && userSiteIds[0] !== 'ALL') {
    siteIdsOptions = siteIdsOptions.filter((item) =>
      userSiteIds.includes(item.value),
    );
  }

  const [currentSiteId, setCurrentSiteId] = useState('');
  const [manager, setManager] = useState('');
  const [managerId, setManagerId] = useState('');
  const [shift, setShift] = useState('');

  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
    showUpdateEmployee(value);
  };

  useEffect(() => {
    if (putAttendanceAPI.data) {
      if (
        get(putAttendanceAPI, 'data.success') &&
        !isEmpty(get(putAttendanceAPI, 'data.data'))
      ) {
        toast.success('Bulk Attendance updated  successfully', {
          theme: 'colored',
        });
        navigate('/bulk-attendance-report');
      } else {
        toast.error('Bulk Attendance updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [putAttendanceAPI.data]);
  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getOtherDeductionAPI.request(params.id, get(user, 'token'));
    }
  }, [params.id]);
  const { reset } = useForm();
  useEffect(() => {
    if (getOtherDeductionAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        reset(getOtherDeductionAPI.data.data);
        const resDate = get(getOtherDeductionAPI.data.data, 'date', '');
        const inputDate = new Date(resDate);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();
        const formattedDateString = `${year}-${month}-${day}`;
        setSelectedDate(formattedDateString);
        const initialSiteId = get(getOtherDeductionAPI.data.data, 'siteId', '');
        setCurrentSiteId(initialSiteId);
        setManager(get(getOtherDeductionAPI.data.data, 'operationManager', []));
        setEmployeeName(
          get(getOtherDeductionAPI.data.data, 'employeeName', ''),
        );
        setManagerId(
          get(getOtherDeductionAPI.data.data, 'operationManagerId', ''),
        );
        setEmployeeNumber(
          get(getOtherDeductionAPI.data.data, 'employeeNumber', ''),
        );
        setRole(get(getOtherDeductionAPI.data.data, 'assignedRole', []));
        setAssignRole(get(getOtherDeductionAPI.data.data, 'assignedFor', []));
        setNoOfDuty(get(getOtherDeductionAPI.data.data, 'noOfDuty', []));
        setShift(get(getOtherDeductionAPI.data.data, 'shift', []));
      }
    }
  }, [getOtherDeductionAPI.data]);

  const handleChangeManager = (value) => {
    const managerinfo = authOfficers.find((item) => item.value == value);
    setManager(managerinfo.label);
    setManagerId(value);
  };

  const handleChangeShift = (value) => {
    setShift(value);
  };

  const handleEmployeeNumberChange = (e) => {
    setEmployeeNumber(e.target.value);
  };

  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  const handleAssignRoleChange = (value) => {
    setAssignRole(value);
  };

  const handleNoOfDutyChange = (e) => {
    setNoOfDuty(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleDateChange = (e) => {
    const selected = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(selected > today ? today : selected);
  };

  const handleClick = () => {
    if (
      isEmpty(selectedDate) ||
      !employeeNumber ||
      isEmpty(shift) ||
      !noOfDuty
    ) {
      openNotificationWithIcon('error', 'Please fill Employee details');
    } else if (
      authOfficers.find((emp) => emp.value == employeeNumber) &&
      managerId != 2
    ) {
      openNotificationWithIcon('error', 'You Cannot Allowed to Put Attendance');
    } else {
      const todayDate = new Date(selectedDate);
      const currentMonthName = monthNames[todayDate.getMonth()].label;
      // const userData = JSON.parse(localStorage.getItem('user'));
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      const employeeNum = userData.employeeId;
      const postData = {
        noOfDuty: Number(noOfDuty) || 0,
        shift: shift,
        employeeName: employeeName,
        employeeNumber: Number(employeeNumber),
        assignedRole: role,
        siteId: currentSiteId,
        date: todayDate,
        day: todayDate.getDate(),
        assignedFor: assignRole,
        operationManager: manager,
        isBulkDuty: true,
        operationManagerId: Number(managerId),
        month: `${currentMonthName}-${todayDate.getFullYear()}`,
        createdBy: Number(employeeNum),
      };
      if (!isEmpty(get(params, 'id'))) {
        delete postData.createdOn;
        delete postData.updatedOn;
        const assetIdString = params.id;
        const updatedData = {
          ...postData,
          id: assetIdString,
          isBulkDuty: true,
        };
        putAttendanceAPI.request(updatedData, get(user, 'token'));
      } else {
        updateAttendanceAPI.request(
          employeeNumber,
          postData,
          get(user, 'token'),
        );
      }
    }
  };

  useEffect(() => {
    if (updateAttendanceAPI.data) {
      if (get(updateAttendanceAPI, 'data.success')) {
        toast.success('bulk Attendance updated successfully', {
          theme: 'colored',
        });
        // navigate('/bulk-attendance-report');
      } else {
        toast.error(get(updateAttendanceAPI, 'data.message'), {
          theme: 'colored',
        });
      }
    }
  }, [updateAttendanceAPI.data]);

  useEffect(() => {
    if (updateAttendanceAPI.error) {
      toast.error('Bulk Attendance updated failed', {
        theme: 'colored',
      });
    }
  }, [updateAttendanceAPI.error]);

  useEffect(() => {
    if (getEmployeeAPI.data) {
      if (
        get(getEmployeeAPI, 'data.success') &&
        !isEmpty(get(getEmployeeAPI, 'data.data.items'))
      ) {
        setEmployeeName(
          get(getEmployeeAPI, 'data.data.items[0].employeeName', ''),
        );
        setRole(get(getEmployeeAPI, 'data.data.items[0].role', ''));
      } else {
        toast.error('Employee not found!', {
          theme: 'colored',
        });
        setEmployeeName('');
        setRole('');
      }
    }
  }, [getEmployeeAPI.data, employeeName]);

  useEffect(() => {
    if (getEmployeeAPI.error) {
      toast.error('Something went wrong please try again', {
        theme: 'colored',
      });
    }
  }, [getEmployeeAPI.error]);

  const onSearch = (value) => {
    if (value) {
      getEmployeeAPI.request(value, get(user, 'token'));
    }
  };

  const { Title } = Typography;

  const { Search } = Input;
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const [assignedForOptions, setAssignedForOptions] = useState([]);
  const showUpdateEmployee = async (unitCode) => {
    try {
      const response = await siteAPI.getSitedetailsBySiteCode(unitCode);
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
      }
      const design = get(response, 'data.data.siteAgreedManPower', {});
      const options = design.map((item) => ({
        value: item.name,
        label: item.name,
      }));
      setAssignedForOptions(options);
    } catch (error) {
      toast.error(error, {
        theme: 'colored',
      });
    }
  };

  return (
    <>
      {contextHolder}

      <div className="bg-shape modal-shape-header px-6 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-2 mt-2 text-white">Bulk Attendance</h5>
        </div>
      </div>
      <Card>
        <Row align="middle">
          <Col span={6}>
            <Title level={5}>Authorized Officer</Title>
            <Select
              size="large"
              showSearch
              // showSearch
              optionFilterProp="label"
              style={{ width: '100%' }}
              value={manager}
              onChange={handleChangeManager}
              options={authOfficers.map((officer) => ({
                value: officer.value,
                label: officer.label,
              }))}
            />
          </Col>
          <Col span={8} offset={1}>
            <Title level={5}>Unit Code</Title>
            <Select
              showSearch
              size="large"
              defaultValue={currentSiteId}
              value={currentSiteId}
              style={{
                width: '100%',
              }}
              onChange={handleChangeSiteId}
              filterOption={filterOption}
              options={siteIdsOptions}
            />
          </Col>
          <Col span={6} offset={1}>
            <Title level={5}>Shift Options</Title>
            <Select
              size="large"
              style={{
                width: '100%',
              }}
              onChange={handleChangeShift}
              value={shift}
              options={shiftoption}
            />
          </Col>
        </Row>
        <Divider></Divider>
        <Row align="middle">
          <Col span={6}>
            <Title level={5}>Employee Number</Title>
            <Search
              size="large"
              placeholder="Employee Number"
              value={employeeNumber}
              onChange={handleEmployeeNumberChange}
              onSearch={onSearch}
              enterButton
            />
          </Col>
          <Col span={8} offset={1}>
            <Title level={5}>Employee Name</Title>
            <Input
              size="large"
              prefix={<UserOutlined />}
              value={employeeName}
              onChange={handleEmployeeNameChange}
              readOnly
            />
          </Col>
          <Col span={6} offset={1}>
            <Title level={5}>Attendance Date</Title>
            {/* <DatePicker
              size="large"
              value={selectedDate ? moment(selectedDate, 'YYYY/MM/DD') : null}
              defaultValue={
                selectedDate ? moment(selectedDate, 'YYYY/MM/DD') : null
              }
              onChange={handleDateChange}
              format="YYYY/MM/DD"
            /> */}
            <Input
              name="date"
              size="large"
              type="date"
              value={selectedDate}
              errors
              onChange={handleDateChange}
            />
          </Col>
        </Row>
        <Divider></Divider>
        <Row align="middle">
          <Col span={6}>
            <Title level={5}>Assigned Designation</Title>
            <Input
              size="large"
              prefix={<HistoryOutlined />}
              value={role}
              onChange={handleRoleChange}
              readOnly
            />
          </Col>
          <Col span={6} offset={1}>
            <Title level={5}>Assigned For</Title>
            <Select
              showSearch
              size="large"
              value={assignRole}
              style={{
                width: '100%',
              }}
              onChange={handleAssignRoleChange}
              options={assignedForOptions}
            />
          </Col>
          <Col span={5} offset={1}>
            <Title level={5}>No of Duty</Title>
            <Input
              size="large"
              placeholder="No of Duty"
              value={noOfDuty}
              onChange={handleNoOfDutyChange}
            />
          </Col>
          <Col span={4} offset={1}>
            <Title level={5}></Title>
            <Button size="large" danger type="primary" onClick={handleClick}>
              Submit
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default UpdateAttendance;
