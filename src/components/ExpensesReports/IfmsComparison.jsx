/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Spin } from 'antd';
import {
  formattedAmount,
  getMonthNames,
  monthNames,
  disableFutureDates,
} from 'helpers/utils';
import SimpleBarReact from 'simplebar-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get, upperCase } from 'lodash';
import invoiceApi from 'api/invoiceApi';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { Card, Table } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
// import ProfitLossTable from 'components/employeeSalary/profitLossTable';

const IfmsComparison = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();

  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());

  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    const month = currentMonth;
    const year = currentYear;

    setModalVisible(true);
    getSiteSalaryDetails(month, year);
  }, [value]);



  const defaultColumn = [
    {
      title: 'GROSS BILLING',
      dataIndex: 'billingAmount',
      key: 'billingAmount',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'SALARY',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'EXPENSES',
      dataIndex: 'expenses',
      key: 'expenses',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'BONUS',
      dataIndex: 'bonus',
      key: 'bonus',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'DEPARTMENT OH SALARY',
      dataIndex: 'departmentOHSalary',
      key: 'ohExpenses',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    // {
    //   title: 'DEPARTMENT OH EXPENSES',
    //   dataIndex: 'departmentOHExpenses',
    //   key: 'ohExpenses',
    //   editable: true,
    //   fixed: 'left',
    //   width: 60,
    //   render: text => Math.round(text)
    // },
    {
      title: 'COMPANY OH',
      dataIndex: 'companyOH',
      key: 'ohExpenses',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'DEPARTMENT OH',
      dataIndex: 'departmentOH',
      key: 'ohExpenses',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'ESI',
      dataIndex: 'esi',
      key: 'ohExpenses',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'PF',
      dataIndex: 'pf',
      key: 'ohExpenses',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
  ];
  const columns = [...defaultColumn];

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

    saveAs(
      blob,
      'Integrated Facility Management Services-Profit-Loss-Report.xlsx',
    );
  };

  const getSiteSalaryDetails = (month, year) => {
    const departmentServices = 'Integrated Facility Management Services';
    invoiceApi
      .getServicesProfitAndLoss(month + 1, year, departmentServices)
      .then((response) => {
        const responseData = get(response, 'data.data.items', []);
        setData(responseData);
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

  const labels = [
    'GROSS BILLING',
    'SALARY',
    'EXPENSES',
    'BONUS',
    'DEPARTMENT OH SALARY',
    // 'DEPARTMENT OH EXPENSES',
    'COMPANY OH',
    'DEPARTMENT OH',
    'ESI',
    'PF',
    'GROSS PROFIT',
  ];

  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">
              {' '}
              Integrated Facility Management Services
            </h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Row align="middle">
          <Col style={style} span={13} offset={1}>
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
                      <th className="border-0 ">Particular</th>
                      <th className="border-0 text-center">Income</th>
                      <th className="border-0 text-center">Expenses</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item, index) => {
                      return labels.map((label, labelIndex) => {
                        let value = '';
                        switch (label) {
                          case 'GROSS BILLING':
                            value = formattedAmount(item.billingAmount);
                            break;
                          case 'SALARY':
                            value = formattedAmount(item.grossSalary);
                            break;
                          case 'EXPENSES':
                            value = formattedAmount(item.expenses);
                            break;
                          case 'BONUS':
                            value = formattedAmount(item.bones);
                            break;
                          case 'DEPARTMENT OH SALARY':
                            value = formattedAmount(item.ohSalary);
                            break;
                          // case 'DEPARTMENT OH EXPENSES':
                          //   value = formattedAmount(item.ohExpenses);
                          //   break;
                          case 'COMPANY OH':
                            value = formattedAmount(item.companyOH);
                            break;
                          case 'DEPARTMENT OH':
                            value = formattedAmount(item.departmentOH);
                            break;
                          case 'ESI':
                            value = formattedAmount(item.esi);
                            break;
                          case 'PF':
                            value = formattedAmount(item.epf);
                            break;
                          case 'GROSS PROFIT': {
                            const netResult =
                              item.billingAmount -
                              item.grossSalary -
                              item.expenses -
                              item.bones -
                              item.ohSalary -
                              // item.ohExpenses -
                              item.companyOH -
                              item.departmentOH -
                              item.esi -
                              item.epf;
                            if (netResult >= 0) {
                              value = `Gross Profit: ${formattedAmount(
                                netResult,
                              )}`;
                            } else {
                              value = `Gross Loss: ${formattedAmount(
                                netResult,
                              )}`;
                            }
                            break;
                          }
                          default:
                            break;
                        }

                        return (
                          <tr key={`${label}-${index}`}>
                            <td className="align-middle">
                              <h6 className="mb-0 text-nowrap text-color-black">
                                {label}
                              </h6>
                            </td>
                            <td className="align-middle text-center">
                              {label === 'GROSS BILLING' ? value : ''}
                            </td>
                            <td className="align-middle text-center ">
                              {label !== 'GROSS BILLING' ? value : ''}
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
export default IfmsComparison;
