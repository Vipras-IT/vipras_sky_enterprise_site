/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Form, Table } from 'antd';

const ProfitLossTable = ({ columns, tableData }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 500,
  });
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

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
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <>
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '500'],
          }}
          onChange={handleTableChange}
          scroll={{
            x: 1800,
            y: 400,
          }}
        />
      </Form>
    </>
  );
};
export default ProfitLossTable;
