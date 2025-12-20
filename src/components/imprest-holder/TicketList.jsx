/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Row, Select } from 'antd';
import { get, isEmpty, upperCase } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import Loading from 'components/attendance/Loading';
import ticketsAPI from 'api/ticket';
import IndividualListTable from 'components/Registration/IndividualListTable';
import { Card, Col } from 'react-bootstrap';

const TicketList = ({ call }) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // const [typeOfCall, setTypeOfCall] = useState([]);
  // const [call, setCall] = useState('');
  // useEffect(() => {
  //   const token = get(user, 'token');
  //   const datas = localStorage.getItem('user');
  //   const userData = JSON.parse(datas);
  //   const id = userData.employeeId;
  //   setModalVisible(true);
  //   ticketsAPI
  //     .getTicket(id, token)
  //     .then(response => {
  //       const responseData = get(response, 'data.data.items', []);
  //       const uniqueTypeOfCalls = [
  //         ...new Set(responseData.map(item => item.typeOfCall))
  //       ];
  //       setTypeOfCall(uniqueTypeOfCalls);
  //       //setData(responseData);
  //       //setModalVisible(false);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //       //setModalVisible(false);
  //     });
  // }, []);
  useEffect(() => {
    const token = get(user, 'token');
    const datas = localStorage.getItem('user');
    const userData = JSON.parse(datas);
    const id = userData.employeeId;
    setModalVisible(true);
    ticketsAPI
      .getTickets(id, call, token)
      .then((respose) => {
        const responseData = get(respose, 'data.data.items', []);
        setData(responseData);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setModalVisible(false);
      });
  }, [call]);

  const totalColumn = [
    {
      title: 'Source of Lead',
      dataIndex: 'sourceOfLead',
      key: 'sourceOfLead',
      width: 200,
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
      width: 200,
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'emailId',
      key: 'emailId',
      width: 150,
    },
    {
      title: 'Task Assigned to',
      dataIndex: 'assignedEmployeeId',
      key: 'assignedEmployeeId',
      width: 150,
    },
    {
      title: 'Employee Name',
      dataIndex: 'assignedEmployeeName',
      key: 'assignedEmployeeName',
      width: 200,
    },
    {
      title: 'Employee Role',
      dataIndex: 'assignedEmployeeRole',
      key: 'assignedEmployeeRole',
      width: 150,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 150,
    },
    {
      title: 'Feedback',
      dataIndex: 'feedBack',
      key: 'feedBack',
      width: 150,
    },
    {
      title: 'Date Of Commencement',
      dataIndex: 'dateOfCommencement',
      key: 'dateOfCommencement',
      width: 150,
      render: (text, record) => {
        const date = new Date(record.dateOfCommencement);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear().toString();
        return <span>{`${day}/${month}/${year}`}</span>;
      },
    },
    {
      title: 'Type Of Service',
      dataIndex: 'typeOfService',
      key: 'typeOfService',
      width: 150,
    },
    {
      title: 'Value Of Business',
      dataIndex: 'valueOfBusiness',
      key: 'valueOfBusiness',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
    },
  ];

  const defaultColumn = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      editable: true,
      fixed: 'left',
      width: 200,
      render: (text, record) => {
        const date = new Date(record.date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear().toString();
        return <span>{`${day}/${month}/${year}`}</span>;
      },
    },
    {
      title: 'Type of Call',
      dataIndex: 'typeOfCall',
      key: 'typeOfCall',
      editable: true,
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Ticket No',
      dataIndex: 'ticketNo',
      editable: true,
      fixed: 'left',
      width: 200,
    },
  ];
  const columns = [...defaultColumn, ...totalColumn];

  return (
    <>
      {/* <Loading visible={modalVisible} /> */}
      <Card>
        {/* <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">Your External Ticket List</h5>
          </div>
        </Card.Header> */}
        {/* <br /> */}
        {/* <Row className="g-2 mb-3">
          <Col md={6}>
            <label>Type of Call</label>
            <Select
              showSearch
              size="large"
              placeholder="Select a Tickets"
              optionFilterProp="children"
              filterOption={typeOfCall}
              onChange={handleChangeServices}
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps
              options={typeOfCall.map(type => ({ value: type, label: type }))}
              style={{
                width: '100%'
              }}
            />
          </Col>
        </Row> */}
      </Card>

      <Row>
        <IndividualListTable columns={columns} tableData={data} call={call} />
      </Row>
      <Row></Row>
    </>
  );
};
export default TicketList;
