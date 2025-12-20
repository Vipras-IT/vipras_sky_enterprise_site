/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Select, Spin } from 'antd';
import { formattedAmount, getMonthNames, monthNames } from 'helpers/utils';
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
// import ProfitLossTable from 'components/employeeSalary/profitLossTable';

const CollectionExpensesReport = () => {
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

  useEffect(() => {
    const month = currentMonth;
    const year = currentYear;

    setModalVisible(true);
    getSiteSalaryDetails(month, year);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    const monthNameList = getPreviousMonthNames(currentYear);
    setMonthOptions(monthNameList);
  }, [currentYear]);

  const defaultColumn = [
    {
      title: 'OPENING BALANCE',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'CLIENT RECEIPT',
      dataIndex: 'clientReceipt',
      key: 'clientReceipt',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'SUB CONTRACTOR RECEIPT',
      dataIndex: 'subContractorReceipt',
      key: 'subContractorReceipt',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'CASH TO BANK',
      dataIndex: 'inBankCashReceipt',
      key: 'inBankCashReceipt',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'OD RECEIPT',
      dataIndex: 'odReceipt',
      key: 'odReceipt',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'HAND LOAN RECEIPT',
      dataIndex: 'handLoan',
      key: 'handLoan',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'OTHER RECEIPT',
      dataIndex: 'otherReceipt',
      key: 'otherReceipt',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'LOAN EMI',
      dataIndex: 'loanEmi',
      key: 'loanEmi',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'INVESTMENT',
      dataIndex: 'investment',
      key: 'investment',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'SALARY',
      dataIndex: 'salary',
      key: 'salary',
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
      title: 'GST',
      dataIndex: 'gst',
      key: 'gst',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'ESI',
      dataIndex: 'esi',
      key: 'esi',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'PF',
      dataIndex: 'pf',
      key: 'pf',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'OD RETURN',
      dataIndex: 'odReturn',
      key: 'odReturn',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'HAND LOAN REPAYMENT',
      dataIndex: 'handLoanRepayment',
      key: 'handLoanRepayment',
      editable: true,
      fixed: 'left',
      width: 60,
      render: (text) => Math.round(text),
    },
    {
      title: 'CLOSING BALANCE',
      dataIndex: 'closingBalance',
      key: 'closingBalance',
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

    saveAs(blob, 'Collection-Expenses-Reconciliation.xlsx');
  };

  const getSiteSalaryDetails = (month, year, token) => {
    invoiceApi
      .getCollectionExpenses(month + 1, year, token)
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

  const handleChangeYear = (value) => {
    setCurrentYear(value);
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

  const labels = [
    'OPENING BALANCE',
    'CLIENT RECEIPT',
    'SUB CONTRACTOR RECEIPT',
    'CASH TO BANK',
    'OD RECEIPT',
    'HAND LOAN RECEIPT',
    'OTHER RECEIPT',
    'LOAN EMI',
    'INVESTMENT',
    'SALARY',
    'OLD SALARY',
    'EXPENSES',
    'GST',
    'ESI',
    'PF',
    'OD RETURN',
    'HAND LOAN REPAYMENT',
    'CLOSING BALANCE',
    'SALARY IN ADVANCES',
    'IMPREST IN HAND',
    'KAMALA S GANESAMOORTHY',
    'SINGH V K',
    'TOTAL',
    'DIFFERENCES',
  ];

  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">
              Collection Expenses Reconciliation
            </h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Row align="middle">
          <Col style={style} span={13} offset={1}>
            <Space wrap>
              <Select
                defaultValue={currentYear}
                style={{
                  width: 120,
                }}
                onChange={handleChangeYear}
                options={yearOptions}
              />
              <Select
                defaultValue={currentMonth}
                value={currentMonth}
                style={{
                  width: 120,
                }}
                onChange={handleChangeMonth}
                options={monthOptions}
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
              <SimpleBarReact
                style={{
                  maxHeight: '80vh',
                  overflow: 'auto',
                }}
              >
                <Table className="border-bottom">
                  <thead className="light sticky-top ">
                    <tr className="bg-primary text-white dark__bg-1000 invoice-th ">
                      <th className="border-0 fs-1">Particular</th>
                      <th className="border-0 text-center fs-1">
                        Collection Amount
                      </th>
                      <th className="border-0 text-center fs-1">
                        Company Expenses
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item, index) => {
                      return labels.map((label) => {
                        let value = '';
                        switch (label) {
                          case 'OPENING BALANCE':
                            value = formattedAmount(item.openingBalance);
                            break;
                          case 'CLIENT RECEIPT':
                            value = formattedAmount(item.clientReceipt);
                            break;
                          case 'SUB CONTRACTOR RECEIPT':
                            value = formattedAmount(item.subContractorReceipt);
                            break;
                          case 'CASH TO BANK':
                            value = formattedAmount(item.inBankCashReceipt);
                            break;
                          case 'OD RECEIPT':
                            value = formattedAmount(item.odReceipt);
                            break;
                          case 'HAND LOAN RECEIPT':
                            value = formattedAmount(item.handLoan);
                            break;
                          case 'OTHER RECEIPT':
                            value = formattedAmount(item.otherReceipt);
                            break;
                          case 'LOAN EMI':
                            value = formattedAmount(item.loanEmi);
                            break;

                          case 'INVESTMENT':
                            value = formattedAmount(item.investment);
                            break;
                          case 'OD RETURN':
                            value = formattedAmount(item.odReturn);
                            break;
                          case 'SALARY':
                            value = formattedAmount(item.salary);
                            break;

                          case 'OLD SALARY':
                            value = formattedAmount(item.oldSalary);
                            break;

                          case 'EXPENSES':
                            value = formattedAmount(item.expenses);
                            break;
                          case 'GST':
                            value = formattedAmount(item.gst);
                            break;
                          case 'ESI':
                            value = formattedAmount(item.esi);
                            break;
                          case 'PF':
                            value = formattedAmount(item.pf);
                            break;
                          case 'HAND LOAN REPAYMENT':
                            value = formattedAmount(item.handLoanRepayment);
                            break;
                          case 'CLOSING BALANCE':
                            value = formattedAmount(item.closingBalance);
                            break;
                          case 'SALARY IN ADVANCES':
                            value = formattedAmount(item.salaryInAdvance);
                            break;
                          case 'IMPREST IN HAND':
                            value = formattedAmount(item.imprestInHand);
                            break;
                          case 'KAMALA S GANESAMOORTHY':
                            value = formattedAmount(  item.empOneInHand);
                            break;
                          case 'SINGH V K':
                            value = formattedAmount(item.empTwoInHand);
                            break;
                          case 'TOTAL':
                            {
                              const totalCollection =
                                (item.openingBalance || 0) +
                                (item.clientReceipt || 0) +
                                (item.subContractorReceipt || 0) +
                                (item.odReceipt || 0) +
                                (item.otherReceipt || 0) +
                                (item.handLoan || 0);

                              const totalExpenses =
                                (item.investment || 0) +
                                (item.salary || 0) +
                                (item.expenses || 0) +
                                (item.gst || 0) +
                                (item.esi || 0) +
                                (item.pf || 0) +
                                (item.odReturn || 0) +
                                (item.oldSalary || 0) +
                                (item.closingBalance || 0) +
                                (item.handLoanRepayment || 0) +
                                (item.salaryInAdvance || 0) +
                                (item.imprestInHand || 0) +
                                (item.empOneInHand || 0) +
                                (item.empTwoInHand || 0) +
                                (item.loanEmi || 0);

                              value = {
                                collectionAmount:
                                  formattedAmount(totalCollection),
                                companyExpenses: formattedAmount(totalExpenses),
                              };
                            }
                            break;

                          case 'DIFFERENCES':
                            {
                              const totalCollections =
                                (item.openingBalance || 0) +
                                (item.clientReceipt || 0) +
                                (item.otherReceipt || 0) +
                                (item.subContractorReceipt || 0) +
                                (item.odReceipt || 0) +
                                (item.handLoan || 0);

                              const totalExpensess =
                                (item.investment || 0) +
                                (item.salary || 0) +
                                (item.expenses || 0) +
                                (item.gst || 0) +
                                (item.oldSalary || 0) +
                                (item.esi || 0) +
                                (item.pf || 0) +
                                (item.odReturn || 0) +
                                (item.handLoanRepayment || 0) +
                                (item.closingBalance || 0) +
                                (item.salaryInAdvance || 0) +
                                (item.imprestInHand || 0) +
                                (item.empOneInHand || 0) +
                                (item.empTwoInHand || 0) +                              
                                (item.loanEmi || 0);

                              const difference =
                                (totalCollections || 0) - (totalExpensess || 0);
                              value = formattedAmount(difference);
                            }
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
                              {[
                                'OPENING BALANCE',
                                'CLIENT RECEIPT',
                                'OTHER RECEIPT',
                                'SUB CONTRACTOR RECEIPT',
                                'CASH TO BANK',
                                'OD RECEIPT',
                                'HAND LOAN RECEIPT',
                                'TOTAL',
                              ].includes(label)
                                ? label === 'TOTAL'
                                  ? value.collectionAmount
                                  : value
                                : ''}
                            </td>
                            <td className="align-middle text-center table-font fw-bold">
                              {![
                                'OPENING BALANCE',
                                'OTHER RECEIPT',
                                'CLIENT RECEIPT',
                                'SUB CONTRACTOR RECEIPT',
                                'CASH TO BANK',
                                'OD RECEIPT',
                                'HAND LOAN RECEIPT',
                              ].includes(label) || label === 'TOTAL'
                                ? label === 'TOTAL'
                                  ? value.companyExpenses
                                  : value
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
export default CollectionExpensesReport;
