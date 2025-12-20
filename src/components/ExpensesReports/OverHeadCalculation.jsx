/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Spin } from 'antd';
import { formattedAmount, monthNames } from 'helpers/utils';
import SimpleBarReact from 'simplebar-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get } from 'lodash';
import invoiceApi from 'api/invoiceApi';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { disableFutureDates } from 'helpers/utils';
import { Card, Table } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';


const OverHeadCalculation = () => {
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
      title: 'S.NO',
      dataIndex: 'sno',
      fixed: 'left',
      key: '',
      width: 20,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'COMPANY TOTAL DUTY',
      dataIndex: 'companyTotalaDuties',
      key: 'companyTotalaDuties',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'HEAD OFFICE EXPENSES',
      dataIndex: 'headOfficeExpenses',
      key: 'headOfficeExpenses',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'HEAD OFFICE SALARY',
      dataIndex: 'headOfficeSalary',
      key: 'headOfficeSalary',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'HEAD OFFICE DUTY',
      dataIndex: 'headOfficeDuty',
      key: 'headOfficeDuty',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'OVERHEAD',
      dataIndex: 'Overhead',
      key: 'Overhead',
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

    saveAs(blob, 'Vipras-Laundry-Profit-Loss-Report.xlsx');
  };

  const getSiteSalaryDetails = (month, year) => {
    invoiceApi
      .getOverheadCalculation(month, year)
      .then((response) => {
        const responseData = get(response, 'data.data', []);
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
    'HEAD OFFICE SALARY',
    'COMPANY TOTAL DUTY',
    'HEAD OFFICE EXPENSES',
    'HEAD OFFICE DUTY',
    'OVERHEAD',
    'MONTH',
    'NET RESULT',
  ];

  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white"> Over Head Calculation</h5>
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
                      <th className="border-0 text-center fs-1">Expenses</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item, index) => {
                      return labels.map((label, labelIndex) => {
                        let value = '';
                        switch (label) {
                          case 'HEAD OFFICE SALARY':
                            value = formattedAmount(item.headOfficeSalary);
                            break;
                          case 'HEAD OFFICE EXPENSES':
                            value = formattedAmount(item.headOfficeExpenses);
                            break;
                          case 'HEAD OFFICE DUTY':
                            value = formattedAmount(item.headOfficeDuty);
                            break;
                          case 'COMPANY TOTAL DUTY':
                            value = formattedAmount(item.companyTotalaDuties);
                            break;
                          case 'OVERHEAD':
                            value = formattedAmount(item.Overhead);
                            break;
                          case 'MONTH':
                            value = item.month;
                            break;
                          case 'NET RESULT':
                            value = `Per Overhead for the month ${formattedAmount(
                              item.Overhead,
                            )}`;
                            break;

                          default:
                            break;
                        }

                        return (
                          <tr key={`${label}-${index}`}>
                            <td className="align-middle">
                              <h6 className="mb-0 text-nowrap text-color-black table-font">
                                {label}
                              </h6>
                            </td>
                            <td className="align-middle text-center table-font fw-bold">
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
export default OverHeadCalculation;
