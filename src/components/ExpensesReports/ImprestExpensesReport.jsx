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

const ImprestExpensesReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [value, setValue] = useState(todayDate);
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);

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
    const month = currentMonth;
    const year = currentYear;
    setModalVisible(true);
    getSiteSalaryDetails(month, year);
  };

  const totalColumn = [
    {
      title: 'EXPENSES',
      dataIndex: 'expenses',
      key: 'expenses',
      width: 10,
      sorter: (a, b) => a.expenses - b.expenses,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
      defaultSortOrder: 'descend',
    },
    {
      title: 'ADVANCE',
      dataIndex: 'advance',
      key: 'advance',
      width: 10,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'SALARY',
      dataIndex: 'salary',
      key: 'salary',
      width: 10,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'VENDOR',
      dataIndex: 'vendorPayment',
      key: 'vendorPayment',
      width: 10,
    },
    {
      title: 'IMPREST',
      dataIndex: 'imprest',
      key: 'imprest',
      width: 10,
    },
  ];

  const defaultColumn = [
    {
      title: 'S.NO',
      dataIndex: 'sno',
      fixed: 'left',
      key: '',
      width: 5,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'EMPLOYEE ID',
      dataIndex: 'imprestholderId',
      key: 'imprestholderId',
      editable: true,
      fixed: 'left',
      width: 10,
    },
    {
      title: 'EMPLOYEE NAME',
      dataIndex: 'imprestholderName',
      key: 'imprestholderName',
      editable: true,
      fixed: 'left',
      width: 20,
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

  const getSiteSalaryDetails = (month, year) => {
    ImprestApi.getImprestExpenses(month, year)
      .then((response) => {
        const responseData = get(response, 'data.data', []);

        const grandTotalAmount = responseData.reduce(
          (accumulator, item) => accumulator + (item.expenses || 0),
          0,
        );
        const TotalAdvance = responseData.reduce(
          (accumulator, item) => accumulator + (item.advance || 0),
          0,
        );
        const Totalsalary = responseData.reduce(
          (accumulator, item) => accumulator + (item.salary || 0),
          0,
        );

        const TotalVendorPayment = responseData.reduce(
          (accumulator, item) => accumulator + (item.vendorPayment || 0),
          0,
        );
        const TotalImprestPayment = responseData.reduce(
          (accumulator, item) => accumulator + (item.imprest || 0),
          0,
        );
        const finalTotal = [...responseData];
        finalTotal.push({
          imprestholderId: 0,
          imprestholderName: 'TOTAL',
          expenses: grandTotalAmount,
          advance: TotalAdvance,
          salary: Totalsalary,
          vendorPayment: TotalVendorPayment,
          imprest: TotalImprestPayment,
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
    console.log(month, year);
    
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
            <h5 className="mb-0 text-white">Imprest Expenses Report</h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Collapse>
          <Panel header="Filter" key="1">
            <Row align="center me-3">
              <Col style={style} offset={1}>
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 px-5">
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
                  </Space>
                </div>
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
export default ImprestExpensesReport;
