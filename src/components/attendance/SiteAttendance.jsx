/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Form, Table } from 'antd';

const SiteAttendance = ({ columns, tableData, month, year }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [mergedColumns, setMergedColumns] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  useEffect(() => {
    setMergedColumns(
      columns.map((col) => {
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
            editing: 'true',
            onClick: () => {
              // Call the renderLink function here
              renderLink(record[col.dataIndex], record, col);
            },
          }),
          render: col.render
            ? col.render
            : (text, record) => renderLink(text, record, col),
        };
      }),
    );
  }, [columns]); // Update the state when columns change

  const renderLink = (text, record, col) => (
    <a
      href={`/site-attendance-list/${record.key}/${col.title}/${month}/${year}`}
    >
      {text}
    </a>
  );
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
            pageSizeOptions: ['10', '20', '50', '100'],
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

export default SiteAttendance;
