/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Form, Table, Typography } from 'antd';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

const SiteAttendanceListTable = ({
  columns,
  tableData,
  //   currentMonth,
  //   currentYear
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  columns = [...columns];

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
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 500 }}
          scroll={{
            x: 1800,
            y: 400,
          }}
        />
      </Form>
    </>
  );
};
export default SiteAttendanceListTable;
