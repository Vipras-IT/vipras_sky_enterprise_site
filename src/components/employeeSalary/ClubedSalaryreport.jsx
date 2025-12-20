/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { get } from 'lodash';
import SimpleBarReact from 'simplebar-react';
import { Card } from 'react-bootstrap';
import salaryApi from 'api/salary';
import { Col, Row, Space } from 'antd';
import { disableFutureDates } from 'helpers/utils';
import { useAuth } from 'hooks/useAuth';
import { formattedAmount } from 'helpers/utils';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const ClubedSalaryreport = () => {
  const todayDate = new Date();
  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const { user } = useAuth();
  const [datas, setDatas] = useState([]);
  const columns = [
    {
      title: 'EMPLOYEE NAME',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'EMPLOYEE ID',
      dataIndex: 'employeeIDNumber',
      key: 'employeeIDNumber',
    },
    {
      title: 'DESIGNATION',
      dataIndex: 'designation',
      key: 'designation',
    },
    {
      title: 'TOTAL DUTIES',
      dataIndex: 'totalDuties',
      key: 'totalDuties',
    },
    {
      title: 'TOTAL SALARY',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
  ];
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
  // const handleChangeYear = (value) => {
  //   setCurrentYear(value);
  // };
  // const handleChangeMonth = (value) => {
  //   const currentMonthName = monthNames[value].value;
  //   setCurrentMonth(currentMonthName);
  // };
  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(month);
    setCurrentYear(year);
  };
  
  useEffect(() => {
    getSalaryReport();
  }, [value]);

  const getSalaryReport = () => {
    const month = currentMonth;
    const year = currentYear;

    salaryApi
      .getClubedSalaryBySitecode(month, year)
      .then((response) => {
        const responseData = get(response, 'data.data', []);
        const dataWithKeys = addKeysToData(responseData);
        setDatas(dataWithKeys);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  const addKeysToData = (datas) => {
    return datas.map((record, index) => ({
      ...record,
      key: index.toString(),
    }));
  };
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const handleRowExpand = (record) => {
    setExpandedRowKey(record.key === expandedRowKey ? null : record.key);
  };

  return (
    <Card>
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">Clubed Salary Report</h5>
        </div>
      </Card.Header>
      <Row align="end mb-3 mt-3 me-3">
        <Col offset={1}>
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
              options={getMonthNames(currentMonth)}
            /> */}
            <DatePicker
              format="MMM yyyy"
              caretAs={BsCalendar2MonthFill}
              value={value}
              onChange={handleChange}
              shouldDisableDate={disableFutureDates}
            />
          </Space>
        </Col>
      </Row>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <div className="mt-1 fs--1">
              <SimpleBarReact
                style={{
                  maxHeight: '80vh',
                  overflow: 'auto',
                }}
              >
                <table className="table table-striped border-bottom">
                  <thead className="light sticky-top">
                    <tr className="bg-primary text-white dark__bg-1000">
                      <th>Site Id</th>
                      <th className="text-center">Role</th>
                      <th className="text-center">Duties</th>
                      <th className="text-center">PerDay Salary</th>
                      <th className="text-center">Total Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.multiSiteInfo.map((site, index) => (
                      <tr key={index}>
                        <td>{get(site, 'siteId', '')}</td>
                        <td className="text-center">
                          {get(site, 'roleName', '')}
                        </td>
                        <td className="text-center">
                          {get(site, 'totalDuties', 0)}
                        </td>
                        <td className="text-center">
                          {formattedAmount(get(site, 'perDaySalary', 0))}
                        </td>
                        <td className="text-center">
                          {formattedAmount(get(site, 'totalSalary', 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SimpleBarReact>
            </div>
          ),
          rowExpandable: (record) => record.name !== 'Not Expandable',
          expandRowByClick: true,
          expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
          onExpand: (expanded, record) => handleRowExpand(record),
        }}
        dataSource={datas}
        pagination={{
          pageSize: 500,
          pageSizeOptions: [500, 800, 1000],
        }}
      />
    </Card>
  );
};

export default ClubedSalaryreport;
