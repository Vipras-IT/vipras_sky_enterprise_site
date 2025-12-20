/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Form, Input, Table, Typography } from 'antd';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const LeadListTable = ({ columns, tableData, currentMonth, currentYear }) => {
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
        const id = get(record, 'id', '');

        return (
          <div>
            <Link to={`/leadgeneration/${id}`}>
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
      }),
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 20 }}
          scroll={{
            x: 1800,
            y: 400,
          }}
        />
      </Form>
    </>
  );
};
export default LeadListTable;
