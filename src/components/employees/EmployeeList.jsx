/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import { Table, Card, Dropdown, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CardDropdown from 'components/common/CardDropdown';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import { fetchEmployeeData } from 'api/getEmployeeData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import EmployeesHeader from './EmployeesHeader';
import { formattedAmount } from 'helpers/utils';

const columns = [
  {
    accessor: 'employeeNumber',
    Header: 'Employee Number',
  },
  {
    accessor: 'employeeName',
    Header: 'Employee name',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'siteCode',
    Header: 'Unit Code',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'siteName',
    Header: 'Site Name',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'role',
    Header: 'Designation',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'documents.pfNumber',
    Header: 'UAN Number',
  },
  {
    accessor: 'documents.esiNumber',
    Header: 'ESI Number',
  },
  {
    accessor: 'bankDetails.accountNumber',
    Header: 'AC Number',
  },
  {
    accessor: 'totalSalary',
    Header: 'Salary',
    Cell: (rowData) => {
      const data = get(rowData, 'value', '');
      const finalData = formattedAmount(Number(data));
      return <>{finalData}</>;
    },
  },
  {
    accessor: 'documents.joiningDate',
    Header: 'Joining Date',
    Cell: (rowData) => {
      const joiningDate = get(rowData, 'value', null);
      const saleDate = new Date(joiningDate);
      const month = saleDate.getMonth() + 1;
      const monthValue = month < 10 ? `0${month}` : `${month}`;
      const day = saleDate.getDate();
      const dayValue = day < 10 ? `0${day}` : `${day}`;
      const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
      return <>{formatDate}</>;
    },
  },
  {
    accessor: 'department',
    Header: 'Department',
  },
  {
    accessor: 'createdBy',
    Header: 'Created By ID',
  },
  {
    accessor: 'createdByName',
    Header: 'Created By Name',
  },
  {
    accessor: 'id',
    Header: '',
    disableSortBy: true,
    cellProps: {
      className: 'text-end py-2',
    },
    Cell: (rowData) => {
      return (
        <CardDropdown iconClassName="fs--1" drop="start">
          <div className="py-2">
            <Dropdown.Item
              as={Link}
              to={`/employeeview/${get(rowData, 'row.values.id', '')}`}
              className="text-warning"
            >
              View
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to={`/registration/${get(rowData, 'row.values.id', '')}`}
              className="text-success"
            >
              Edit
            </Dropdown.Item>
          </div>
        </CardDropdown>
      );
    },
  },
];

const columnsForFm = [
  {
    accessor: 'employeeNumber',
    Header: 'Employee Number',
  },
  {
    accessor: 'employeeName',
    Header: 'Employee name',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'siteCode',
    Header: 'Unit Code',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'siteName',
    Header: 'Site Name',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'role',
    Header: 'Designation',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'permanentAddress.address',
    Header: 'Address',
  },
  {
    accessor: 'employeeDOB',
    Header: 'Date of birth',
  },
  {
    accessor: 'id',
    Header: '',
    disableSortBy: true,
    cellProps: {
      className: 'text-end py-2',
    },
    Cell: (rowData) => {
      return (
        <CardDropdown iconClassName="fs--1" drop="start">
          <div className="py-2">
            <Dropdown.Item
              as={Link}
              to={`/employeeview/${get(rowData, 'row.values.id', '')}`}
              className="text-warning"
            >
              View
            </Dropdown.Item>
          </div>
        </CardDropdown>
      );
    },
  },
];

const exportColumn = [
  {
    accessor: 'employeeNumber',
    Header: 'Employee Number',
  },
  {
    accessor: 'employeeName',
    Header: 'Employee name',
  },
  {
    accessor: 'siteCode',
    Header: 'Unit Code',
  },
  {
    accessor: 'siteName',
    Header: 'Site Name',
  },
  {
    accessor: 'role',
    Header: 'Designation',
  },
  {
    accessor: 'documents.pfNumber',
    Header: 'UAN Number',
  },
  {
    accessor: 'documents.others',
    Header: 'Others',
  },
  {
    accessor: 'documents.others1',
    Header: 'Others1',
  },
  {
    accessor: 'permanentAddress.address',
    Header: 'Address',
  },
  {
    accessor: 'employeeDOB',
    Header: 'Date of birth',
  },
  {
    accessor: 'gender',
    Header: 'Gender',
  },
  {
    accessor: 'aadharNumber',
    Header: 'Aadhar Number',
  },
  {
    accessor: 'fatherName',
    Header: 'Father Name',
  },
  {
    accessor: 'bankDetails.accountHolderName',
    Header: 'Account Holder Name',
  },
  {
    accessor: 'bankDetails.accountNumber',
    Header: 'Account Number',
  },
  {
    accessor: 'bankDetails.bankName',
    Header: 'BankName',
  },
  {
    accessor: 'bankDetails.branch',
    Header: 'Branch',
  },
  {
    accessor: 'bankDetails.ifscode',
    Header: 'IFSC code',
  },
  {
    accessor: 'bankDetails.internetBank',
    Header: 'Internet Bank',
  },
  {
    accessor: 'bloodGroup',
    Header: 'Blood Group',
  },
  {
    accessor: 'documents.joiningDate',
    Header: 'Joining Date',
  },
  {
    accessor: 'department',
    Header: 'Department',
  },
  {
    accessor: 'totalSalary',
    Header: 'Salary',
  },
  {
    accessor: 'documents.panCardNumber',
    Header: 'Pan Card Number',
  },
  {
    accessor: 'documents.pfNumber',
    Header: 'PF Number',
  },
  {
    accessor: 'documents.esiNumber',
    Header: 'ESI Number',
  },
  {
    accessor: 'localAddress.contactNumber',
    Header: 'Contact Number',
  },
  {
    accessor: 'createdBy',
    Header: 'Created By ID',
  },
  {
    accessor: 'createdByName',
    Header: 'Created By Name',
  },
];

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 5000,
  totalCount: null,
  queryPageFilter: { key: '', value: '' },
};

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_CHANGED:
      return {
        ...state,
        queryPageIndex: payload,
      };
    case PAGE_SIZE_CHANGED:
      return {
        ...state,
        queryPageSize: payload,
      };
    case PAGE_FILTER_CHANGED:
      return {
        ...state,
        queryPageFilter: payload,
      };
    case TOTAL_COUNT_CHANGED:
      return {
        ...state,
        totalCount: payload,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

function EmployeesTable() {
  const { user } = useAuth();
  const [
    { queryPageIndex, queryPageSize, totalCount, queryPageFilter },
    dispatch,
  ] = React.useReducer(reducer, initialState);

  const [keyword, setKeyword] = useState({ key: '', value: '' });
  const [useFilter, setUseFilter] = useState(false);
  const onClickFilterCallback = (filter) => {
    setUseFilter(true);
    setKeyword(filter);
  };

  const siteId = get(user, 'unitCodes');

  const { isLoading, error, data, isSuccess } = useQuery(
    [queryPageIndex, queryPageSize, queryPageFilter],
    () =>
      fetchEmployeeData(queryPageIndex, queryPageSize, queryPageFilter, siteId),
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
      columns:
        user.role === 'ADMIN' ||
        user.role === 'SUPER_ADMIN' ||
        user.role === 'HR'
          ? columns
          : columnsForFm,
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

    saveAs(blob, 'EmployeeData.xlsx');
  };

  React.useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);

  React.useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
    gotoPage(0);
  }, [pageSize, gotoPage]);

  React.useEffect(() => {
    if (useFilter) {
      dispatch({ type: PAGE_FILTER_CHANGED, payload: keyword });
      gotoPage(0);
    }
  }, [keyword, gotoPage, useFilter]);

  React.useEffect(() => {
    if (data?.count) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.count,
      });
    }
  }, [data?.count]);

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

  const totalAdvances =
    data?.results?.reduce(
      (accumulator, item) =>
        accumulator + Number(item.totalSalary || 0),
      0,
    ) || 0;

  return (
    <>
      {isSuccess ? (
        <>
          <Card>
            <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
              <div className="position-relative z-index-1 light">
                <h5 className="mb-0 text-white">All Employees Report</h5>
              </div>
            </Card.Header>
            <Card.Header>
              <EmployeesHeader
                onClickFilterCallback={onClickFilterCallback}
                defaultKeyword={keyword}
                exportAsExcel={onClickExportAsExcel}
                totalCount={totalCount}
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
                  <b>TOTAL SALARY : {formattedAmount(totalAdvances)}</b>
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
                    {[5000].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize === 5000 ? 'Show All' : `Show ${pageSize}`}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </>
      ) : null}
      {/* <EmployeesHeader totalCount={totalCount}/> */}
    </>
  );
}

export default EmployeesTable;
