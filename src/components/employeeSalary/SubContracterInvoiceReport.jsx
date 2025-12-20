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
import { getPreviousMonthNames } from 'helpers/utils';
import { Card } from 'react-bootstrap';
import GstInvoiceTable from './gstInvoiceTable';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const SubContracterInvoiceReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());

  const [value, setValue] = useState(todayDate);
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);
  const [searchType, setSearchType] = useState('siteName');
  const [searchKeyword, setSearchKeyword] = useState('');
  
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
  siteIdsOptions.push({ value: 'ALL', label: 'ALL' });
  const [currentSiteId, setCurrentSiteId] = useState(
    get(siteIdsOptions[0], 'value', ''),
  );

  useEffect(() => {
    getSiteSalaryDetailsFinal();
  }, []);

  const getSiteSalaryDetailsFinal = () => {
    const currentMonthNames = monthList[currentMonth];
    const currentMonthLabel = `${currentMonthNames}-${currentYear}`;
    console.log('Current Month Label:', currentMonthLabel);

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
      title: 'SUB CONTRACTOR NAME',
      dataIndex: 'subContractor',
      key: 'subContractor',
      width: 60,
    },
    {
      title: "TOTAL DUTY",
      dataIndex: 'totalDuty',
      key: 'totalDuty',
      width: 60,
    },
    {
      title: 'SUB CONTRACTOR ID',
      dataIndex: 'subContractorId',
      key: 'subContractorId',
      width: 60,
    },
    {
      title: 'INVOICE NO',
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
      title: 'TOTAL AMOUNT',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 60,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
  ];

  const defaultColumn = [
    {
      title: 'INVOICE DATE',
      dataIndex: 'date',
      key: 'date',
      editable: true,
      fixed: 'left',
      width: 50,
      render: (text, record) => {
        const date = new Date(record.date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear().toString();
        return <span>{`${day}/${month}/${year}`}</span>;
      },
    },
    {
      title: 'UNIT NAME',
      dataIndex: 'siteName',
      key: 'siteName',
      editable: true,
      fixed: 'left',
      width: 60,
    },
    {
      title: 'UNIT ID',
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
      .SubContracterInvoiceReportBySiteId(
        currentMonthLabel,
        searchType,
        searchKeyword,
      )
      .then((response) => {
        const responseData = get(response, 'data.data.items', []);
        const totalAmount = responseData.reduce(
          (accumulator, item) => accumulator + (item.totalAmount || 0),
          0,
        );
        const totalTaxAmount = responseData.reduce(
          (accumulator, item) => accumulator + (item.totalTaxAmount || 0),
          0,
        );
        const finalTotal = [...responseData];
        finalTotal.push({
          siteName: 'TOTAL',
          date: new Date(),
          poDate: new Date(),
          totalTaxAmount: totalTaxAmount,
          totalAmount: totalAmount,
        });
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
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  // const handleChangeYear = (value) => {
  //   setCurrentYear(value);
  //   console.log(value);
  // };

  // const handleChangeMonth = (value) => {
  //   const currentMonthName = monthNames[value].value;
  //   const currentMonthNameslabel = monthNames[value].label;
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
            <h5 className="mb-0 text-white">Sub-Contracter Invoice Reports</h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Collapse>
          <Panel header="Filter" key="1">
            <Row align="center me-3">
              <Col style={style} offset={1}>
                <Space wrap>
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
                      <option value="siteName">UNIT NAME</option>
                      <option value="siteId">UNIT ID</option>
                      <option value="subContractor">SUB CONTRACTOR NAME</option>
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
                </Space>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <Row>
          <GstInvoiceTable
            columns={columns}
            tableData={data}
            currentSiteId={currentSiteId}
            currentMonth={currentMonth}
            currentYear={currentYear}
          />
        </Row>
      </Card>
    </>
  );
};
export default SubContracterInvoiceReport;
