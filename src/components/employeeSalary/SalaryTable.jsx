/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Form, Table, Typography } from 'antd';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

const SalaryTable = ({
  columns,
  tableData,
  currentMonth,
  currentYear,
  rowSelection,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const actionColumn = [
    {
      title: 'Action',
      dataIndex: 'operation',
      fixed: 'right',
      width: 120,
      render: (_, record) => {
        const employeeNumber = get(record, 'employeeIDNumber', '');

        return (
          <div>
            <Link
              to={`/salary/${employeeNumber}?month=${currentMonth}&year=${currentYear}`}
            >
              <Typography.Link>View</Typography.Link>
            </Link>
          </div>
        );
      },
    },
  ];

  columns = [...columns, ...actionColumn];

  const mergedColumns = columns.map((col) => {
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
          rowSelection={rowSelection}
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            pageSize: 2000,
            pageSizeOptions: [2000],
          }}
          scroll={{
            x: 1800,
            y: 400,
          }}
        />
      </Form>
    </>
  );
};
export default SalaryTable;
