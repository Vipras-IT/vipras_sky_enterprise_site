/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Select, Spin, Collapse } from 'antd';
import { formattedAmount, getMonthNames, monthNames } from 'helpers/utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get } from 'lodash';
import ImprestApi from 'api/Imprestholdertransaction';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { disableFutureDates } from 'helpers/utils';
import { Card } from 'react-bootstrap';
import ExpensesTable from './ExpensesTable';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
// import GstInvoiceTable from './gstInvoiceTable';

const SiteWisePlReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();
  //  const monthNameList = getMonthNames(todayDate.getFullYear());
  // const [monthOptions, setMonthOptions] = useState(monthNameList);
  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());

  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);
  const [searchType, setSearchType] = useState('siteName');
  const [searchKeyword, setSearchKeyword] = useState('');

  // const yearOptions = [
  //   {
  //     value: 2023,
  //     label: "2023",
  //   },
  //   {
  //     value: 2024,
  //     label: "2024",
  //   },
  //   {
  //     value: 2025,
  //     label: "2025",
  //   },
  //   {
  //     value: 2026,
  //     label: "2026",
  //   },
  // ];

  useEffect(() => {
    getSiteSalaryDetailsFinal();
  }, []);

  const getSiteSalaryDetailsFinal = () => {
    const month = currentMonth + 1;
    const year = currentYear;
    setModalVisible(true);
    getSiteSalaryDetails(month, year);
  };

  // useEffect(() => {
  //   const monthNameList = getPreviousMonthNames(currentYear);
  //   setMonthOptions(monthNameList);
  // }, [currentYear]);
  const renderRoundOf = (value) => {
    return typeof value === 'number' && !isNaN(value)
      ? Math.round(value) // Round to the nearest integer if it's a valid number
      : 0; // Return 0 if the value is not a valid number
  };

  const totalColumn = [
    {
      title: 'BILLING DUTY',
      dataIndex: 'billingDuty',
      key: 'billingDuty',
      width: 120,
      render: renderRoundOf,
    },
    {
      title: 'ATTENDANCE DUTY',
      dataIndex: 'attendanceDuty',
      key: 'attendanceDuty',
      width: 140,
      render: renderRoundOf,
    },
    {
      title: 'DIFFERENTS DUTY',
      dataIndex: 'differentDuty',
      key: 'differentDuty',
      width: 130,
      render: (text, record) => {
        const billingDuty = record.billingDuty || 0;
        const attendanceDuty = record.attendanceDuty || 0;
        const differentDuty = billingDuty - attendanceDuty;
        return renderRoundOf(differentDuty);
      },
    },
    {
      title: 'BILLING AMOUNT',
      dataIndex: 'billingAmount',
      key: 'billingAmount',
      width: 120,
      // render: renderRoundOf
      render: (text) => <>{formattedAmount(renderRoundOf(text ?? 0))}</>,
    },
    {
      title: 'GROSS SALARY',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
      width: 120,
      // render: renderRoundOf
      render: (text) => <>{formattedAmount(renderRoundOf(text ?? 0))}</>,
    },
    {
      title: 'DIFFERENTS AMOUNT',
      dataIndex: 'differentAmount',
      key: 'differentAmount',
      width: 130,
      render: (text, record) => {
        const billingDuty = record.billingAmount || 0;
        const attendanceDuty = record.grossSalary || 0;
        const differentDuty = billingDuty - attendanceDuty;
        const finalData = renderRoundOf(differentDuty);
        return formattedAmount(finalData);
      },
    },
    {
      title: 'SITE EXPENSES',
      dataIndex: 'siteExpenses',
      key: 'siteExpenses',
      width: 120,
      // render: renderRoundOf
      render: (text) => <>{formattedAmount(renderRoundOf(text ?? 0))}</>,
    },
    {
      title: 'ESI',
      dataIndex: 'esi',
      key: 'esi',
      width: 80,
      // render: renderRoundOf
      render: (text) => <> {formattedAmount(renderRoundOf(text ?? 0))}</>,
    },
    {
      title: 'PF',
      dataIndex: 'pf',
      key: 'pf',
      width: 80,
      // render: renderRoundOf
      render: (text) => <> {formattedAmount(renderRoundOf(text ?? 0))}</>,
    },
    {
      title: 'BONUS',
      dataIndex: 'bonus',
      key: 'bonus',
      width: 100,
      render: (text, record) => (
        <>{formattedAmount(Math.round(record.bonus))}</>
      ),
    },
    {
      title: 'GROSS PROFIT',
      dataIndex: 'grossProfit',
      key: 'grossProfit',
      width: 120,
      render: (text, record) => (
        <>{formattedAmount(Math.round(record.grossProfit))}</>
      ),
    },
    {
      title: 'OH EXPENSES',
      dataIndex: 'ohExpenses',
      key: 'ohExpenses',
      width: 130,
      render: (text, record) => (
        <> {formattedAmount(Math.round(record.ohExpenses))}</>
      ),
    },
    {
      title: 'NET PROFIT',
      dataIndex: 'netProfit',
      key: 'netProfit',
      width: 100,
      render: (text, record) => (
        <>{formattedAmount(Math.round(record.netProfit))}</>
      ),
    },
  ];

  const defaultColumn = [
    {
      title: 'S.NO',
      dataIndex: 'sno',
      fixed: 'left',
      key: '',
      width: 100, // Small width for the serial number
      render: (text, record, index) => index + 1,
    },
    {
      title: 'SITE ID',
      dataIndex: 'siteId',
      key: 'siteId',
      editable: true,
      fixed: 'left',
      width: 100,
    },
    {
      title: 'SITE NAME',
      dataIndex: 'siteName',
      key: 'siteName',
      editable: true,
      fixed: 'left',
      width: 150,
    },
    {
      title: 'BRANCH CODE',
      dataIndex: 'branchCode',
      key: 'branchCode',
      editable: true,
      fixed: 'left',
      width: 150,
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

  const calculateTotal = (responseData, fieldName) => {
    return responseData.reduce(
      (accumulator, item) => accumulator + (item[fieldName] || 0),
      0,
    );
  };

  const getSiteSalaryDetails = (month, year) => {
    const monthName = monthNames.find((m) => m.value === month - 1)?.label;
    ImprestApi.getSiteProfitLose(monthName, year, searchType, searchKeyword)
      .then((response) => {
        const responseData = get(response, 'data.data.items', []);
        const finalTotal = [...responseData];
        finalTotal.push({
          siteId: 'TOTAL',
          billingDuty: calculateTotal(responseData, 'billingDuty'),
          billingAmount: calculateTotal(responseData, 'billingAmount'),
          attendanceDuty: calculateTotal(responseData, 'attendanceDuty'),
          grossSalary: calculateTotal(responseData, 'grossSalary'),
          siteExpenses: calculateTotal(responseData, 'siteExpenses'),
          esi: calculateTotal(responseData, 'esi'),
          pf: calculateTotal(responseData, 'pf'),
          bonus: calculateTotal(responseData, 'bonus'),
          grossProfit: calculateTotal(responseData, 'grossProfit'),
          ohExpenses: calculateTotal(responseData, 'ohExpenses'),
          netProfit: calculateTotal(responseData, 'netProfit'),
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
  // };

  // const handleChangeMonth = (value) => {
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
            <h5 className="mb-0 text-white">Site Wise Profit & Lose Reports</h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Collapse>
          <Panel header="Filters" key="1">
            <Row align="center me-3">
              <Col style={style} offset={1}>
                <Space wrap>
                  
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
                      <option value="siteName">SITE NAME </option>
                      <option value="siteId">SITE ID </option>
                      <option value="branchCode">BRANCH CODE </option>
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
          <ExpensesTable columns={columns} tableData={data} />
        </Row>
      </Card>
    </>
  );
};
export default SiteWisePlReport;
