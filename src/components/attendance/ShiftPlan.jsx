/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Select, Spin, DatePicker } from 'antd';
import { getMonthNames, monthNames } from 'helpers/utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get } from 'lodash';
import invoiceApi from 'api/invoiceApi';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { getPreviousMonthNames } from 'helpers/utils';
import { Card } from 'react-bootstrap';
import GstInvoiceTable from 'components/employeeSalary/gstInvoiceTable';

const ShiftPlan = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();
  const monthNameList = getMonthNames(todayDate.getFullYear());
  const [monthOptions, setMonthOptions] = useState(monthNameList);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());

  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);

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

  const [department, setDepartment] = useState('');
  const [fromDate, setFromDate] = React.useState();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  useEffect(() => {
    const month = currentMonth;
    const year = currentYear;
    const currentMonthNames = monthList[currentMonth];
    const currentMonthLabel = `${currentMonthNames}-${currentYear}`;
    console.log('Current Month Label:', currentMonthLabel);
    setModalVisible(true);
    getSiteSalaryDetails(currentMonthLabel);
  }, [currentMonth, currentYear]);
  const monthList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    const monthNameList = getPreviousMonthNames(currentYear);
    setMonthOptions(monthNameList);
  }, [currentYear]);

  const totalColumn = [
    {
      title: 'DESIGNATION',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      width: 50,
      render: (text, record) => {
        if (record.isGstInvoice === true) {
          return record.gstInvoiceNo;
        } else {
          return record.invoiceNo;
        }
      },
    },
    {
      title: 'SITE ID',
      dataIndex: 'gstNumber',
      width: 55,
    },
    {
      title: 'SITE NAME',
      dataIndex: 'poDate',
      width: 55,
      render: (text, record) => {
        const date = new Date(record.poDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear().toString();
        return <span>{`${day}/${month}/${year}`}</span>;
      },
    },
    {
      title: 'PHONE NUMBER',
      dataIndex: 'poNumber',
      width: 55,
    },
    {
      title: 'SHIFT',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 60,
    },
  ];

  const defaultColumn = [
    // {
    //   title: 'DATE',
    //   dataIndex: 'date',
    //   key: 'date',
    //   editable: true,
    //   fixed: 'left',
    //   width: 50,
    //   render: (text, record) => {
    //     const date = new Date(record.date);
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const year = date.getFullYear().toString();
    //     return <span>{`${day}/${month}/${year}`}</span>;
    //   }
    // },
    {
      title: 'EMPLOYEE NAME',
      dataIndex: 'siteName',
      key: 'siteName',
      editable: true,
      fixed: 'left',
      width: 60,
    },
    {
      title: 'EMPLOYEE ID',
      dataIndex: 'siteId',
      key: 'siteId',
      editable: true,
      fixed: 'left',
      width: 60,
    },
  ];
  const columns = [...defaultColumn, ...totalColumn];

  const onClickExportAsExcel = () => {
    const currentMonthName = monthNames[currentMonth].label;
    const dataToExport = data.map((record) =>
      columns.map((column) => get(record, column.dataIndex, '')),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([
      columns.map((column) => column.title),
      ...dataToExport,
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, currentMonthName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'Salary.xlsx');
  };

  const getSiteSalaryDetails = (currentMonthLabel) => {
    invoiceApi
      .InvoiceReportBySiteId(currentMonthLabel)
      .then((response) => {
        const responseData = get(response, 'data.data.items', []);
        console.log(responseData);
        // const filteredData = responseData.map(item => {
        //   if (item.isGstInvoice === true) {
        //     const { invoiceNo, ...rest } = item;
        //     return rest;
        //   } else {
        //     const { gstInvoiceNo, ...rest } = item;
        //     return rest;
        //   }
        // });
        setData(responseData);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setModalVisible(false);
      });
  };

  const handleChangeYear = (value) => {
    setCurrentYear(value);
    console.log(value);
  };

  const handleChangeMonth = (value) => {
    const currentMonthName = monthNames[value].value;
    setCurrentMonth(currentMonthName);
  };

  const style = {
    padding: '8px 0',
  };

  if (modalVisible) {
    return (
      <div className="text-center">
        <Spin size="large" />
      </div>
    );
  }
  const departmentOptions = [
    { label: 'MANAGEMENT', value: 'MANAGEMENT' },
    {
      label: 'FACILITY MANAGER / HELPDESK',
      value: 'FACILITY MANAGER / HELPDESK',
    },
    { label: 'TECHNICAL', value: 'TECHNICAL' },
    { label: 'HOUSE KEEPING', value: 'HOUSE KEEPING' },
    { label: 'SECURITY', value: 'SECURITY' },
    { label: 'MANPOWER', value: 'MANPOWER' },
  ];

  const facilityOptions = [
    { label: 'FACILITY MANAGER', value: 'FACILITY MANAGER' },
    {
      label: 'HELPDESK',
      value: 'HELPDESK',
    },
    { label: 'FACILITY ENGINEER', value: 'FACILITY ENGINEER' },
    { label: 'PROPERTY MANAGER', value: 'PROPERTY MANAGER' },
  ];

  const technicalOptions = [{ label: 'GYM TRAINER', value: 'GYM TRAINER' }];

  const securityOptions = [
    { label: 'SECURITY OFFICER', value: 'SECURITY OFFICER' },
    {
      label: 'ASSISTANT SECURITY OFFICER',
      value: 'ASSISTANT SECURITY OFFICER',
    },
    { label: 'HEAD GUARD', value: 'HEAD GUARD' },
    { label: 'SECURITY GUARD', value: 'SECURITY GUARD' },
    { label: 'LADY GUARD', value: 'LADY GUARD' },
    { label: 'SENIOR SECURITY GUARD', value: 'SENIOR SECURITY GUARD' },
    { label: 'JUNIOR SECURITY GUARD', value: 'JUNIOR SECURITY GUARD' },
    { label: 'LIFT GUARD', value: 'LIFT GUARD' },
    { label: 'FIRE GUARD', value: 'FIRE GUARD' },
  ];

  const houseOptions = [
    { label: 'HOUSE KEEPING', value: 'HOUSE KEEPING' },
    {
      label: 'HOUSE KEEPING MALE',
      value: 'HOUSE KEEPING MALE',
    },
    { label: 'HOUSE KEEPING FEMALE', value: 'HOUSE KEEPING FEMALE' },
    { label: 'SUPERVISOR HOUSE KEEPING', value: 'SUPERVISOR HOUSE KEEPING' },
    { label: 'GARDENER', value: 'GARDENER' },
    { label: 'SUPERVISOR GARDENER', value: 'SUPERVISOR GARDENER' },
    { label: 'PEST CONTROLLER', value: 'PEST CONTROLLER' },
  ];

  const manpowerOptions = [
    { label: 'SUPERVISOR MANPOWER', value: 'SUPERVISOR MANPOWER' },
    {
      label: 'CL',
      value: 'CL',
    },
    { label: 'DEEP CLEANING MANPOWER', value: 'DEEP CLEANING MANPOWER' },
    { label: 'DEEP CLEANING SUPERVISOR', value: 'DEEP CLEANING SUPERVISOR' },
    { label: 'SKILLED LABOUR', value: 'SKILLED LABOUR' },
    { label: 'UNSKILLED LABOUR', value: 'UNSKILLED LABOUR' },
  ];

  const shiftManager = [
    { label: 'SHIFT A', value: 'SHIFT A' },
    {
      label: 'SHIFT B',
      value: 'SHIFT B',
    },
    { label: 'SHIFT C', value: 'SHIFT C' },
    { label: 'SHIFT G', value: 'SHIFT G' },
    { label: 'SHIFT D', value: 'SHIFT D' },
    { label: 'SHIFT N', value: 'SHIFT N' },
  ];

  const shiftFacilityManager = [
    { label: 'SHIFT A', value: 'SHIFT A' },
    {
      label: 'SHIFT B',
      value: 'SHIFT B',
    },
    { label: 'SHIFT C', value: 'SHIFT C' },
    { label: 'SHIFT G', value: 'SHIFT G' },
  ];

  const shiftTechnical = [
    { label: 'SHIFT A', value: 'SHIFT A' },
    {
      label: 'SHIFT B',
      value: 'SHIFT B',
    },
    { label: 'SHIFT C', value: 'SHIFT C' },
    { label: 'SHIFT G', value: 'SHIFT G' },
  ];

  const shiftHouseKeeping = [
    { label: 'SHIFT A', value: 'SHIFT A' },
    {
      label: 'SHIFT B',
      value: 'SHIFT B',
    },
    { label: 'SHIFT G', value: 'SHIFT G' },
  ];

  const shiftSecurity = [
    { label: 'SHIFT D', value: 'SHIFT D' },
    {
      label: 'SHIFT N',
      value: 'SHIFT N',
    },
  ];

  const shiftManPower = [{ label: 'SHIFT G', value: 'SHIFT G' }];

  const getOptionsByDepartment = () => {
    return department === 'MANAGEMENT'
      ? securityOptions
      : department === 'FACILITY MANAGER / HELPDESK'
        ? facilityOptions
        : department === 'TECHNICAL'
          ? technicalOptions
          : department === 'HOUSE KEEPING'
            ? houseOptions
            : department === 'SECURITY'
              ? securityOptions
              : department === 'MANPOWER'
                ? manpowerOptions
                : [];
  };

  const getOptionsByShift = () => {
    return department === 'MANAGEMENT'
      ? shiftManager
      : department === 'FACILITY MANAGER / HELPDESK'
        ? shiftFacilityManager
        : department === 'TECHNICAL'
          ? shiftTechnical
          : department === 'HOUSE KEEPING'
            ? shiftHouseKeeping
            : department === 'SECURITY'
              ? shiftSecurity
              : department === 'MANPOWER'
                ? shiftManPower
                : [];
  };

  const handleChangedepartment = (value) => {
    setDepartment(value);
  };
  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };
  const handleOptionChangeShift = (value) => {
    setSelectedShift(value);
  };

  const FromDateChange = (date) => {
    setFromDate(date);
  };
  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">Shift Plan</h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Row align="end me-3">
          <Col style={style} offset={1}>
            <Space wrap>
              <Select
                showSearch
                defaultValue={department}
                placeholder="Select a department"
                optionFilterProp="children"
                onChange={handleChangedepartment}
                options={departmentOptions}
                style={{
                  width: 250,
                }}
              />
              <Select
                showSearch
                defaultValue={selectedOption}
                placeholder="Select a role"
                optionFilterProp="children"
                onChange={handleOptionChange}
                options={getOptionsByDepartment()}
                style={{
                  width: 250,
                }}
              />

              <Select
                showSearch
                defaultValue={selectedShift}
                placeholder="Select a role"
                optionFilterProp="children"
                onChange={handleOptionChangeShift}
                options={getOptionsByShift()}
                style={{
                  width: 250,
                }}
              />

              {/* <Select
                defaultValue={currentYear}
                style={{
                  width: 120
                }}
                onChange={handleChangeYear}
                options={yearOptions}
              />
              <Select
                defaultValue={currentMonth}
                value={currentMonth}
                style={{
                  width: 120
                }}
                onChange={handleChangeMonth}
                options={monthOptions}
              /> */}
              <DatePicker
                size="small"
                value={fromDate}
                onChange={FromDateChange}
                style={{
                  width: 250,
                  height: 30,
                }}
              />
              <div id="orders-actions">
                <IconButton
                  variant="primary"
                  size="sm"
                  icon="external-link-alt"
                  transform="shrink-3"
                  onClick={onClickExportAsExcel}
                >
                  <span className="d-none d-sm-inline-block ms-1">Export</span>
                </IconButton>
              </div>
            </Space>
          </Col>
        </Row>
        <Row>
          <GstInvoiceTable
            columns={columns}
            tableData={data}
            // currentSiteId={currentSiteId}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        </Row>
      </Card>
    </>
  );
};
export default ShiftPlan;
