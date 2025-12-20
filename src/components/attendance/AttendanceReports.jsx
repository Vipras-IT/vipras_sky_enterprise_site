/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Form, Table, Typography, Tag } from 'antd';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

const AttendanceReports = ({
  columns,
  tableData,
  month,
  year,
  hide = false,
  agreedManPower,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [column, setColumn] = useState([]);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  useEffect(() => {
    setColumn(columns);
  }, [column]);

  const actionColumn = hide
    ? []
    : [
        {
          title: 'Action',
          dataIndex: 'operation',
          fixed: 'right',
          width: 120,
          render: (_, record) => {
            const employeeId = get(record, 'id', '');
            return (
              <div>
                <Link
                  to={`/your-attendance-report/${employeeId}/${month}/${year}`}
                >
                  <Typography.Link>View</Typography.Link>
                </Link>
              </div>
            );
          },
        },
      ];

  const dailyColumns = [
    'day1',
    'day2',
    'day3',
    'day4',
    'day5',
    'day6',
    'day7',
    'day8',
    'day9',
    'day10',
    'day11',
    'day12',
    'day13',
    'day14',
    'day15',
    'day16',
    'day17',
    'day18',
    'day19',
    'day20',
    'day21',
    'day22',
    'day23',
    'day24',
    'day25',
    'day26',
    'day27',
    'day28',
    'day29',
    'day30',
    'day31',
  ];

  const mergedColumns = columns.map((col) => {
    if (dailyColumns.includes(col.dataIndex)) {
      return {
        ...col,
        render: (text, record) => {
          if (record.employeeName === 'Total') {
            const isLoss = agreedManPower > text;
            const isMatch = agreedManPower === text;

            return (
              <Tag color={isMatch ? '#87d068' : isLoss ? '#cd201f' : '#108ee9'}>
                {text}
              </Tag>
            );
          }
          return text;
        },
      };
    }

    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: false,
      }),
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={data}
          columns={[...mergedColumns, ...actionColumn]}
          rowClassName="editable-row"
          pagination={{ pageSize: 500 }}
          scroll={{ x: 1800, y: 400 }}
        />
      </Form>
    </>
  );
};
export default AttendanceReports;
