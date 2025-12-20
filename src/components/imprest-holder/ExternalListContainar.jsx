/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Row, Select } from 'antd';
import { get } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import ticketsAPI from 'api/ticket';
import { Card, Col } from 'react-bootstrap';
import TicketList from './TicketList';
import DcCallTicketList from './DcCallTicketList';
import OtherTicketList from './OtherTicketList';

const ExternalListContainar = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [typeOfCall, setTypeOfCall] = useState([]);
  const [call, setCall] = useState('');
  const [fmsCallHide, setFmsCallHide] = useState(false);
  const [dcCallHide, setDcCallHide] = useState(false);
  const [otherCallHide, setOtherCallHide] = useState(false);
  useEffect(() => {
    const token = get(user, 'token');
    const datas = localStorage.getItem('user');
    const userData = JSON.parse(datas);
    const id = userData.employeeId;
    setModalVisible(true);
    ticketsAPI
      .getTicket(id, token)
      .then((response) => {
        const responseData = get(response, 'data.data.items', []);
        setData(responseData);
        const uniqueTypeOfCalls = [
          ...new Set(responseData.map((item) => item.typeOfCall)),
        ];
        setTypeOfCall(uniqueTypeOfCalls);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleChangeServices = (option) => {
    setCall(option);
    console.log(option);
    if (option) {
      if (option === 'FMS_CALL' || option === 'GARBAGE_CAL') {
        console.log('---FMS_CALL-->');
        setFmsCallHide(true);
        setDcCallHide(false);
        setOtherCallHide(false);
      } else if (option == 'DC_CALL') {
        console.log('---DC_CALL-->');
        setFmsCallHide(false);
        setDcCallHide(true);
        setOtherCallHide(false);
      } else {
        console.log('---else-->');
        setFmsCallHide(false);
        setDcCallHide(false);
        setOtherCallHide(true);
      }
    } else {
      setFmsCallHide(false);
      setDcCallHide(false);
      setOtherCallHide(false);
    }
  };
  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">Your External Ticket List</h5>
          </div>
        </Card.Header>
        <br />
        <Row className="g-2 mb-3">
          <Col md={6}>
            <Select
              showSearch
              size="large"
              placeholder="Select a Tickets"
              optionFilterProp="children"
              filterOption={typeOfCall}
              onChange={handleChangeServices}
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps
              options={typeOfCall.map((type) => ({ value: type, label: type }))}
              style={{
                width: '100%',
              }}
            />
          </Col>
        </Row>
        {fmsCallHide && (
          <Row>
            <TicketList call={call} />
          </Row>
        )}
        {dcCallHide && (
          <Row>
            <DcCallTicketList call={call} />
          </Row>
        )}
        {otherCallHide && (
          <Row>
            <OtherTicketList call={call} />
          </Row>
        )}
      </Card>
    </>
  );
};
export default ExternalListContainar;
