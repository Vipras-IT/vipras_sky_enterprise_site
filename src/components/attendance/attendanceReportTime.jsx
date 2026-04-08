/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Form, Table, Typography, Tag } from 'antd';

const dailyColumns = Array.from({ length: 31 }, (_, i) => `day${i + 1}`);

const formatTime = (isoString) => {
    if (!isoString) return '--';
    return new Date(isoString).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const AttendanceReportsTime = ({
    columns,
    tableData,
    month,
    year,
    hide = false,
    agreedManPower,
}) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(tableData);
    }, [tableData]);

    const mergedColumns = columns.map((col) => {
        if (dailyColumns.includes(col.dataIndex)) {
            return {
                ...col,
                width: 120,
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

                    // Individual employee check-in check-out
                    const infoKey = `${col.dataIndex}-info`;
                    const infoArray = record[infoKey];

                    if (!infoArray || infoArray.length === 0) {
                        return (
                            <span style={{ color: '#999', fontSize: '12px' }}>
                                {text === 0 ? 'A' : text}
                            </span>
                        );
                    }

                    return (
                        <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                            {infoArray.map((entry, index) => (
                                <div
                                    key={index}
                                    style={{
                                        borderBottom:
                                            index < infoArray.length - 1 ? '1px dashed #eee' : 'none',
                                        paddingBottom: index < infoArray.length - 1 ? 3 : 0,
                                        marginBottom: index < infoArray.length - 1 ? 3 : 0,
                                    }}
                                >
                                    <div style={{ color: '#52c41a', fontWeight: 600 ,fontSize:17}}>
                                         {formatTime(entry.checkIn)}
                                    </div>
                                    <div style={{ color: '#f5222d', fontWeight: 600 ,fontSize:17 }}>
                                        {formatTime(entry.checkOut)}
                                    </div>
                                    {/* {entry.shift && (
                                        <div style={{ color: '#aaa', fontSize: '10px' }}>
                                            Shift: {entry.shift}
                                        </div>
                                    )} */}
                                </div>
                            ))}
                        </div>
                    );
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
        <Form form={form} component={false}>
            <Table
                bordered
                dataSource={data}
                columns={[...mergedColumns]}
                // columns={[...mergedColumns, ...actionColumn]}
                rowClassName="editable-row"
                pagination={{ pageSize: 500 }}
                scroll={{ x: 2500, y: 400 }}
            />
        </Form>
    );
};

export default AttendanceReportsTime;