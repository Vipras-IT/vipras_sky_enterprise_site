/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import WizardInput from '../wizard/WizardInput';
import { Button, Spinner } from 'react-bootstrap';
import { Select, Typography, Input } from 'antd';
import FileUpload from 'components/upload/FileUpload';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import employeeAPI from 'api/getEmployeeDetails';
import crmAPI from 'api/crm';
import useAPI from 'hooks/useApi';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import { useParams } from 'react-router-dom';
import { getOptionsData } from 'helpers/utils';
const FmCall = ({ showTextBox1, dates, typeofCall, data, escalation }) => {
  const { user } = useAuth();
  const params = useParams();

  const getAllAuthorizedOfficersAPI = useAPI(crmAPI.getByUserDropDown);
  // const getEmployeeAPI = useAPI(employeeAPI.getEmployeeByEmployeeNumber);
  const postCrmAPI = useAPI(crmAPI.addCrm);
  const updateCrmAPI = useAPI(crmAPI.updateCRM);
  const [employeeId, setEmployeeId] = useState();
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [work, setWork] = useState();
  const [showTextBox3, setShowTextBox3] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [sourceOfLead, setSourceOfLead] = useState();
  const [authOfficers, setAuthOfficers] = useState([]);
  const [manager, setManager] = useState('');
  const [quote1, setQuote1] = useState([]);

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const options = [
    { label: 'GOOGLE AD', value: 'GOOGLE_AD' },
    { label: 'WEBSITE', value: 'WEBSITE' },
    { label: 'CAR', value: 'CAR' },
    { label: 'OUTDOOR ', value: 'OUTDOOR' },
    { label: 'EMAIL & SMS  ', value: 'EMAIL_SMS' },
    { label: 'SOCIAL MEDIA', value: 'SOCIAL MEDIA' },
    { label: 'YOUTUBE', value: 'YOUTUBE' },
    { label: 'COLD CALLS', value: 'COLD_CALLS' },
  ];

  const handleChangeQuets = (key, value) => {
    quote1.push(value);
    setQuote1(quote1);
  };
  useEffect(() => {
    if (data) {
      reset(data);
      setSourceOfLead(data.sourceOfLead);
      setEmployeeId(data.assignedEmployeeId);
      setEmployeeName(data.assignedEmployeeName);
      setDesignation(data.assignedEmployeeRole);
    } else {
      console.log(data);
    }
  }, [data]);

  useEffect(() => {
    getAllAuthorizedOfficersAPI.request(get(user, 'token'));
  }, []);

  useEffect(() => {
    if (
      get(getAllAuthorizedOfficersAPI, 'data.success') &&
      !isEmpty(get(getAllAuthorizedOfficersAPI, 'data.data'))
    ) {
      const responseData = get(getAllAuthorizedOfficersAPI, 'data.data', []);
      //const options = getOptionsData(responseData);
      setAuthOfficers(responseData);
    }
  }, [getAllAuthorizedOfficersAPI.data]);
  useEffect(() => {
    if (getAllAuthorizedOfficersAPI.error) {
      toast.error('CRM updated failed', {
        theme: 'colored',
      });
    }
  }, [getAllAuthorizedOfficersAPI.error]);

  const handleChangeManager = (value) => {
    const managerinfo = authOfficers.find((item) => item.value == value);
    const splitValues = split(managerinfo.label);
    setEmployeeName(splitValues[0]);
    setDesignation(splitValues[1]);
    setEmployeeId(managerinfo.value);
  };
  const split = (value) => {
    let str = value;
    return str.split('-');
  };

  const handleChangeLead = (value, option) => {
    if (option) {
      console.log(value);
      setSourceOfLead(value);
    }
  };
  useEffect(() => {
    if (
      get(postCrmAPI, 'data.success') &&
      !isEmpty(get(postCrmAPI, 'data.data'))
    ) {
      toast.success('CRM added successfully', {
        theme: 'colored',
      });
    } else if (get(postCrmAPI, 'data.message')) {
      toast.error(`CRM added failed: ${postCrmAPI.data.message}`, {
        theme: 'colored',
      });
    }
  }, [postCrmAPI.data]);

  useEffect(() => {
    if (postCrmAPI.error) {
      toast.error('CRM added failed', {
        theme: 'colored',
      });
    }
  }, [postCrmAPI.error]);

  const onSubmitData = async (data) => {
    const datas = localStorage.getItem('user');
    const userData = JSON.parse(datas);
    const employeeNumber = userData.employeeId;
    const createdByName = userData.fullName;
    const postData = {
      ...data,
      date: String(dates),
      ticketType: String(' EXTERNAL'),
      typeOfCall: String(typeofCall),
      sourceOfLead: String(sourceOfLead),
      contactNumber: String(data.contactNumber),
      emailId: String(data.emailId),
      issueDocuments: String(quote1),
      assignedEmployeeId: Number(employeeId),
      assignedEmployeeName: String(employeeName),
      assignedEmployeeRole: String(designation),
      createdByName: String(createdByName),
      createdBy: Number(employeeNumber),
    };
    if (!isEmpty(get(params, 'id'))) {
      // delete postData.createdOn;
      // delete postData.updatedOn;
      updateCrmAPI.request(postData, get(user, 'token'));
    } else {
      await postCrmAPI.request(postData, get(user, 'token'));
    }
  };
  useEffect(() => {
    if (updateCrmAPI.data) {
      if (
        get(updateCrmAPI, 'data.success') &&
        !isEmpty(get(updateCrmAPI, 'data.data'))
      ) {
        toast.success('CRM updated successfully', {
          theme: 'colored',
        });
        // navigate('/other-deductions-list', { replace: true });
      } else {
        toast.error('CRM updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateCrmAPI.data]);
  const handleChangeWork = (e) => {
    console.log(e.target.value);
    setWork(e.target.value);
  };
  // const handleEmployeeIdChange = e => {
  //   setEmployeeId(e.target.value);
  // };

  // const { Search } = Input;
  // useEffect(() => {
  //   if (getEmployeeAPI.data) {
  //     if (
  //       get(getEmployeeAPI, 'data.success') &&
  //       !isEmpty(get(getEmployeeAPI, 'data.data.items'))
  //     ) {
  //       setEmployeeName(
  //         get(getEmployeeAPI, 'data.data.items[0].employeeName', '')
  //       );
  //       setDesignation(get(getEmployeeAPI, 'data.data.items[0].role', ''));
  //     } else {
  //       toast.error('Employee not found!', {
  //         theme: 'colored'
  //       });
  //       setEmployeeName('');
  //       setDesignation('');
  //     }
  //   }
  // }, [getEmployeeAPI.data]);

  useEffect(() => {
    if (showTextBox1 == true) {
      console.log(dates);
      setShowTextBox3(true);
    } else {
      setShowTextBox3(false);
    }
  }, [showTextBox1]);
  // useEffect(() => {
  //   if (getEmployeeAPI.error) {
  //     toast.error(`Something went wrong please try again`, {
  //       theme: 'colored'
  //     });
  //   }
  // }, [getEmployeeAPI.error]);
  // const onSearch = value => {
  //   if (value) {
  //     getEmployeeAPI.request(value, get(user, 'token'));
  //   }
  // };

  return (
    <>
      <Row
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        <Row className="g-2 mb-3">
          <Col md={6}>
            <label>Select a Source of Lead</label>
            <Select
              showSearch
              size="large"
              placeholder="Select a Lead"
              value={sourceOfLead}
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={handleChangeLead}
              formGroupProps={{ as: Col, sm: 8 }}
              formControlProps
              options={options}
              style={{
                width: '100%',
              }}
            />
          </Col>
          <WizardInput
            label="Client Name"
            name="clientName"
            errors
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('clientName'),
            }}
          />
        </Row>
        <Row className="g-2 mb-3">
          <WizardInput
            label="Contact Number"
            name="contactNumber"
            type="number"
            errors
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('contactNumber', {
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Please enter a valid 10-digit contact number',
                },
              }),
            }}
          />
          <WizardInput
            label="Email"
            name="emailId"
            type="email"
            errors
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('emailId'),
            }}
          />
          {showTextBox3 && (
            <Col md="6">
              <label>Type of work</label>
              <select
                name="source"
                value={work}
                onChange={handleChangeWork}
                className="form-select"
              >
                <option value="">Select your Work...</option>
                <option value="DEEP_CLEANINGS">Deep Cleaning</option>
                <option value="TC">TC</option>
                <option value="PROJECT_WORK">Project Work</option>
                <option value="FOLLOW_UP">Follow Up</option>
              </select>
            </Col>
          )}
        </Row>
        <Row className="g-2 mb-3">
          <WizardInput
            label="Address"
            name="address"
            type="textarea"
            errors
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('address'),
            }}
          />

          {/* <Col span={6}>
            <Title level={5}>Ticket Assigned to</Title>
            <Search
              name="assignedEmployeeId"
              size="large"
              placeholder="employee Id"
              value={employeeId}
              onChange={handleEmployeeIdChange}
              onSearch={onSearch}
              enterButton
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                 ...register('assignedEmployeeId')
              }}
            />
          </Col> */}
          <Col span={6}>
            <label>Ticket Assigned to</label>
            <Select
              size="large"
              showSearch
              style={{ width: '100%' }}
              // value={manager}
              // onSearch={onSearch}
              optionFilterProp="label"
              onChange={handleChangeManager}
              options={authOfficers.map((officer) => ({
                value: officer.value,
                label: officer.label,
              }))}
            />
            <br />
            <br />
            <FileUpload
              setValue={handleChangeQuets}
              documentName="quote1"
              label="Uploade Images"
              documents={quote1}
              multiple={true}
            />
          </Col>
        </Row>
        {/* <Row className="g-2 mb-3">
          <Col span={8} offset={1}>
            <Title level={5}>Employee Name</Title>
            <Input
              name="assignedEmployeeName"
              size="large"
              prefix={<UserOutlined />}
              value={employeeName}
              readOnly
              onChange={handleEmployeeNameChange}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('assignedEmployeeName')
              }}
            />
          </Col>
          <Col span={6}>
            <Title level={5}>Designation</Title>
            <Input
              name="assignedEmployeeRole"
              size="large"
              prefix={<HistoryOutlined />}
              value={designation}
              onChange={handleDesignationChange}
              readOnly
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('assignedEmployeeRole')
              }}
            />
          </Col>
        </Row> */}
        <Row className="g-2 mb-3">
          <Col span={6}></Col>
        </Row>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {postCrmAPI.loading && (
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
      </Row>
    </>
  );
};

export default FmCall;
