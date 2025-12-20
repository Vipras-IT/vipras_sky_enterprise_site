/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import { Table, Card, Form, Button, Spinner } from 'react-bootstrap';
// import ManualAttendanceReportHeader from '../attendance/ManualAttendanceReportHeader';
import { useNavigate } from 'react-router-dom';
// import CardDropdown from 'components/common/CardDropdown';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import manualAttendanceAPI from 'api/manualAttendance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import YourManualAttendanceReportHeader from './YourManualAttendanceReportHeader';
import { getMonthNames } from 'helpers/utils';

const columns = [
  {
    accessor: 'employeeName',
    Header: 'Employee Name',
  },
  {
    accessor: 'employeeNumber',
    Header: 'Employee Number',
  },
  {
    accessor: 'siteId',
    Header: 'SiteId',
  },
  {
    accessor: 'date',
    Header: 'Attendance Date',
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
    accessor: 'shift',
    Header: 'Shift Options',
    Cell: (rowData) => {
      const shiftOption = get(rowData, 'row.values.shift', '');
      const shiftValue = shiftOption.split('-')[1];
      return <>{shiftValue}</>;
    },
  },
  {
    accessor: 'noOfDuty',
    Header: 'No of Duty',
  },
  {
    accessor: 'assignedFor',
    Header: 'Assigned Designation',
  },
  {
    accessor: 'assignedRole',
    Header: 'Assigned For',
  },
  {
    accessor: 'operationManager',
    Header: 'Authorized Officer',
  },
  {
    accessor: 'operationManagerId',
    Header: 'Authorized Officer ID',
  },
  {
    accessor: 'month',
    Header: 'Month',
  },
];

const exportColumn = [
  {
    accessor: 'employeeName',
    Header: 'Employee Name',
  },
  {
    accessor: 'employeeNumber',
    Header: 'Employee Number',
  },
  {
    accessor: 'siteId',
    Header: 'SiteId',
  },
  {
    accessor: 'date',
    Header: 'Attendance Date',
  },
  {
    accessor: 'shift',
    Header: 'Shift',
  },
  {
    accessor: 'noOfDuty',
    Header: 'No of Duty',
  },
  {
    accessor: 'assignedFor',
    Header: 'Assigned Designation',
  },
  {
    accessor: 'assignedRole',
    Header: 'Assigned For',
  },
  {
    accessor: 'operationManager',
    Header: 'Authorized Officer',
  },
  {
    accessor: 'operationManagerId',
    Header: 'Authorized Officer ID',
  },
  {
    accessor: 'month',
    Header: 'Month',
  },
];

const onClickExportAsExcel = (page) => {
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

  saveAs(blob, 'ManualAttendanceReport.xlsx');
};

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 2000,
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

function YourManualAttendanceReport() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  const token = get(user, 'token');
  const employeeNumber = Number(get(user, 'employeeId'));
  const [todayYears, setTodayYears] = useState('');
  const [todayMonth, setTodayMonth] = useState('');

  const { isLoading, error, data, isSuccess } = useQuery(
    [queryPageIndex, queryPageSize, queryPageFilter, todayYears, todayMonth],
    () =>
      manualAttendanceAPI.fetchYourManualattendanceData(
        queryPageIndex,
        queryPageSize,
        queryPageFilter,
        employeeNumber,
        todayYears,
        todayMonth,
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

  const handleChangeYear = (value) => {
    console.log(value);
    setTodayYears(value);
  };

  const handleChangeMonth = (value) => {
    console.log(value);
    setTodayMonth(value);
  };

  const todayDate = new Date();
  const monthList = getMonthNames(todayDate.getFullYear());
  const [month, setMonth] = useState(monthList);
  const [todayMonths, setTodayMonths] = useState(todayDate.getMonth());

  React.useEffect(() => {
    const currentYear = todayDate.getFullYear();
    const currentMonthNamelabel = month[todayMonths].label;
    setTodayYears(currentYear);
    setTodayMonth(currentMonthNamelabel);
  }, []);

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



  return (
    <>
      {isSuccess ? (
        <>
          <Card>
            <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
              <div className="position-relative z-index-1 light">
                <h5 className="mb-0 text-white">Manual Attendance Report</h5>
              </div>
            </Card.Header>
            <Card.Header>
              <YourManualAttendanceReportHeader
                onClickFilterCallback={onClickFilterCallback}
                defaultKeyword={keyword}
                exportAsExcel={() => onClickExportAsExcel(page)}
                onPressChangeYear={handleChangeYear}
                onPressChangeMonth={handleChangeMonth}
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
                  <Form.Select
                    size="md"
                    className="me-2"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                    }}
                  >
                    {[100, 200, 300, 400, 500, 'All'].map((pageSize) => (
                      <option
                        key={pageSize}
                        value={pageSize === 'All' ?  data?.count || 0 : pageSize}
                      >
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

export default YourManualAttendanceReport;
