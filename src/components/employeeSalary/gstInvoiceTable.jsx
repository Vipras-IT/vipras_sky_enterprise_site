/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Form, Table, Typography } from 'antd';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

const GstInvoiceTable = ({ columns, tableData }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const actionColumn = [
    {
      title: 'Action',
      dataIndex: 'operation',
      fixed: 'right',
      width: 50,
      render: (_, record) => {
        const id = get(record, 'id', '');
        const isGstInvoice = get(record, 'isGstInvoice', false);
        console.log('ID:', isGstInvoice);
        return (
          <div>
            {isGstInvoice ? (
              <Link to={`/gstinvoice/${id}`}>
                <Typography.Link>View</Typography.Link>
              </Link>
            ) : (
              <Link to={`/invoice/${id}`}>
                <Typography.Link>View</Typography.Link>
              </Link>
            )}
            {' / '}
            <Link to={`/create-manual-invoice/${id}`}>
              <Typography.Link>Edit</Typography.Link>
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
  const handleTableChange = (pagination) => {
    if (pagination.pageSize === 'all') {
      setPagination((prev) => ({
        ...prev,
        pageSize: data.length,
        current: 1,
      }));
    } else {
      setPagination(pagination);
    }
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
            pageSizeOptions: ['10', '20', '50', '100', String(data.length)],
            showTotal: (total) => `Total ${total} items`,
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
export default GstInvoiceTable;
