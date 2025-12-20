/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import { Table, Card, Dropdown, Form, Button, Spinner } from 'react-bootstrap';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import ImprestHolderTransactionAPI from 'api/Imprestholdertransaction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import { Select, Tag } from 'antd';
import { formattedAmount, getMonthNames, monthNames } from 'helpers/utils';
import ImpresHeader from './impresHeader';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CardDropdown from 'components/common/CardDropdown';
import { formatDateToIST } from '../../helpers/utils';

const columns = [
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
    accessor: 'employeeID',
    Header: 'Employee ID',
  },
  {
    accessor: 'employeeName',
    Header: 'Employee Name',
  },
  {
    accessor: 'unitCodeWithName',
    Header: 'Unit',
  },
  {
    accessor: 'roomCode',
    Header: 'Room',
  },
  {
    accessor: 'vendorCode',
    Header: 'Vendor Code',
  },
  {
    accessor: 'vendorName',
    Header: 'vendor Name',
  },
  {
    accessor: 'credit',
    Header: 'Credit',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.credit', ''))}</>
    ),
  },
  {
    accessor: 'debit',
    Header: 'Debit',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.debit', ''))}</>
    ),
  },
  {
    accessor: 'month',
    Header: 'Month',
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
  {
    accessor: 'rejectedByName',
    Header: 'DoneBy',
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
  }
  // {
  //   accessor: 'id',
  //   Header: '',
  //   disableSortBy: true,
  //   cellProps: {
  //     className: 'text-end py-2',
  //   },
  //   Cell: (rowData) => {
  //     const status = get(rowData, 'row.values.isVerified', '');

  //     if (status === 'APPROVED') {
  //       return null;
  //     }
  //     return (
  //       <CardDropdown iconClassName="fs--1" drop="start">
  //         <div className="py-2">
  //           <Dropdown.Item
  //             as={Link}
  //             to={`/imprestholder-Transaction/${get(
  //               rowData,
  //               'row.values.id',
  //               '',
  //             )}`}
  //             className="text-danger"
  //           >
  //             Edit
  //           </Dropdown.Item>
  //         </div>
  //       </CardDropdown>
  //     );
  //   },
  // },
];

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
    accessor: 'employeeID',
    Header: 'Employee ID',
  },
  {
    accessor: 'employeeName',
    Header: 'Employee Name',
  },
  {
    accessor: 'unitCodeWithName',
    Header: 'Unit',
  },
  {
    accessor: 'roomCode',
    Header: 'Room',
  },
  {
    accessor: 'vendorCode',
    Header: 'Vendor Code',
  },
  {
    accessor: 'vendorName',
    Header: 'vendor Name',
  },
  {
    accessor: 'credit',
    Header: 'Credit',
  },
  {
    accessor: 'debit',
    Header: 'Debit',
  },
  {
    accessor: 'month',
    Header: 'Month',
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
    accessor: 'status',
    Header: 'Status',
  },
];

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 2000,
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
  const { user } = useAuth();
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

  const token = get(user, 'token') + Math.random().toString(16).slice(2);
  const employeeNumber = Number(get(user, 'employeeId'));

  const { isLoading, error, data, isSuccess } = useQuery(
    [queryPageIndex, queryPageSize, queryPageFilter],
    () =>
      ImprestHolderTransactionAPI.fetchImprestHolderData(
        queryPageIndex,
        queryPageSize,
        queryPageFilter,
        employeeNumber,
        token,
      ),
    {
      keepPreviousData: true,
      staleTime: Infinity,
      cacheTime: 0,
    },
  );

  const totalPageCount = Math.ceil(totalCount / queryPageSize);

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
      manualPagination: true,
      pageCount: isSuccess ? totalPageCount : null,
    },
    usePagination,
  );

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
    const filename = `Imprest_Transaction${formattedDate}.xlsx`;

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
      (accumulator, item) =>
        item.isVerified !== 'REJECTED'
          ? accumulator + (item.debit || 0)
          : accumulator,
      0,
    ) || 0;
  const finalvalues = granTotalAmountdebit - granTotalAmountcredit;
  const formattedGranTotalAmountCredit = formattedAmount(finalvalues);
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
      {isSuccess ? (
        <>
          <Card>
            <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
              <div className="position-relative z-index-1 light">
                <h5 className="mb-0 text-white">Transaction List</h5>
              </div>
            </Card.Header>
            <Card.Header>
              <ImpresHeader
                onClickFilterCallback={onClickFilterCallback}
                defaultKeyword={keyword}
                exportAsExcel={onClickExportAsExcel}
                formattedGranTotalAmountCredit={formattedGranTotalAmountCredit}
                // onClickExportAsExcel={onClickExportAsExcel}
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
                    {[2000, 5000].map((pageSize) => (
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
