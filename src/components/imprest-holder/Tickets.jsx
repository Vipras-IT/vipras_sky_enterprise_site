/* eslint-disable no-unused-vars */

import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import WizardInput from '../wizard/WizardInput';
import IconButton from 'components/common/IconButton';
import { Form, Button, Spinner } from 'react-bootstrap';
import { Select, Typography, Input } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ticketAPI from 'api/ticket';
import useAPI from 'hooks/useApi';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';

import { useAuth } from 'hooks/useAuth';
import FileUpload from 'components/upload/FileUpload';
import TicketDetails from './TicketDetails';
import ExternalTicketDetails from './ExternalTicketDetails';
const Tickets = () => {
  const params = useParams();
  const { user } = useAuth();
  const updateTicketsAPI = useAPI(ticketAPI.updateTickets);
  const getTicketsAPI = useAPI(ticketAPI.getTicketsdetails);

  const [showTextBox, setShowTextBox] = useState(false);
  const [showTextBox1, setShowTextBox1] = useState(false);
  const [showTextBox2, setShowTextBox2] = useState(false);
  const [showTextBox3, setShowTextBox3] = useState(false);
  const [feedback, setFeedback] = useState();
  const [status, setStatus] = useState();
  const [datas, setDatas] = useState();
  const [services, setServices] = useState('');
  const [quote1, setQuote1] = useState([]);
  const [quote2, setQuote2] = useState([]);
  const [quote3, setQuote3] = useState([]);
  const [finalQuote, setFinalQuote] = useState([]);
  const [dateofCommencement, setDateofCommencement] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const serviceOptions = [
    {
      label: 'INTEGRATED FACILITY MANAGEMENT SERVICES ',
      value: 'INTEGRATED_FACILITY_MANAGEMENT_SERVICES',
    },
    {
      label: 'FACILITY MANAGEMENT SERVICES',
      value: 'FACILITY_MANAGEMENT_SERVICES',
    },
    { label: 'SECURITY SERVICES', value: 'SECURITY_SERVICES' },
    { label: 'HOUSE KEEPING SERVICES', value: 'HOUSE_KEEPING_SERVICES' },
    { label: 'GARDENER SERVICES', value: 'GARDENER_SERVICES' },
    { label: 'MST SERVICES', value: 'MST_SERVICES' },
    { label: 'MAN POWER SERVICES', value: 'MAN_POWER_SERVICES' },
    { label: 'CASUAL LABOUR SERVICES', value: 'CASUAL_LABOUR_SERVICES' },
    { label: 'PAYROLLS', value: 'PAYROLLS' },
  ];

  const handleChange = (e) => {
    setShowTextBox(e.target.value === 'NOT_INTERESTED');
    setFeedback(e.target.value);
  };

  const handleChangeQuets = (key, value) => {
    quote1.push(value);
    setQuote1(quote1);
  };

  const handleChangeQuets2 = (key, value) => {
    quote2.push(value);
    setQuote2(quote1);
  };

  const handleChangeQuet3 = (key, value) => {
    quote3.push(value);
    setQuote3(quote3);
  };
  const handleChangeQuet4 = (key, value) => {
    finalQuote.push(value);
    setFinalQuote(finalQuote);
  };

  const handleChangeCommencement = (e) => {
    setDateofCommencement(e.target.value);
  };

  const handleChangeServices = (option, value) => {
    console.log(option);
    setServices(option);
    console.log(get('quote1', ''));
  };
  const handleChangeStatus = (e) => {
    setStatus(e.target.value);
    if (e.target.value === 'FOLLOW_UP') {
      setShowTextBox1(true);
      setShowTextBox3(false);
      setShowTextBox2(false);
    } else if (e.target.value === 'MISSED') {
      setShowTextBox1(false);
      setShowTextBox3(false);
      setShowTextBox2(true);
    } else if (e.target.value === 'ORDER_CONFIRMED') {
      setShowTextBox1(false);
      setShowTextBox3(true);
      setShowTextBox2(false);
    } else {
      setShowTextBox1(false);
      setShowTextBox3(false);
      setShowTextBox2(false);
    }
  };

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getTicketsAPI.request(params.id, get(user, 'token'));
    }
  }, [params.id]);
  useEffect(() => {
    if (getTicketsAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        setDatas(getTicketsAPI.data.data);
      }
    }
  }, [getTicketsAPI.data]);

  const onSubmitData = async (data) => {
    const postData = {
      date: get(datas, 'date', ''),
      typeOfCall: get(datas, 'typeOfCall', ''),
      sourceOfLead: get(datas, 'sourceOfLead', ''),
      contactNumber: get(datas, 'contactNumber', ''),
      clientName: get(datas, 'clientName', ''),
      emailId: get(datas, 'emailId', ''),
      assignedEmployeeId: get(datas, 'assignedEmployeeId', ''),
      assignedEmployeeName: get(datas, 'assignedEmployeeName', ''),
      assignedEmployeeRole: get(datas, 'assignedEmployeeRole', ''),
      feedBack: String(feedback),
      status: String(status),
      typeOfService: services,
      quote1: String(quote1),
      quote2: String(quote2),
      quote3: String(quote3),
      finalQuote: String(finalQuote),
      dateOfCommencement: dateofCommencement,
      valueOfBusiness: data.valueOfBusiness,
    };
    if (!isEmpty(get(params, 'id'))) {
      const roomId = params.id;
      console.log(roomId);
      const updatedData = { ...postData, id: roomId };
      await updateTicketsAPI.request(updatedData, get(user, 'token'));
    }
  };
  useEffect(() => {
    if (updateTicketsAPI.data) {
      if (
        get(updateTicketsAPI, 'data.success') &&
        !isEmpty(get(updateTicketsAPI, 'data.data'))
      ) {
        toast.success('Tickets Updated Successfully', {
          theme: 'colored',
        });
        // navigate('/rental-rooms-list', { replace: true });
      } else {
        toast.error('Tickets Updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateTicketsAPI.data]);

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        {/* <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Tickets</h5>
          </div>
        </Card.Header> */}

        <Card.Body className="fw-normal px-md-3 py-2">
          <Row className="g-2 mb-3">
            <Col md={12}>
              <ExternalTicketDetails siteData={datas} />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            {/* <div className="mt-3 card LineSpace "> */}
            <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
              <div className="d-flex justify-content-between ">
                <h5 className="text-white">Your Ticket Status</h5>
              </div>
            </div>
          </Row>
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>Feedback</label>
              <select
                name="source"
                value={feedback}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select your option...</option>
                <option value="INTERESTED">INTERESTED</option>
                <option value="NOT_INTERESTED">NOT INTERESTED</option>
              </select>
            </Col>
            {showTextBox && (
              <Col md={6}>
                <WizardInput
                  label="Remark"
                  name="remark"
                  type="text"
                  errors
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('remark'),
                  }}
                />
              </Col>
            )}
            <Col md={6}>
              <label>Type of Services</label>
              <Select
                showSearch
                size="large"
                placeholder="Select a Services"
                optionFilterProp="children"
                filterOption={filterOption}
                onChange={handleChangeServices}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps
                options={serviceOptions}
                style={{
                  width: '100%',
                }}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <FileUpload
                setValue={handleChangeQuets}
                documentName="quote1"
                label="Quote 1"
                documents={quote1}
                multiple={true}
              />
            </Col>
            <Col md={6}>
              <FileUpload
                setValue={handleChangeQuets2}
                documentName="quote2"
                label="Quote 2"
                documents={[get('quote2', '')]}
                multiple={true}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <FileUpload
                setValue={handleChangeQuet3}
                documentName="quote3"
                label="Quote 3"
                documents={[get('quote3', '')]}
              />
            </Col>
            <Col md={6}>
              <FileUpload
                setValue={handleChangeQuet4}
                documentName="finalQuote"
                label="Final Quote"
                documents={[get('finalQuote', '')]}
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
                <option value="ORDER_CONFIRMED">ORDER CONFIRMED</option>
                <option value="FOLLOW_UP">FOLLOW UP</option>
                <option value="MISSED">MISSED</option>
              </select>
            </Col>
            {showTextBox1 && (
              <Col md={6}>
                <label>Date (DD/MM/YYYY)</label>
                <input
                  label="Date (DD-MM-YYYY)"
                  name="date"
                  type="date"
                  className="form-control"
                />
              </Col>
            )}
            {showTextBox1 && (
              <Col md={6}>
                <WizardInput
                  label="Remarks"
                  //placeholder="Please Enter The Debit (Rs.)"
                  name="debit"
                  errors
                  type="text"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('finalquote'),
                  }}
                />
              </Col>
            )}
            {showTextBox2 && (
              <Col md={6}>
                <WizardInput
                  label="Remarks"
                  //placeholder="Please Enter The Debit (Rs.)"
                  name="debit"
                  errors
                  type="text"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('finalquote'),
                  }}
                />
              </Col>
            )}
            {showTextBox3 && (
              <Col md={6}>
                <label>Date of Commencement (DD/MM/YYYY)</label>
                <input
                  label="Date (DD-MM-YYYY)"
                  name="date"
                  type="date"
                  value={dateofCommencement}
                  onChange={handleChangeCommencement}
                  className="form-control"
                />
              </Col>
            )}
            {showTextBox3 && (
              <Col md={6}>
                <WizardInput
                  label="Value of the Business"
                  //placeholder="Please Enter The Debit (Rs.)"
                  name="valueOfBusiness"
                  errors
                  type="number"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('valueOfBusiness'),
                  }}
                />
              </Col>
            )}
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {updateTicketsAPI.loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <span className="ps-2">Add</span>
              </Button>
            </Col>
            <Col md={4}></Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

export default Tickets;
