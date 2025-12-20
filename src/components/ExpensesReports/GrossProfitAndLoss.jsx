/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Spin } from 'antd';
import { formattedAmount, disableFutureDates, monthNames } from 'helpers/utils';
import SimpleBarReact from 'simplebar-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get, upperCase } from 'lodash';
import invoiceApi from 'api/invoiceApi';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { getPreviousMonthNames } from 'helpers/utils';
import { Card, Table } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';


const GrossProfitAndLoss = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();

  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);
  const [totalIncome, setTotalIncome] = useState();
  const [totalExpenses, setTotalExpenses] = useState();


  useEffect(() => {

    const month = currentMonth;
    const year = currentYear;

    setModalVisible(true);
    getSiteSalaryDetails(month, year);
  }, [value]);



  const totalColumn = [
    {
      title: 'EXPENSES',
      dataIndex: 'totalExpenses',
      key: 'totalExpenses',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'GST',
      dataIndex: 'totalGst',
      key: 'totalGst',
      width: 50,
      render: (text) => Math.round(text),
    },
    {
      title: 'ESI',
      dataIndex: 'totalEsi',
      key: 'totalEsi',
      width: 55,
      render: (text) => Math.round(text),
    },
    {
      title: 'PF',
      dataIndex: 'totalPf',
      key: 'totalPf',
      width: 55,
      render: (text) => Math.round(text),
    },
    {
      title: 'LOAN / EMI',
      dataIndex: 'totalLoanEmi',
      key: 'totalLoanEmi',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'GROSS PROFIT ',
      dataIndex: 'totalGrossProfit',
      key: 'totalGrossProfit',
      width: 60,
      render: (text) => Math.round(text),
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
      title: 'GROSS BILLING',
      dataIndex: 'totalBilling',
      key: 'totalBilling',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'SALARY',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
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

    saveAs(blob, 'Gross-Profit-And-Loss.xlsx');
  };

  const getSiteSalaryDetails = (month, year) => {
    invoiceApi
      .getGrossProfitAndLoss(month, year)
      .then((response) => {
        const responseData = get(response, 'data.data', []);
        setData(responseData);
        const {
          expenses = 0,
          bonus = 0,
          grossSalary = 0,
          ohExpenses = 0,
          billingAmount = 0,
        } = responseData[0] || {};
        const totalExpenses = expenses + bonus + grossSalary + ohExpenses;
        setTotalExpenses(totalExpenses);
        setTotalIncome(billingAmount);
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

  const labels = [
    'GROSS BILLING',
    'GST BILLING',
    'SUB CONTRACTOR BILLING',
    'DEDUCTION FROM VIPRAS MART',
    'DEDUCTION FROM UNIFORM',
    'SALARY',
    'EXPENSES',
    'GST',
    'ESI',
    'PF',
    'LOAN / EMI',
    'GROSS PROFIT',
    'LIABILITY - HAND LOAN',
    'LIABILITY - OD RETURN',
    'LIABILITY - VENDOR PAYMENT',
    'LIABILITY - GST',
    'LIABILITY - ESI',
    'LIABILITY - PF',

  ];

  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white"> Gross Profit And Loss Report</h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Row align="middle">
          <Col style={style} span={13} offset={1}>
            <Space wrap>
              <DatePicker
                format="MMM yyyy"
                caretAs={BsCalendar2MonthFill}
                value={value}
                onChange={handleChange}
                shouldDisableDate={disableFutureDates}
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
        <Card className="mb-3" id="pdf-content">
          <Card.Body>
            <div className="fs--1">
              <SimpleBarReact>
                <Table className="border-bottom">
                  <thead className="light">
                    <tr className="bg-primary text-white dark__bg-1000 invoice-th">
                      <th className="border-0 fs-1">Particular</th>
                      <th className="border-0 text-center fs-1">Income</th>
                      <th className="border-0 text-center fs-1">Expenses</th>
                      <th className="border-0 text-center fs-1">Liability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      return labels.map((label, labelIndex) => {
                        let value = '';
                        switch (label) {
                          case 'GST BILLING':
                            value = formattedAmount(item.gstBilling);
                            break;
                          case 'SUB CONTRACTOR BILLING':
                            value = formattedAmount(item.subContractorBilling);
                            break;
                          case 'GROSS BILLING':
                            value = formattedAmount(item.totalBilling);
                            break;
                          case 'DEDUCTION FROM VIPRAS MART':
                            value = formattedAmount(item.totalViprasMart);
                            break;
                          case 'DEDUCTION FROM UNIFORM':
                            value = formattedAmount(item.totalUniform);
                            break;
                          case 'SALARY':
                            value = formattedAmount(item.totalSalary);
                            break;
                          case 'EXPENSES':
                            value = formattedAmount(item.totalExpenses);
                            break;
                          case 'GST':
                            value = formattedAmount(item.totalGst);
                            break;
                          case 'ESI':
                            value = formattedAmount(item.totalEsi);
                            break;
                          case 'PF':
                            value = formattedAmount(item.totalPf);
                            break;
                          case 'LOAN / EMI':
                            value = formattedAmount(item.totalLoanEmi);
                            break;
                          case 'GROSS PROFIT':
                            value = formattedAmount(item.totalGrossProfit);
                            break;
                          case 'LIABILITY - HAND LOAN':
                            value = formattedAmount(get(item, 'liabilityHandLoan', 0));
                            break;
                          case 'LIABILITY - OD RETURN':
                            value = formattedAmount(get(item, 'liabilityODReturn', 0));
                            break;
                          case 'LIABILITY - VENDOR PAYMENT':
                            value = formattedAmount(get(item, 'liabilityVendorPayment', 0));
                            break;
                          case 'LIABILITY - GST':
                            value = formattedAmount(get(item, 'liabilityGst', 0));
                            break;
                          case 'LIABILITY - ESI':
                            value = formattedAmount(get(item, 'liabilityEsi', 0));
                            break;
                          case 'LIABILITY - PF':
                            value = formattedAmount(get(item, 'liabilityPf', 0));
                            break;
                          default:
                            break;
                        }

                        return (
                          <tr key={`${label}-${index}`}>
                            <td className="align-middle">
                              <h6 className="mb-0 text-nowrap text-color-black  table-font">
                                {label}
                              </h6>
                            </td>
                            <td className="align-middle text-center table-font fw-bold">
                              {[
                                'GROSS BILLING',
                                'DEDUCTION FROM VIPRAS MART',
                                'DEDUCTION FROM UNIFORM',
                                'GST BILLING',
                                'SUB CONTRACTOR BILLING',
                              ].includes(label)
                                ? value
                                : ''}
                            </td>
                            <td className="align-middle text-center table-font fw-bold">
                              {![
                                'GROSS BILLING',
                                'DEDUCTION FROM VIPRAS MART',
                                'DEDUCTION FROM UNIFORM',
                                'GST BILLING',
                                'SUB CONTRACTOR BILLING',
                                'LIABILITY - HAND LOAN',
                                'LIABILITY - OD RETURN',
                                'LIABILITY - VENDOR PAYMENT',
                                'LIABILITY - GST',
                                'LIABILITY - ESI',
                                'LIABILITY - PF',
                              ].includes(label)
                                ? value
                                : ''}
                            </td>

                            <td className="align-middle text-center table-font fw-bold">
                            {[
                                'LIABILITY - HAND LOAN',
                                'LIABILITY - OD RETURN',
                                'LIABILITY - VENDOR PAYMENT',
                                'LIABILITY - GST',
                                'LIABILITY - ESI',
                                'LIABILITY - PF',
                              ].includes(label)
                                ? value
                                : ''}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </Table>
              </SimpleBarReact>
            </div>
          </Card.Body>
        </Card>
      </Card>
    </>
  );
};
export default GrossProfitAndLoss;
