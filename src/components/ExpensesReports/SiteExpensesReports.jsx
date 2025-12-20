/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Spin } from 'antd';
import { formattedAmount, disableFutureDates, monthNames } from 'helpers/utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get } from 'lodash';
import ImprestApi from 'api/Imprestholdertransaction';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { Card } from 'react-bootstrap';
import ExpensesTable from './ExpensesTable';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const SiteExpensesReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();
  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());

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
    const month = currentMonth;
    const year = currentYear;
    setModalVisible(true);
    getSiteSalaryDetails(month, year);
  }, [value]);

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
      title: ' SITE ID',
      dataIndex: 'siteId',
      key: 'siteId',
      editable: true,
      fixed: 'left',
      width: 5,
    },
    {
      title: 'SITE NAME',
      dataIndex: 'siteName',
      key: 'siteName',
      editable: true,
      fixed: 'left',
      width: 10,
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
    ImprestApi.getSiteExpenses(month, year)
      .then((response) => {
        const responseData = get(response, 'data.data', []);

        const grandTotalAmount = responseData.reduce(
          (accumulator, item) => accumulator + (item.expenses || 0),
          0,
        );

        const sortedData = [...responseData].sort(
          (a, b) => b.expenses - a.expenses,
        );

        responseData.push({
          siteId: 'TOTAL',
          siteName: '',
          expenses: grandTotalAmount,
        });

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

  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">Site Expenses Reports</h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Row align="end me-3">
          <Col style={style} offset={1}>
            <Space wrap>{' '}
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
        <Row>
          <ExpensesTable columns={columns} tableData={data} />
        </Row>
      </Card>
    </>
  );
};
export default SiteExpensesReport;
