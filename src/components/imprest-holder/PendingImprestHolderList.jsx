/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
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
import { formattedAmount, getErrorMessage } from 'helpers/utils';
import ImpresHeader from './impresHeader';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { Checkbox } from 'antd';

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
    accessor: 'imprestholderId',
    Header: 'Imprest Holder Id',
  },
  {
    accessor: 'imprestholderName',
    Header: 'Imprest Holder Name',
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
    accessor: 'id',
    Header: 'Action',
    Cell: (rowData) => (
      <div>
        <Button
          type="link"
          href={`/pending-details/${get(rowData, 'row.values.id', '')}`}
        >
          <span className="d-none d-sm-inline-block ms-1">APP / REJ</span>
        </Button>
        {/* <Button>
          <Link
            to={`/pending-details/${get(rowData, 'row.values.id', '')}`}
            style={{ textDecorationColor: 'white' }}
          >
            <span className="d-none d-sm-inline-block ms-1">REJECT</span>
          </Link>
        </Button> */}
        {/* <Link
          onClick={() => handleVerify(get(rowData, 'row.values.id', ''), true)}
        >
          APPROV
        </Link>
        &nbsp; / &nbsp;
        <Link to={`/pending-details/${get(rowData, 'row.values.id', '')}`}>
          REJECT
        </Link> */}
      </div>
    ),
  },
];
const handleVerify = async (id, isVerified) => {
  const response = await ImprestHolderTransactionAPI.getSubTransdetails(id);
  const errorMessage = getErrorMessage(response);
  if (errorMessage) {
    toast.error(errorMessage, {
      theme: 'colored',
    });
  } else {
    const responseData = get(response, 'data.data', {});
    handleApprovel(responseData, id, isVerified);
  }
};
const handleApprovel = async (responseData, id, Verified) => {
  delete responseData.createdOn;
  delete responseData.updatedOn;
  const updatedData = {
    ...responseData,
    id: id,
    isVerified: Verified ? 'APPROVED' : 'REJECTED',
  };
  const response =
    await ImprestHolderTransactionAPI.updateSubTransdetails(updatedData);
  const puterrorMessage = getErrorMessage(response);
  if (puterrorMessage) {
    toast.error(puterrorMessage, {
      theme: 'colored',
    });
  } else {
    toast.success('Imprest Holder Verified successfully', {
      theme: 'colored',
    });
    window.location.reload();
  }
};
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
    accessor: 'imprestholderId',
    Header: 'Imprest Holder Id',
  },
  {
    accessor: 'imprestholderName',
    Header: 'Imprest Holder Name',
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
    accessor: '',
    Header: 'Verified By',
  },
];

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 400,
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

function PendingImprestHolderTransactionList() {
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
      ImprestHolderTransactionAPI.fetchPendingImprestHolderData(
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
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
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
    const filename = `Pending_Transaction${formattedDate}.xlsx`;

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
                <h5 className="mb-0 text-white">Pending Transaction List</h5>
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
                    className: 'fs--1 mb-0 ',
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
                    {[400, 800, 1200, 1600, 2000].map((pageSize) => (
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

export default PendingImprestHolderTransactionList;
