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
import ProfitLossTable from 'components/employeeSalary/profitLossTable';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const ProfitLossReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();

  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    getSiteSalaryDetailsFinal();
  }, []);

  const getSiteSalaryDetailsFinal = () => {
    const month = currentMonth;
    const year = currentYear;

    setModalVisible(true);
    getSiteSalaryDetails(month, year);
  };

  const totalColumn = [
    {
      title: 'BILLING AMOUNT ',
      dataIndex: 'billingAmount',
      key: 'billingAmount',
      width: 60,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'SALARY PAID',
      dataIndex: 'grossSalaryPaid',
      key: 'grossSalaryPaid',
      width: 50,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'PENDING SALARY',
      dataIndex: 'pendingSalary',
      key: 'pendingSalary',
      width: 55,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'EXPENSES',
      dataIndex: 'siteExpenses',
      key: 'siteExpenses',
      width: 55,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'GROSS PROFIT',
      dataIndex: 'grossProfit',
      key: 'grossProfit',
      width: 60,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'OVER HEAD EXPENSES',
      dataIndex: 'overHeadExpenses',
      key: 'overHeadExpenses',
      width: 60,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'NET PROFIT',
      dataIndex: 'netProfit',
      key: 'netProfit',
      width: 60,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
  ];

  const defaultColumn = [
    {
      title: 'S.NO',
      dataIndex: 'sno',
      fixed: 'left',
      key: '',
      width: 20,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'UNIT CODE',
      dataIndex: 'siteId',
      key: 'siteId',
      editable: true,
      fixed: 'left',
      width: 40,
    },
    {
      title: 'UNIT NAME',
      dataIndex: 'siteName',
      key: 'siteName',
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

  const calculateTotalAmount = (data, field) => {
    return data.reduce(
      (accumulator, item) => accumulator + (Number(item[field]) || 0),
      0,
    );
  };

  const getSiteSalaryDetails = (month, year) => {
    invoiceApi
      .getProfitLossReport(month, year)
      .then((response) => {
        const responseData = get(response, 'data.data', []);
        console.log(responseData);

        const finalTotal = [...responseData];
        finalTotal.push({
          siteId: 'TOTAL',
          // siteName: 'TOTAL',
          siteExpenses: formattedAmount(
            calculateTotalAmount(responseData, 'siteExpenses'),
          ),
          grossSalaryPaid: formattedAmount(
            calculateTotalAmount(responseData, 'grossSalaryPaid'),
          ),
          pendingSalary: formattedAmount(
            calculateTotalAmount(responseData, 'pendingSalary'),
          ),
          billingAmount: formattedAmount(
            calculateTotalAmount(responseData, 'billingAmount'),
          ),
          grossProfit: formattedAmount(
            calculateTotalAmount(responseData, 'grossProfit'),
          ),
          overHeadExpenses: formattedAmount(
            calculateTotalAmount(responseData, 'overHeadExpenses'),
          ),
          netProfit: formattedAmount(
            calculateTotalAmount(responseData, 'netProfit'),
          ),
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
            <h5 className="mb-0 text-white">Profit And Loss Report</h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Collapse>
          <Panel header="Filter" key="1">
            <Row align="center">
              <Col style={style} offset={1}>
                <Space wrap>
                  <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 px-5">
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
                      >
                        {['Name', 'Designation', 'EMP Id'].map((pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            {pageSize}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div>
                      <InputGroup className=" input-search-width">
                        <FormControl
                          size="sm"
                          id="search"
                          type="search"
                          className="shadow-none"
                          placeholder="Search"
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
                  </div>
                </Space>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <Row>
          <ProfitLossTable columns={columns} tableData={data} />
        </Row>
      </Card>
    </>
  );
};
export default ProfitLossReport;
