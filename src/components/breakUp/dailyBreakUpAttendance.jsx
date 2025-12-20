/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Form, Table, Typography, Tag } from 'antd';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

const DailyBreakUpAttendance = ({
  columns,
  tableData,
  month,
  year,
  hide = false,
  agreedManPower,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [transposedColumns, setTransposedColumns] = useState([]);

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      const days = columns
        .filter((col) => col.dataIndex && col.dataIndex.startsWith('day'))
        .map((col) => col.dataIndex);

      const designations = [...new Set(tableData.map((item) => item.roleName))];

      // Define columns for transposed table
      const newColumns = [
        {
          title: 'Day',
          dataIndex: 'day',
          key: 'day',
          fixed: 'left',
          width: 80, // Adjust width as needed
        },
        ...designations.map((designation) => ({
          title: designation,
          dataIndex: designation,
          key: designation,
          render: (text, record) => {
            if (record.day === 'Total') {
              const isLoss = agreedManPower > text;
              const isMatch = agreedManPower === text;
          
              return (
                <Tag color={isMatch ? '#87d068' : isLoss ? '#cd201f' : '#108ee9'}>
                  {text != null ? text : 0}
                </Tag>
              );
            }
            return text != null ? text : 0;
          },
          
          width: 150, // Adjust width as needed
        })),
      ];

      // Transform the data
      const transposedData = days.map((day, index) => {
        const rowData = {
          day: `${index + 1} ${
            columns.find((col) => col.dataIndex === day).title.split(' ')[1]
          }`,
        }; // Formatting Day
        designations.forEach((designation) => {
          const employeeData = tableData.find(
            (item) => item.roleName === designation,
          );
          if (employeeData) {
            rowData[designation] = employeeData[day];
          }
        });

        return rowData;
      });

      // Add total row
      const totalRow = { day: 'Total' };
      designations.forEach((designation) => {
        totalRow[designation] = transposedData.reduce(
          (acc, row) => acc + (parseFloat(row[designation]) || 0),
          0,
        );
      });
      totalRow.total = Object.values(totalRow).reduce(
        (acc, val) => acc + (parseFloat(val) || 0),
        0,
      );

      setTransposedColumns(newColumns);
      setData([...transposedData, totalRow]); // Add total row to data
    }
  }, [tableData, columns, agreedManPower]);

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

  return (
    <>
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={data}
          columns={[...transposedColumns, ...actionColumn]}
          rowClassName="editable-row"
          pagination={{ pageSize: 500 }}
          scroll={{ x: 'max-content', y: 400 }} // Horizontal scroll based on content
        />
      </Form>
    </>
  );
};

export default DailyBreakUpAttendance;
