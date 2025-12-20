/* eslint-disable no-unused-vars */

import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import WizardInput from '../wizard/WizardInput';
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
const DcCallTicketEdit = () => {
  const params = useParams();
  const { user } = useAuth();
  const updateTicketsAPI = useAPI(ticketAPI.updateTickets);
  const getTicketsAPI = useAPI(ticketAPI.getTicketsdetails);

  const [showTextBox, setShowTextBox] = useState(false);
  const [showTextBox1, setShowTextBox1] = useState(false);
  const [showTextBox2, setShowTextBox2] = useState(false);
  const [feedback, setFeedback] = useState();
  const [invoice, setInvoice] = useState();
  const [datas, setDatas] = useState();

  const [quote1, setQuote1] = useState([]);
  const [quote2, setQuote2] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleChange = (e) => {
    setFeedback(e.target.value);
    if (e.target.value === 'COMPLETED') {
      setShowTextBox(true);
    } else {
      setShowTextBox(false);
      setShowTextBox1(false);
      setShowTextBox2(false);
    }
    // setFeedback(e.target.value);
  };

  const handleChangeQuets = (key, value) => {
    quote1.push(value);
    setQuote1(quote1);
  };

  const handleChangeQuets2 = (key, value) => {
    quote2.push(value);
    setQuote2(quote1);
  };

  const handleChangePaymentMode = (e) => {
    console.log(e.target.value);
  };

  const handleChangeStatus = (e) => {
    setInvoice(e.target.value);
    if (e.target.value === 'YES') {
      console.log('====>');
      setShowTextBox2(true);
      setShowTextBox1(false);
    } else if (e.target.value === 'NO') {
      setShowTextBox1(true);
      setShowTextBox2(false);
    } else {
      setShowTextBox1(false);
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
      status: String(feedback),
      quote1: String(quote1),
      quote2: String(quote2),
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
        <Card.Body className="fw-normal px-md-3 py-2">
          <Row className="g-2 mb-3">
            <Col md={12}>
              <ExternalTicketDetails siteData={datas} />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
              <div className="d-flex justify-content-between ">
                <h5 className="text-white">Your Ticket Status</h5>
              </div>
            </div>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <FileUpload
                setValue={handleChangeQuets}
                documentName="quote1"
                label="Before Photos"
                documents={quote1}
                multiple={true}
              />
            </Col>
            <Col md={6}>
              <FileUpload
                setValue={handleChangeQuets2}
                documentName="quote2"
                label="After Photos"
                documents={[get('quote2', '')]}
                multiple={true}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md="6">
              <WizardInput
                label="No.of Manpower Deployed"
                name="numberOfManPowerDeployed"
                type="text"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('numberOfManPowerDeployed'),
                }}
              />
            </Col>
            <Col md="6">
              <label>Status</label>
              <select
                name="source"
                value={feedback}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select your Status...</option>
                <option value="COMPLETED">WORK COMPLETED</option>
                <option value="CONTINUED_TO_NEXT_DAYS">
                  CONTINUED TO NEXT DAYS
                </option>
              </select>
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            {showTextBox && (
              <Col md="6">
                <label>Invoice</label>
                <select
                  name="source"
                  value={invoice}
                  onChange={handleChangeStatus}
                  className="form-select"
                >
                  <option value="">Select your Invoice...</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </Col>
            )}
            {showTextBox1 && (
              <Col md={6}>
                <label>Payment Mode</label>
                <select
                  name="source"
                  //value={invoice}
                  onChange={handleChangePaymentMode}
                  className="form-select"
                >
                  <option value="">Select your Payment Mode...</option>
                  <option value="GPAY">GPAY</option>
                  <option value="NEFT">NEFT</option>
                  <option value="CHEQUE">CHEQUE</option>
                  <option value="GST_INVOICE">GST_INVOICE</option>
                </select>
              </Col>
            )}
            {showTextBox1 && (
              <Col md={6}>
                <WizardInput
                  label="To Whom"
                  name="toWhom"
                  errors
                  type="text"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('toWhom'),
                  }}
                />
              </Col>
            )}
            {showTextBox2 && (
              <Col md={6}>
                <WizardInput
                  label="GST Number"
                  name="gstNumber"
                  errors
                  type="number"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('gstNumber'),
                  }}
                />
              </Col>
            )}
            {showTextBox2 && (
              <Col md={6}>
                <WizardInput
                  label="Biling Address"
                  name="bilingAddress"
                  errors
                  type="text"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('bilingAddress'),
                  }}
                />
              </Col>
            )}
            {showTextBox2 && (
              <Col md={6}>
                <WizardInput
                  label="PO NUMBER"
                  name="PO NUMBER"
                  errors
                  type="text"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('PO NUMBER'),
                  }}
                />
              </Col>
            )}
            {showTextBox2 && (
              <Col md={6}>
                <label>Date (DD/MM/YYYY)</label>
                <input
                  label="Date (DD-MM-YYYY)"
                  name="date"
                  type="date"
                  // value={dates}
                  // onChange={handleChangeDate}
                  // onChange={e => setDates(e.target.value)}
                  className="form-control"
                />
              </Col>
            )}
            {showTextBox2 && (
              <Col md={6}>
                <WizardInput
                  label="Amount"
                  name="amount"
                  errors
                  type="text"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('amount'),
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

export default DcCallTicketEdit;
