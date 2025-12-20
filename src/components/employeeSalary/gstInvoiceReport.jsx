/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Spin, Collapse } from 'antd';
import { formattedAmount, disableFutureDates, monthNames } from 'helpers/utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get } from 'lodash';
import invoiceApi from 'api/invoiceApi';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { Card } from 'react-bootstrap';
import GstInvoiceTable from './gstInvoiceTable';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const GstInvoiceReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();

  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);
  const [searchType, setSearchType] = useState('siteName');
  const [searchKeyword, setSearchKeyword] = useState('');


  useEffect(() => {
    getSiteSalaryDetailsFinal();
  }, []);

  const getSiteSalaryDetailsFinal = () => {
    const currentMonthNames = monthList[currentMonth];
    const currentMonthLabel = `${currentMonthNames}-${currentYear}`;
    setModalVisible(true);
    getSiteSalaryDetails(currentMonthLabel);
  };

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

  // useEffect(() => {
  //   const monthNameList = getPreviousMonthNames(currentYear);
  //   setMonthOptions(monthNameList);
  // }, [currentYear]);

  const totalColumn = [
    {
      title: 'INVOICE NO',
      dataIndex: 'gstInvoiceNo',
      key: 'gstInvoiceNo',
      // editable: true,
      // fixed: 'left',
      width: 50,
      // render: (text, record) => {
      //   if (record.isGstInvoice === true) {
      //     return record.gstInvoiceNo;
      //   } else {
      //     return record.invoiceNo;
      //   }
      // }
    },
    {
      title: 'GST NUMBER',
      dataIndex: 'gstNumber',
      // editable: true,
      // fixed: 'left',
      width: 55,
    },
    {
      title: 'PO DATE',
      dataIndex: 'poDate',
      width: 55,
      render: (text, record) => {
        if (record.poDate) {
          const date = new Date(record.poDate);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear().toString();
          return <span>{`${day}/${month}/${year}`}</span>;
        }
        return '';
      },
    },
    {
      title: 'PO NUMBER',
      dataIndex: 'poNumber',
      width: 55,
    },
    {
      title: 'TAXABLE AMOUNT',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 80,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'TAX AMOUNT',
      dataIndex: 'totalTaxAmount',
      key: 'totalTaxAmount',
      width: 80,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'GRAND TOTAL AMOUNT',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      width: 80,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'TOTAL DUTY',
      dataIndex: 'totalDuty',
      key: 'totalDuty',
      width: 60,
    },
  ];

  const defaultColumn = [
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      editable: true,
      fixed: 'left',
      width: 50,
      render: (text, record) => {
        if (record.date === 'TOTAL') {
          return <span>TOTAL</span>;
        }
        const date = new Date(record.date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear().toString();
        return <span>{`${day}/${month}/${year}`}</span>;
      },
    },
    {
      title: 'SITE NAME',
      dataIndex: 'siteName',
      key: 'siteName',
      editable: true,
      fixed: 'left',
      width: 60,
      // render: (text, record) =>
      //   record.siteName ? record.siteName : record.clientName
    },
    {
      title: 'SITE ID',
      dataIndex: 'siteId',
      key: 'siteId',
      editable: true,
      fixed: 'left',
      width: 60,
      // render: (text, record) =>
      //   record.siteId ? record.siteId : record.clientAddress
    },
  ];
  const columns = [...defaultColumn, ...totalColumn];

  const onClickExportAsExcel = () => {
    const currentMonthName = monthNames[currentMonth].label;

    const dataToExport = data.map((record) =>
      columns.map((column) => {
        const value = get(record, column.dataIndex, '');

        // Handle nested invoieBreakUP case
        //   if (Array.isArray(value)) {
        //     // Join or sum the totalAmount values from invoieBreakUP
        //     return value
        //       .map(item => item.role + ': ' + item.totalAmount)
        //       .join(', ');
        //   }
        //   return value;
        // })

        if (column.dataIndex === 'invoieBreakUP' && Array.isArray(value)) {
          // Calculate the totalAmount
          const total = value.reduce(
            (sum, item) => sum + (item.totalAmount || 0),
            0,
          );
          return formattedAmount(total); // Use the same formatting function
        }

        if (Array.isArray(value)) {
          // Handle other nested arrays, if any
          return value
            .map((item) => item.role + ': ' + item.totalAmount)
            .join(', ');
        }

        return value;
      }),
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

    saveAs(blob, 'Invoice.xlsx');
  };

  const getSiteSalaryDetails = (currentMonthLabel) => {
    invoiceApi
      .InvoiceReportBySiteId(currentMonthLabel, searchType, searchKeyword)
      .then((response) => {
        const responseData = get(response, 'data.data.items', []);

        // Filter out records where totalAmount === 0
        const filteredData = responseData.filter(
          (record) => record.totalAmount !== null,
        );

        // Calculate total amount from the filtered data
        const totalAmount = filteredData.reduce(
          (accumulator, item) => accumulator + (item.totalAmount || 0),
          0,
        );

        // Calculate total tax amount
        const totalTaxAmount = filteredData.reduce(
          (accumulator, item) => accumulator + (item.totalTaxAmount || 0),
          0,
        );

        const defaultDate = 'TOTAL';

        const allInvoiceBreakUP = responseData
          .filter((data) => Array.isArray(data?.invoieBreakUP))
          .flatMap((data) => data.invoieBreakUP || []);

        // Prepare final total data with the 'TOTAL' row
        const finalTotal = [...filteredData];
        finalTotal.push({
          date: defaultDate,
          totalTaxAmount,
          totalAmount,
          invoieBreakUP: allInvoiceBreakUP,
        });

        // Set the data and close the modal
        setData(finalTotal);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setModalVisible(false);
      });
  };

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(monthNames[month].value);
    setCurrentYear(year);
  };

  // const handleChangeYear = value => {
  //   setCurrentYear(value);
  //   console.log(value);
  // };

  // const handleChangeMonth = value => {
  //   const currentMonthName = monthNames[value].value;
  //   setCurrentMonth(currentMonthName);
  // };

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
  const { Panel } = Collapse;
  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">Invoice Reports</h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Collapse>
          <Panel header="Filter" key="1">
            <Row align="center">
              <Col style={style} offset={1} gap={3}>
                <Space wrap>
                  <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 px-5">
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
                      format="MMM yyyy"
                      caretAs={BsCalendar2MonthFill}
                      value={value}
                      onChange={handleChange}
                      shouldDisableDate={disableFutureDates}
                    />
                    <div>
                      <Form.Select
                        size="sm"
                        className="me-2 width-15"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                      >
                        <option value="siteName">SITE NAME</option>
                        <option value="siteId">SITE ID</option>
                        <option value="gstInvoiceNo">GST INVOICE NO</option>
                      </Form.Select>
                    </div>
                    <div>
                      <InputGroup className=" input-search-width">
                        <FormControl
                          size="sm"
                          id="search"
                          type="search"
                          className="shadow-none"
                          placeholder={`Search by ${searchType}`}
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                      </InputGroup>
                    </div>
                    {/* <Button
                      size="sm"
                      variant="outline-secondary"
                      className="border-300 hover-border-secondary"
                      style={{ height: 'auto' }}
                      onClick={getSiteSalaryDetailsFinal}
                    >
                      <FontAwesomeIcon icon="search" className="fs--1" />
                    </Button> */}
                    <IconButton
                      variant="primary"
                      size="sm"
                      icon="search"
                      transform="shrink-3"
                      onClick={getSiteSalaryDetailsFinal}
                    >
                      <span className="d-none d-sm-inline-block ms-1">
                        Search
                      </span>
                    </IconButton>
                    <div id="orders-actions">
                      <IconButton
                        variant="primary"
                        size="sm"
                        icon="external-link-alt"
                        transform="shrink-3"
                        onClick={onClickExportAsExcel}
                      >
                        <span className="d-none d-sm-inline-block ms-1">
                          Export
                        </span>
                      </IconButton>
                    </div>
                  </div>
                </Space>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <Row>
          <GstInvoiceTable
            columns={columns}
            tableData={data}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        </Row>
      </Card>
    </>
  );
};
export default GstInvoiceReport;
