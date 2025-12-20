/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Form, Table, Typography } from 'antd';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import Modal from 'react-bootstrap/Modal';
import { deleteImprestHolderTransaction } from 'api/Imprestholdertransaction';
import moment from 'moment/moment';
import { toast } from 'react-toastify';

const AccountsTransactionListTable = ({
  columns,
  tableData,
  rowSelection,
  getSalaryReportFinal,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [show, setShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const profile = window.localStorage.getItem('user');
  const profileInfo = profile ? JSON.parse(profile) : {};

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const handleDelete = async (id) => {
    const result = await deleteImprestHolderTransaction(id);
    if (result?.data?.success === true) {
      toast.success('Deleted successfully');
      setShow(false);
      getSalaryReportFinal();
    } else {
      toast.error("delete failed");
    }
  };

  const actionColumn = [
    {
      title: 'Action',
      dataIndex: 'operation',
      fixed: 'right',
      width: 120,
      render: (_, record) => {
        const employeeNumber = get(record, 'id', '');
        const status = get(record, 'status', '');
        const role = get(profileInfo, 'role', '');

        const canDelete =
          role === 'SUPER_ADMIN' ||
          role === 'ACCOUNTS_MANAGER' ||
          role === 'ACCOUNTS_ASSISTANT';
        return (
          <div className="d-flex align-items-center gap-2">
            {status !== 'PAID' && (
              <Link to={`/imprestholder-credit/${employeeNumber}`}>
                <Typography.Link>Edit</Typography.Link>
              </Link>
            )}
            {canDelete && (
              <div
                className="cursor-pointer text-danger fs-2"
                onClick={() => {
                  setSelectedRow(record);
                  setShow(true);
                }}
              >
                <MdDelete />
              </div>
            )}
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
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Are you sure, you want to delete this record?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="text-start mx-5 my-3">
            <p className="mb-1">
              <span className="fw-bold">Date: </span>
              {selectedRow?.date
                ? moment(selectedRow.date).format('DD MMM YYYY')
                : '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">EMP NAME: </span>
              {selectedRow?.employeeName || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">EMP ID: </span>
              {selectedRow?.employeeID ?? '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Unit: </span>
              {selectedRow?.unitCode || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Room: </span>
              {selectedRow?.roomCode || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Vendor: </span>
              {selectedRow?.vendorCode || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Debit: </span>
              {selectedRow?.debit ?? '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Credit: </span>
              {selectedRow?.credit ?? '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Pay Type: </span>
              {selectedRow?.payType || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Expenses Type: </span>
              {selectedRow?.expensesType || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Remarks: </span>
              {selectedRow?.explanation || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Status: </span>
              {selectedRow?.status || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Paid By: </span>
              {selectedRow?.paidBy || '--'}
            </p>
          </div>

          <button
            className="btn btn-primary me-4"
            onClick={() => handleDelete(selectedRow.key)}
          >
            Yes
          </button>
          <button className="btn btn-secondary" onClick={() => setShow(false)}>
            No
          </button>
        </Modal.Body>
      </Modal>
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
export default AccountsTransactionListTable;
