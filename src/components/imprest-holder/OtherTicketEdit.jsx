/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import WizardInput from '../wizard/WizardInput';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ticketAPI from 'api/ticket';
import useAPI from 'hooks/useApi';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import ExternalTicketDetails from './ExternalTicketDetails';
const OtherTicketEdit = () => {
  const params = useParams();
  const { user } = useAuth();
  const updateTicketsAPI = useAPI(ticketAPI.updateTickets);
  const getTicketsAPI = useAPI(ticketAPI.getTicketsdetails);
  //   const [showTextBox, setShowTextBox] = useState(false);
  const [feedback, setFeedback] = useState();

  const [datas, setDatas] = useState();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleChange = (e) => {
    // setShowTextBox(e.target.value === 'NOT_INTERESTED');
    setFeedback(e.target.value);
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
      ...data,
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
      comments: String(data.comments),
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
            <Col md={6}>
              <WizardInput
                label="Comments"
                name="comments"
                type="textarea"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('comments'),
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

export default OtherTicketEdit;
