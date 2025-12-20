/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useMemo, useRef, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import { Table, Card, Form, Button, Spinner } from 'react-bootstrap';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import ImprestHolderTransactionAPI from 'api/Imprestholdertransaction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import ImprestHolderTransactionHeader from './ImprestHolderTransactionHeader';
import { formattedAmount } from 'helpers/utils';
import { Tag } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatDateToIST } from '../../helpers/utils';
import { MdDelete } from 'react-icons/md';
import Modal from 'react-bootstrap/Modal';
import { deleteImprestHolderTransaction } from 'api/Imprestholdertransaction';
import moment from 'moment/moment';
import { toast } from 'react-toastify';

// const baseColumns = [
//   {
//     accessor: 'date',
//     Header: 'Date',
//     headerProps: { className: 'pe-7' },
//     Cell: (rowData) => {
//       const saleDate = new Date(get(rowData, 'row.values.date', null));
//       const month = saleDate.getMonth() + 1;
//       const monthValue = month < 10 ? `0${month}` : `${month}`;
//       const day = saleDate.getDate();
//       const dayValue = day < 10 ? `0${day}` : `${day}`;
//       const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
//       return <>{formatDate}</>;
//     },
//   },
//   {
//     accessor: 'imprestholderId',
//     Header: 'From ID',
//   },
//   {
//     accessor: 'imprestholderName',
//     Header: 'From Name',
//   },
//   {
//     accessor: 'employeeID',
//     Header: 'To ID',
//   },
//   {
//     accessor: 'employeeName',
//     Header: 'To Name',
//   },
//   {
//     accessor: 'unitCodeWithName',
//     Header: 'Unit Code',
//   },
//   {
//     accessor: 'debit',
//     Header: 'Debit',
//     Cell: (rowData) => {
//       const data = get(rowData, 'row.values.debit', '');
//       const finalData = formattedAmount(Number(data));
//       return <>{finalData}</>;
//     },
//   },
//   {
//     accessor: 'credit',
//     Header: 'Credit',
//     Cell: (rowData) => {
//       const data = get(rowData, 'row.values.credit', '');
//       const finalData = formattedAmount(Number(data));
//       return <>{finalData}</>;
//     },
//   },
//   {
//     accessor: 'month',
//     Header: 'Month',
//   },
//   {
//     accessor: 'explanation',
//     Header: 'Remarks',
//   },
//   {
//     accessor: 'description',
//     Header: 'Description',
//   },
//   {
//     accessor: 'payType',
//     Header: 'Transaction Type',
//   },
//   {
//     accessor: 'expensesType',
//     Header: 'Expenses Type',
//   },
//   {
//     accessor: 'createdOn',
//     Header: 'Created On',
//     Cell: (rowData) => (
//       <>{formatDateToIST(get(rowData, 'row.values.createdOn', ''))}</>
//     ),
//   },
//   {
//     accessor: 'updatedOn',
//     Header: 'Updated On',
//     Cell: (rowData) => (
//       <>{formatDateToIST(get(rowData, 'row.values.updatedOn', ''))}</>
//     ),
//   },
//   {
//     accessor: 'isVerified',
//     Header: 'Status',
//     Cell: ({ row }) => (
//       <Tag
//         color={
//           get(row, 'values.isVerified', '') === 'APPROVED'
//             ? 'green'
//             : get(row, 'values.isVerified', '') === 'REJECTED'
//               ? 'volcano'
//               : 'blue'
//         }
//       >
//         {get(row, 'values.isVerified', '') === 'APPROVED'
//           ? 'APPROVED'
//           : get(row, 'values.isVerified', '') === 'REJECTED'
//             ? 'REJECTED'
//             : 'PENDING'}
//       </Tag>
//     ),
//   },
//   {
//     accessor: 'rejectedReason',
//     Header: 'Reason',
//   },
// ];

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 1500,
  totalCount: null,
  queryPageFilter: { key: '', value: '' },
};

const page_changed = 'page_changed1';
const page_size_changed = 'page_size_changed1';
const total_count_changed = 'total_count_changed1';
const page_filter_changed = 'page_filter_changed1';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case page_changed:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case page_size_changed:
      return {
        ...state,
        queryPageSize: payload,
      };
    case page_filter_changed:
      return {
        ...state,
        queryPageFilter: payload,
      };
    case total_count_changed:
      return {
        ...state,
        totalCount: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

function ImprestHolderTransactionList() {
  const [show, setShow] = useState(false);
  const profile = window.localStorage.getItem('user');
  const profileInfo = profile ? JSON.parse(profile) : {};
  const profileAdmin = get(profileInfo, 'role', '') === 'SUPER_ADMIN';
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessor: 'date',
        Header: 'Date',
        headerProps: { className: 'pe-7' },
        Cell: (rowData) => {
          const saleDate = new Date(get(rowData, 'row.values.date', null));
          const month = saleDate.getMonth() + 1;
          const monthValue = month < 10 ? `0${month}` : `${month}`;
          const day = saleDate.getDate();
          const dayValue = day < 10 ? `0${day}` : `${day}`;
          const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
          return <>{formatDate}</>;
        },
      },
      {
        accessor: 'imprestholderId',
        Header: 'From ID',
      },
      {
        accessor: 'imprestholderName',
        Header: 'From Name',
      },
      {
        accessor: 'employeeID',
        Header: 'To ID',
      },
      {
        accessor: 'employeeName',
        Header: 'To Name',
      },
      {
        accessor: 'unitCodeWithName',
        Header: 'Unit Code',
      },
      {
        accessor: 'debit',
        Header: 'Debit',
        Cell: (rowData) => {
          const data = get(rowData, 'row.values.debit', '');
          const finalData = formattedAmount(Number(data));
          return <>{finalData}</>;
        },
      },
      {
        accessor: 'credit',
        Header: 'Credit',
        Cell: (rowData) => {
          const data = get(rowData, 'row.values.credit', '');
          const finalData = formattedAmount(Number(data));
          return <>{finalData}</>;
        },
      },
      {
        accessor: 'month',
        Header: 'Month',
      },
      {
        accessor: 'explanation',
        Header: 'Remarks',
      },
      {
        accessor: 'description',
        Header: 'Description',
      },
      {
        accessor: 'payType',
        Header: 'Transaction Type',
      },
      {
        accessor: 'expensesType',
        Header: 'Expenses Type',
      },
      {
        accessor: 'createdOn',
        Header: 'Created On',
        Cell: (rowData) => (
          <>{formatDateToIST(get(rowData, 'row.values.createdOn', ''))}</>
        ),
      },
      {
        accessor: 'updatedOn',
        Header: 'Updated On',
        Cell: (rowData) => (
          <>{formatDateToIST(get(rowData, 'row.values.updatedOn', ''))}</>
        ),
      },
      {
        accessor: 'isVerified',
        Header: 'Status',
        Cell: ({ row }) => (
          <Tag
            color={
              get(row, 'values.isVerified', '') === 'APPROVED'
                ? 'green'
                : get(row, 'values.isVerified', '') === 'REJECTED'
                  ? 'volcano'
                  : 'blue'
            }
          >
            {get(row, 'values.isVerified', '') === 'APPROVED'
              ? 'APPROVED'
              : get(row, 'values.isVerified', '') === 'REJECTED'
                ? 'REJECTED'
                : 'PENDING'}
          </Tag>
        ),
      },
      {
        accessor: 'rejectedReason',
        Header: 'Reason',
      },
      ...(profileAdmin
        ? [
            {
              Header: 'Action',
              accessor: 'action',
              Cell: ({ row }) => {
                const handleDelete = () => {
                  setShow(true);
                  setSelectedRow(row.original);
                };

                return (
                  <div
                    className="cursor-pointer text-danger fs-2"
                    onClick={handleDelete}
                  >
                    <MdDelete />
                  </div>
                );
              },
            },
          ]
        : []),
    ],
    [],
  );

  const [
    { queryPageIndex, queryPageSize, totalCount, queryPageFilter },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  const [keyword, setKeyword] = useState({
    key: '',
    value: '',
    from: null,
    to: null,
  });
  const [useFilter, setUseFilter] = useState(false);
  const onClickFilterCallback = (filter) => {
    setUseFilter(true);
    setKeyword(filter);
  };

  const { isLoading, error, data, isSuccess, refetch } = useQuery(
    [queryPageIndex, queryPageSize, queryPageFilter],
    () =>
      ImprestHolderTransactionAPI.fetchOtherDeductuionData(
        queryPageIndex,
        queryPageSize,
        queryPageFilter,
      ),
    {
      keepPreviousData: true,
      staleTime: Infinity,
      cacheTime: 0,
    },
  );

  const totalPageCount = Math.ceil(totalCount / queryPageSize);
  const handleDeleteData = async (id) => {
    const result = await deleteImprestHolderTransaction(id);
    if (result?.data?.success === true) {
      toast.success('Deleted successfully');
      setShow(false);
      refetch();
    } else {
      toast.error('delete failed');
    }
  };
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: isSuccess ? data.results : [],
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: isSuccess ? totalPageCount : null,
    },
    usePagination,
  );

  const exportColumn = [
    {
      accessor: 'date',
      Header: 'Date',
      headerProps: { className: 'pe-7' },
      Cell: (rowData) => {
        const saleDate = new Date(get(rowData, 'row.values.date', null));
        const month = saleDate.getMonth() + 1;
        const monthValue = month < 10 ? `0${month}` : `${month}`;
        const day = saleDate.getDate();
        const dayValue = day < 10 ? `0${day}` : `${day}`;
        const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
        return <>{formatDate}</>;
      },
    },
    {
      accessor: 'imprestholderId',
      Header: 'From ID',
    },
    {
      accessor: 'imprestholderName',
      Header: 'From Name',
    },
    {
      accessor: 'employeeID',
      Header: 'To ID',
    },
    {
      accessor: 'employeeName',
      Header: 'To Name',
    },
    {
      accessor: 'unitCodeWithName',
      Header: 'Unit Code',
    },
    {
      accessor: 'debit',
      Header: 'Debit',
    },
    {
      accessor: 'credit',
      Header: 'Credit',
    },
    {
      accessor: 'month',
      Header: 'Month',
    },
    {
      accessor: 'explanation',
      Header: 'Remarks',
    },
    {
      accessor: 'description',
      Header: 'Description',
    },
    {
      accessor: 'payType',
      Header: 'Transaction Type',
    },
    {
      accessor: 'expensesType',
      Header: 'Expenses Type',
    },
    {
      accessor: 'isVerified',
      Header: 'Status',
    },
    {
      accessor: 'rejectedReason',
      Header: 'Reason',
    },
    {
      accessor: 'createdOn',
      Header: 'Created On',
      Cell: (rowData) => (
        <>{formatDateToIST(get(rowData, 'row.values.createdOn', ''))}</>
      ),
    },
    {
      accessor: 'updatedOn',
      Header: 'Updated On',
      Cell: (rowData) => (
        <>{formatDateToIST(get(rowData, 'row.values.updatedOn', ''))}</>
      ),
    },
  ];

  const onClickExportAsExcel = () => {
    const dataToExport = page.map((record) =>
      exportColumn.map((column) => get(record.original, column.accessor, '')),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([
      exportColumn.map((column) => column.Header),
      ...dataToExport,
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const filename = `All-Imprest-Holder-Transactions-Report-${formattedDate}.xlsx`;

    saveAs(blob, filename);
  };

  React.useEffect(() => {
    dispatch({ type: page_changed, payload: pageIndex });
  }, [pageIndex]);

  React.useEffect(() => {
    dispatch({ type: page_size_changed, payload: pageSize });
    gotoPage(0);
  }, [pageSize, gotoPage]);

  React.useEffect(() => {
    if (useFilter) {
      dispatch({ type: page_filter_changed, payload: keyword });
      gotoPage(0);
    }
  }, [keyword, gotoPage, useFilter]);

  React.useEffect(() => {
    if (data?.count) {
      dispatch({
        type: total_count_changed,
        payload: data.count,
      });
    }
  }, [data?.count]);

  const granTotalAmountcredit =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.credit || 0),
      0,
    ) || 0;

  const granTotalAmountdebit =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.debit || 0),
      0,
    ) || 0;

  const finalvalues = granTotalAmountcredit - granTotalAmountdebit;
  const formattedGranTotalAmountCredit = formattedAmount(finalvalues);

  const totalAmounts = data?.results?.reduce(
    (accumulator, item) => {
      if (item.isVerified === 'REJECTED') {
        accumulator.rejected += item.debit || 0;
      } else if (item.isVerified === 'APPROVED') {
        accumulator.approved += item.debit || 0;
      } else if (item.isVerified === 'PENDING') {
        accumulator.pending += item.debit || 0;
      }
      return accumulator;
    },
    { rejected: 0, approved: 0, pending: 0 },
  ) || { rejected: 0, approved: 0, pending: 0 };

  const rejectedAmount = totalAmounts.rejected;
  const approvedAmount = totalAmounts.approved;
  const pendingAmount = totalAmounts.pending;

  React.useEffect(() => {
    if (data?.hasError && data?.hasError == '401') {
      // logout();
      // navigate('/', { replace: true });
    }
  }, [data?.hasError]);

  if (error) {
    return <p>Error</p>;
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

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
              <span className="fw-bold">From NAME: </span>
              {selectedRow?.imprestholderName || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">From ID: </span>
              {selectedRow?.imprestholderId ?? '--'}
            </p>
            <p className="mb-1">
              <span className="fw-bold">To NAME: </span>
              {selectedRow?.employeeName || '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">To ID: </span>
              {selectedRow?.employeeID ?? '--'}
            </p>

            <p className="mb-1">
              <span className="fw-bold">Unit: </span>
              {selectedRow?.unitCode || '--'}
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
              <span className="fw-bold">Remarks: </span>
              {selectedRow?.explanation || '--'}
            </p>
            <p className="mb-1">
              <span className="fw-bold">description: </span>
              {selectedRow?.description || '--'}
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
              <span className="fw-bold">Status: </span>
              {selectedRow?.status || '--'}
            </p>
          </div>
          <button
            className="btn btn-primary me-4"
            onClick={() => handleDeleteData(selectedRow.id)}
          >
            Yes
          </button>
          <button className="btn btn-secondary" onClick={() => setShow(false)}>
            No
          </button>{' '}
        </Modal.Body>
      </Modal>
      {isSuccess ? (
        <>
          <Card>
            <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
              <div className="position-relative z-index-1 light">
                <h5 className="mb-0 text-white">
                  All Imprest Holder Transactions Report
                </h5>
              </div>
            </Card.Header>
            <Card.Header>
              <ImprestHolderTransactionHeader
                onClickFilterCallback={onClickFilterCallback}
                defaultKeyword={keyword}
                formattedGranTotalAmountCredit={formattedGranTotalAmountCredit}
                exportAsExcel={onClickExportAsExcel}
              />
            </Card.Header>
            <Card.Body className="p-0">
              <SimpleBarReact
                style={{
                  maxHeight: '80vh',
                  overflow: 'auto',
                }}
              >
                <Table
                  {...getTableProps({
                    bordered: true,
                    striped: true,
                    className: 'fs--1 mb-0',
                  })}
                >
                  <thead className="bg-200 text-900 text-nowrap align-middle sticky-top">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps()}>
                            {column.render('Header')}
                            {column.canSort ? (
                              column.isSorted ? (
                                column.isSortedDesc ? (
                                  <span className="sort desc" />
                                ) : (
                                  <span className="sort asc" />
                                )
                              ) : (
                                <span className="sort" />
                              )
                            ) : (
                              ''
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          className="btn-reveal-trigger align-middle"
                          {...row.getRowProps()}
                        >
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    {page.length === 0 && (
                      <h5 className="no-result-found">No results found! </h5>
                    )}
                  </tbody>
                </Table>
              </SimpleBarReact>
            </Card.Body>
            <Card.Footer>
              <div className="pagination">
                <div className="navigation-container">
                  <Button
                    size="sm"
                    variant="falcon-default"
                    onClick={() => gotoPage(0)}
                    className={classNames({ disabled: !canPreviousPage })}
                  >
                    {'<<'}
                  </Button>
                  <Button
                    size="sm"
                    variant="falcon-default"
                    onClick={() => previousPage()}
                    className={classNames({ disabled: !canPreviousPage })}
                  >
                    <FontAwesomeIcon icon="chevron-left" />
                  </Button>
                  <Button
                    size="sm"
                    variant="falcon-default"
                    onClick={() => nextPage()}
                    className={classNames({ disabled: !canNextPage })}
                  >
                    <FontAwesomeIcon icon="chevron-right" />
                  </Button>
                  <Button
                    size="sm"
                    variant="falcon-default"
                    onClick={() => gotoPage(pageCount - 1)}
                    className={classNames({ disabled: !canNextPage })}
                  >
                    {'>>'}
                  </Button>
                </div>
                <div>
                  <span>
                    Page{' '}
                    <strong>
                      {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                  </span>
                  <span>
                    | Go to page:{' '}
                    <input
                      type="number"
                      value={pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        gotoPage(page);
                      }}
                      style={{ width: '100px' }}
                    />
                  </span>{' '}
                </div>
                <div>
                  {' '}
                  <b>TOTAL DEBIT : {formattedAmount(granTotalAmountdebit)}</b>
                </div>
                &nbsp;
                <div>
                  {' '}
                  <b>REJECTED : {formattedAmount(rejectedAmount)}</b>
                </div>
                &nbsp;
                <div>
                  {' '}
                  <b>APPROVED : {formattedAmount(approvedAmount)}</b>
                </div>
                &nbsp;
                <div>
                  {' '}
                  <b>PENDING : {formattedAmount(pendingAmount)}</b>
                </div>
                &nbsp;
                <div>
                  <b>TOTAL CREDIT :{formattedAmount(granTotalAmountcredit)}</b>
                </div>
                <div>
                  <Form.Select
                    size="sm"
                    className="me-2"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                    }}
                  >
                    {[1500, 3000, 50000].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </>
      ) : null}
    </>
  );
}

export default ImprestHolderTransactionList;
