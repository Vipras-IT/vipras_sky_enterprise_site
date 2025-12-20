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
const DcCall = ({ dates, typeofCall, data, escalation }) => {
  const { user } = useAuth();
  // const getEmployeeAPI = useAPI(employeeAPI.getEmployeeByEmployeeNumber);
  const getAllAuthorizedOfficersAPI = useAPI(crmAPI.getByUserDropDown);
  const postCrmAPI = useAPI(crmAPI.addCrm);
  const [authOfficers, setAuthOfficers] = useState([]);
  const [employeeId, setEmployeeId] = useState();
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [work, setWork] = useState('');
  const [status, setStatus] = useState('');
  const [sourceOfLead, setSourceOfLead] = useState();
  const [showTextBox3, setShowTextBox3] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [quote1, setQuote1] = useState([]);

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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

  useEffect(() => {
    getAllAuthorizedOfficersAPI.request(get(user, 'token'));
  }, []);

  useEffect(() => {
    if (
      get(getAllAuthorizedOfficersAPI, 'data.success') &&
      !isEmpty(get(getAllAuthorizedOfficersAPI, 'data.data'))
    ) {
      const responseData = get(getAllAuthorizedOfficersAPI, 'data.data', []);
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
  const handleChangeLead = (value, option) => {
    if (option) {
      console.log(value);
      setSourceOfLead(value);
    }
  };

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
  const typeOfWork = [
    { label: 'DEEP_CLEANINGS', value: 'DEEP_CLEANINGS' },
    { label: 'FOLLOW_UP', value: 'FOLLOW_UP' },
    { label: 'TC', value: 'TC' },
    { label: 'PROJECT_WORK ', value: 'PROJECT_WORK' },
  ];
  const handleChangeWork = (e) => {
    setWork(e.target.value);
  };

  const handleChangeQuets = (key, value) => {
    quote1.push(value);
    setQuote1(quote1);
  };

  const [size, setSize] = useState();
  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
    console.log(e.target.value);
    if (e.target.value === 'INTERESTED') {
      setShowTextBox3(true);
      setSize(12);
    } else {
      setShowTextBox3(false);
      setSize(6);
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
    console.log(dates);
    console.log(typeofCall);
    const datas = localStorage.getItem('user');
    const userData = JSON.parse(datas);
    const employeeNumber = userData.employeeId;
    const createdByName = userData.fullName;
    const postData = {
      ...data,
      date: String(dates),
      typeOfCall: String(typeofCall),
      ticketType: String(' EXTERNAL'),
      sourceOfLead: String(sourceOfLead),
      contactNumber: String(data.contactNumber),
      emailId: String(data.emailId),
      assignedEmployeeId: Number(employeeId),
      assignedEmployeeName: String(employeeName),
      assignedEmployeeRole: String(designation),
      natureOfWork: String(data.natureOfWork),
      issueDocuments: String(quote1),
      typeofWork: String(work),
      feedBack: String(status),
      createdByName: String(createdByName),
      createdBy: Number(employeeNumber),
    };
    await postCrmAPI.request(postData, get(user, 'token'));
  };

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
          <Col md={6}>
            <WizardInput
              label="Client Name"
              name="clientName"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('clientName'),
              }}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col md={6}>
            <WizardInput
              label="Contact Number"
              name="contactNumber"
              type="number"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('contactNumber', {
                  pattern: {
                    value: /^\d{10}$/,
                    message: 'Please enter a valid 10-digit contact number',
                  },
                }),
              }}
            />
          </Col>
          <Col md={6}>
            <WizardInput
              label="Email"
              name="emailId"
              type="email"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('emailId'),
              }}
            />
          </Col>
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
          <Col md="6">
            <label>Type of work</label>
            <select
              name="source"
              value={work}
              onChange={handleChangeWork}
              className="form-select"
            >
              <option value="">Select your Work...</option>
              <option value=" DEEP_CLEANINGS">DEEP_CLEANINGS</option>
              <option value=" TC">TANK_CLEANING</option>
              <option value=" PROJECT_WORK ">PROJECT_WORK</option>
              <option value=" FOLLOW_UP">FOLLOW_UP</option>
            </select>
            <WizardInput
              label="Nature of Work"
              name="natureOfWork"
              type="text"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('natureOfWork'),
              }}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col md="6">
            <label>Status</label>
            <select
              name="source"
              value={status}
              onChange={handleChangeStatus}
              className="form-select"
            >
              <option value="">Select your Status...</option>
              <option value="INTERESTED">INTERESTED</option>
              <option value="NOT_INTERESTED">NOT INTERESTED</option>
              {/* <option value="FOLLOW_UP">FOLLOW UP</option> */}
            </select>
          </Col>
          <Col md="6">
            <label>Uploade Images</label>
            <FileUpload
              setValue={handleChangeQuets}
              documentName="quote1"
              label="Uploade Images"
              documents={quote1}
              multiple={true}
            />
          </Col>
          {showTextBox3 && (
            <Col md="6">
              <WizardInput
                label="Booking Amount"
                name="Booking Amount"
                type="number"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('Booking Amount'),
                }}
              />
            </Col>
          )}
          {showTextBox3 && (
            <Col md={6}>
              <label>Booking Date (DD/MM/YYYY)</label>
              <input
                label="Date (DD-MM-YYYY)"
                name="date"
                type="date"
                className="form-control"
              />
            </Col>
          )}
          {/* {showTextBox3 && (
            <Col span={6}>
              <label>Ticket Assigned to</label>
              <Select
                size="large"
                style={{ width: '100%' }}
                // value={manager}
                onChange={handleChangeManager}
                options={authOfficers.map(officer => ({
                  value: officer.value,
                  label: officer.label
                }))}
              />
            </Col>
          )} */}
        </Row>
        <Row className="g-2 mb-3">
          <Col span={6}>
            <WizardInput
              label="Remarks"
              name="remark"
              type="text"
              errors
              formGroupProps={{ as: Col, sm: size }}
              formControlProps={{
                ...register('remark'),
              }}
            />
          </Col>
          {showTextBox3 && (
            <Col span={6}>
              <label>Ticket Assigned to</label>
              <Select
                size="large"
                style={{ width: '100%' }}
                // value={manager}
                onChange={handleChangeManager}
                options={authOfficers.map((officer) => ({
                  value: officer.value,
                  label: officer.label,
                }))}
              />
            </Col>
          )}
        </Row>
        <Row className="g-2 mb-3">
          {/* <Col span={6}>
            <WizardInput
              label="Remarks"
              name="remark"
              type="text"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('remark')
              }}
            />
          </Col> */}
        </Row>
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

export default DcCall;
