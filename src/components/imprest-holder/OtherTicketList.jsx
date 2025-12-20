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

const OtherTicketList = ({ call }) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
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

  const options = [
    { label: 'GOOGLE AD', value: 'google_ad' },
    { label: 'WEBSITE', value: 'website' },
    { label: 'CAR', value: 'car' },
    { label: 'OUTDOOR ', value: 'outDoor' },
    { label: 'EMAIL & SMS  ', value: 'emailAndSms' },
    { label: 'SOCIAL MEDIA', value: 'social_media' },
    { label: 'YOUTUBE', value: 'youtube' },
  ];
  return (
    <>
      <Card></Card>

      <Row>
        <IndividualListTable columns={columns} tableData={data} call={call} />
      </Row>
      <Row></Row>
    </>
  );
};
export default OtherTicketList;
