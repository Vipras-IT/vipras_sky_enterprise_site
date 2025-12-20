/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Row } from 'antd';
import { get, isEmpty } from 'lodash';
import employeeAPI from 'api/crm';
import { useAuth } from 'hooks/useAuth';
import Loading from 'components/attendance/Loading';
import LeadListTable from './LeadListTable';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const LeadList = (typeofCall) => {
  // console.log(typeofCall.typeofCall);
  const call = typeofCall.typeofCall;
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const siteIdsOptions = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      value: siteIdArray[0],
      label: item,
    });
  });

  useEffect(() => {
    const token = get(user, 'token');
    setModalVisible(true);
    employeeAPI
      .getCrm(token)
      .then((response) => {
        const responseData = get(response, 'data.data.items', []);
        const filteredData = responseData.filter(
          (item) => item.typeOfCall === call,
        );

        if (filteredData.length === 0) {
          toast.error('No content available for ' + call, {
            theme: 'colored',
          });
        } else {
          setData(filteredData);
        }
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setModalVisible(false);
      });
  }, [typeofCall]);

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

  if (isEmpty(data)) {
    return <Loading visible={true} />;
  }

  return (
    <>
      <Loading visible={modalVisible} />
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">Lead List</h5>
          </div>
        </Card.Header>
      </Card>

      <Row>
        <LeadListTable columns={columns} tableData={data} />
      </Row>
      <Row></Row>
    </>
  );
};
export default LeadList;
