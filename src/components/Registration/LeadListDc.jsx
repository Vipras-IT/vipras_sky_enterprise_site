/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Select, Button } from 'antd';
import { getMonthNames, monthNames } from 'helpers/utils';
import useAPI from 'hooks/useApi';
import { get, isEmpty } from 'lodash';
import siteAPI from 'api/siteCreation';
import employeeAPI from 'api/crm';
import { useAuth } from 'hooks/useAuth';
import Loading from 'components/attendance/Loading';
import { getPreviousMonthNames } from 'helpers/utils';
import LeadListTable from './LeadListTable';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const LeadListDc = (typeofCall) => {
  const call = typeofCall.typeofCall;
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();
  const monthNameList = getMonthNames(todayDate.getFullYear());
  const [monthOptions, setMonthOptions] = useState(monthNameList);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const getSiteAPI = useAPI(siteAPI.getSitedetailsBySiteCode);
  const [modalVisible, setModalVisible] = useState(false);

  const yearOptions = [
    {
      value: 2023,
      label: '2023',
    },
    {
      value: 2024,
      label: '2024',
    },
    {
      value: 2025,
      label: '2025',
    },
    {
      value: 2026,
      label: '2026',
    },
  ];
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
  const [currentSiteId, setCurrentSiteId] = useState(
    get(siteIdsOptions[0], 'value', ''),
  );

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
          toast.error('No content available for DC_CALL', {
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

  useEffect(() => {
    const monthNameList = getPreviousMonthNames(currentYear);
    setMonthOptions(monthNameList);
  }, [currentYear]);

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
      title: 'Address',
      dataIndex: 'esiNumber',
      key: 'esiNumber',
      width: 150,
    },
    { title: 'Type of work', dataIndex: 'fine', key: 'fine', width: 130 },
    { title: 'Nature of Work', dataIndex: 'others', key: 'others', width: 150 },
    {
      title: 'Booking Amount',
      dataIndex: 'attendanceBonus',
      key: 'attendanceBonus',
      width: 150,
    },
    {
      title: 'Confirmed Date',
      dataIndex: 'pfPercentage',
      key: 'pfPercentage',
      width: 180,
    },
    {
      title: 'Confirmed By',
      dataIndex: 'esiPercentage',
      key: 'esiPercentage',
      width: 140,
    },
    {
      title: 'Order Assigned To',
      dataIndex: 'pfAmount',
      key: 'pfAmount',
      width: 170,
    },
    {
      title: 'No.of Manpower Deployed',
      dataIndex: 'esiAmount',
      key: 'esiAmount',
      width: 150,
    },
    {
      title: 'Payment Mode',
      dataIndex: 'fixedSalary',
      key: 'fixedSalary',
      width: 150,
    },
    {
      title: 'To Whom',
      dataIndex: 'numberofDuty',
      key: 'numberofDuty',
      width: 120,
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
export default LeadListDc;
