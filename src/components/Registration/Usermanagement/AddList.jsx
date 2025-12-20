/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import userApi from 'api/addlist';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import WizardInput from '../../wizard/WizardInput';
import { useParams } from 'react-router-dom';
import employeeAPI from 'api/getEmployeeDetails';
import { Typography, Input, Select, notification } from 'antd';
import { getErrorMessage, loginRole } from 'helpers/utils';
const { Title } = Typography;
import { UserOutlined, HistoryOutlined } from '@ant-design/icons';

const AddList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [loading, setLoading] = useState(false);
  const [siteId, setSiteId] = useState([]);
  const [access, setAccess] = useState([]);
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  siteIds.unshift('ALL');
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message) => {
    api[type]({
      message: message,
    });
  };

  const accessOptions = [
    {
      value: 'IMPREST_HOLDER',
      label: 'IMPREST_HOLDER',
    },
    {
      value: 'SUB_CONTRACTOR',
      label: 'SUB_CONTRACTOR',
    },
    {
      value: 'AUTH_OFFICERS',
      label: 'AUTH_OFFICERS',
    },
  ];

  const { Search } = Input;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmitData = async (data) => {
    if (
      !employeeId ||
      isEmpty(employeeName) ||
      siteId.length === 0 ||
      isEmpty(data.role) ||
      isEmpty(data.userId) ||
      isEmpty(data.password)
    ) {
      openNotificationWithIcon('error', 'Please fill all the user details');
    } else {
      const userData = JSON.parse(localStorage.getItem('user'));
      const postData = {
        password: String(data.password),
        employeeId: Number(employeeId),
        userId: String(data.userId),
        unitCodes: siteId,
        role: String(data.role),
        fullName: String(employeeName),
        designation: designation,
        access: access,
        status: true,
        createdBy: Number(userData.employeeId),
      };
      if (!isEmpty(get(params, 'userId'))) {
        setLoading(true);
        delete postData.createdOn;
        delete postData.updatedOn;
        delete postData.id;
        const response = await userApi.updateUsers(
          postData,
          get(user, 'token'),
        );
        const errorMessage = getErrorMessage(response);
        setLoading(false);
        if (errorMessage) {
          toast.error(errorMessage, {
            theme: 'colored',
          });
        } else {
          toast.success('User updated successfully', {
            theme: 'colored',
          });
          navigate('/listuser', { replace: true });
        }
      } else {
        setLoading(true);
        const response = await userApi.addUsers(postData, get(user, 'token'));
        const errorMessage = getErrorMessage(response);
        setLoading(false);
        if (errorMessage) {
          toast.error("user ID already exists" , {
            theme: 'colored',
          });
        } else {
          toast.success('User added successfully', {
            theme: 'colored',
          });
          navigate('/listuser', { replace: true });
        }
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(get(params, 'userId'))) {
      showUpdateEmployee(params.userId);
    }
  }, [params.userId]);

  const showUpdateEmployee = async (userId) => {
    const response = await userApi.getUserdetails(userId, get(user, 'token'));
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      reset(response.data.data);
      setValue('password', '');
      setValue('userId', get(response, 'data.data.userId', ''));
      setEmployeeId(get(response, 'data.data.employeeId', ''));
      setEmployeeName(get(response, 'data.data.fullName', ''));
      setDesignation(get(response, 'data.data.designation', ''));
      const sizes = get(response, 'data.data.unitCodes', []);
      const access = get(response, 'data.data.access', []);
      setSiteId(sizes);
      setAccess(access);
    }
  };

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };
  const handleSiteIdChanges = (optin, values) => {
    setSiteId(optin);
  };

  const handleAccessChanges = (optin, values) => {
    setAccess(optin);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
  };

  const onSearch = (value) => {
    if (value) {
      searchEmployeeDetails(value);
    }
  };
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const searchEmployeeDetails = async (employeeId) => {
    const response = await employeeAPI.getEmployeeByEmployeeNumber(employeeId);
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error('Employee not found!', {
        theme: 'colored',
      });
      setEmployeeName('');
      setDesignation('');
    } else {
      if (!isEmpty(get(response, 'data.data.items'))) {
        setEmployeeName(get(response, 'data.data.items[0].employeeName', ''));
        setDesignation(get(response, 'data.data.items[0].role', ''));
      }
    }
  };
  return (
    <>
      {contextHolder}
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add List</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md={6}>
              <Title level={5}>Employee Id</Title>
              <Search
                name="employeeId"
                size="large"
                placeholder="employee Id"
                value={employeeId}
                onChange={handleEmployeeIdChange}
                onSearch={onSearch}
                enterButton
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('employeeId'),
                }}
              />
            </Col>
            <Col md={6}>
              <Title level={5}>Employee Name</Title>
              <Input
                name="employeeName"
                size="large"
                prefix={<UserOutlined />}
                value={employeeName}
                onChange={handleEmployeeNameChange}
                readOnly
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('employeeName'),
                }}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <Title level={5}>Designation</Title>
              <Input
                name="designation"
                size="large"
                prefix={<HistoryOutlined />}
                value={designation}
                onChange={handleDesignationChange}
                readOnly
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('designation'),
                }}
              />
            </Col>
            <Col sm={6}>
              <Title level={5}>Site Id</Title>
              <Select
                size="large"
                mode="multiple"
                name="siteId"
                label="Site Id"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select a Site ID"
                value={siteId}
                filterOption={filterOption}
                onChange={handleSiteIdChanges}
                options={siteIds.map((siteId) => ({
                  value: siteId ? siteId.split('-')[0] : '',
                  label: siteId,
                }))}
                formGroupProps={{ as: Col, sm: 6 }}
                formControlProps={{
                  ...register('siteId'),
                }}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="User Id"
              name="userId"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('userId'),
              }}
            />
            <WizardInput
              label="Password"
              name="password"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('password'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <Col sm={6}>
              <WizardInput
                type="select"
                label="Role"
                name="role"
                errors={''}
                options={loginRole}
                formGroupProps={{ as: Col, sm: 6 }}
                formControlProps={{
                  ...register('role'),
                }}
              />
            </Col>
            <Col sm={6}>
              <Title level={5}>Authorization</Title>
              <Select
                size="large"
                mode="multiple"
                name="authorization"
                label="authorization"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select a Authorization"
                value={access}
                onChange={handleAccessChanges}
                options={accessOptions}
                formGroupProps={{ as: Col, sm: 6 }}
                formControlProps={{
                  ...register('authorization'),
                }}
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <span className="ps-2">Save</span>
              </Button>
            </Col>
            <Col md={4}></Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

export default AddList;
