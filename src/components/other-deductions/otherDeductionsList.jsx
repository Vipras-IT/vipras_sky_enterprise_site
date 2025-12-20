/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  Table,
  Card,
  Dropdown,
  Form,
  Button,
  Row,
  Spinner,
  Col,
} from 'react-bootstrap';

import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import otherDeductuionAPI from 'api/otherDeductions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import CardDropdown from 'components/common/CardDropdown';
import { Link } from 'react-router-dom';
import OtherDeductionsHeader from './otherDeductionsHeader';
import { formattedAmount } from 'helpers/utils';
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
    accessor: 'createdBy',
    Header: 'From Employee Id',
  },
  {
    accessor: 'employeeIDNumber',
    Header: 'To Employee Id',
  },
  {
    accessor: 'employeeName',
    Header: 'To Employee Name',
  },
  {
    accessor: 'designation',
    Header: 'Designation',
  },
  {
    accessor: 'unitCode',
    Header: 'Unit Code',
  },
  {
    accessor: 'advance',
    Header: 'Advance',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.advance', ''))}</>
    ),
  },
  {
    accessor: 'transport',
    Header: 'Transport',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.transport', ''))}</>
    ),
  },
  {
    accessor: 'fine',
    Header: 'Fine',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.fine', ''))}</>
    ),
  },
  {
    accessor: 'viprasMart',
    Header: 'ViprasMart',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.viprasMart', ''))}</>
    ),
  },
  {
    accessor: 'attendanceBonus',
    Header: 'Attendance Bonus',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.attendanceBonus', ''))}</>
    ),
  },
  {
    accessor: 'additionalIdCard',
    Header: 'Additional Id Card',
  },
  {
    accessor: 'others',
    Header: 'Others',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.others', ''))}</>
    ),
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
              to={`/other-deductions-singleView/${get(
                rowData,
                'row.values.id',
                '',
              )}`}
              className="text-warning"
            >
              View
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to={`/other-deductions/${get(rowData, 'row.values.id', '')}`}
              className="text-danger"
            >
              Edit
            </Dropdown.Item>
          </div>
        </CardDropdown>
      );
    },
  },
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
    accessor: 'employeeName',
    Header: 'Employee Name',
  },
  {
    accessor: 'employeeIDNumber',
    Header: 'Employee Id',
  },
  {
    accessor: 'designation',
    Header: 'Designation',
  },
  {
    accessor: 'unitCode',
    Header: 'Unit Code',
  },
  {
    accessor: 'advance',
    Header: 'Advance',
  },
  {
    accessor: 'transport',
    Header: 'Transport',
  },
  {
    accessor: 'fine',
    Header: 'Fine',
  },
  {
    accessor: 'viprasMart',
    Header: 'ViprasMart',
  },
  {
    accessor: 'attendanceBonus',
    Header: 'Attendance Bonus',
  },
  {
    accessor: 'additionalIdCard',
    Header: 'Additional Id Card',
  },
  {
    accessor: 'others',
    Header: ' Additional Deduction',
  },
];

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 500,
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

function OtherDeductionsList() {
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

  const { isLoading, error, data, isSuccess } = useQuery(
    [queryPageIndex, queryPageSize, queryPageFilter],
    () =>
      otherDeductuionAPI.fetchOtherDeductuionData(
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
    const filename = `Other_Deductions_Report_${formattedDate}.xlsx`;

    saveAs(blob, filename);
  };

  React.useEffect(() => {
    if (data?.count) {
      dispatch({
        type: total_count_changed,
        payload: data.count,
      });
    }
  }, [data?.count]);

  const totalAdvances =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.advance || 0),
      0,
    ) || 0;
  const totalTransport =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.transport || 0),
      0,
    ) || 0;
  const totalFine =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.fine || 0),
      0,
    ) || 0;
  const totalViprasMart =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.viprasMart || 0),
      0,
    ) || 0;
  const totalAttendanceBonus =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.attendanceBonus || 0),
      0,
    ) || 0;
  const totalAdditionalIdCard =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.additionalIdCard || 0),
      0,
    ) || 0;
  const totalOthers =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.others || 0),
      0,
    ) || 0;

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
                <h5 className="mb-0 text-white">All Other Deductions Report</h5>
              </div>
            </Card.Header>
            <Card.Header>
              <OtherDeductionsHeader
                onClickFilterCallback={onClickFilterCallback}
                defaultKeyword={keyword}
                totalCount={totalCount}
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
                  <Form.Select
                    size="sm"
                    className="me-2"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                    }}
                  >
                    {[500, 1000, 1500].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
              &nbsp;
              <Row className="g-2 mb-3">
                <Col span={3}>
                  <div>
                    {' '}
                    <b>TOTAL ADVANCES : {formattedAmount(totalAdvances)}</b>
                  </div>
                </Col>
                <Col span={3}>
                  <div>
                    <b>TOTAL TRANSPORT :{formattedAmount(totalTransport)}</b>
                  </div>
                </Col>
                <Col span={3}>
                  <div>
                    <b>TOTAL FINE :{formattedAmount(totalFine)}</b>
                  </div>
                </Col>
                <Col span={3}>
                  <div>
                    <b>TOTAL VIPRAS MART :{formattedAmount(totalViprasMart)}</b>
                  </div>
                </Col>
              </Row>
              <Row className="g-2 mb-3">
                <Col span={3}>
                  <div>
                    <b>
                      TOTAL ATTENDANCE BONUS :
                      {formattedAmount(totalAttendanceBonus)}
                    </b>
                  </div>
                </Col>
                <Col span={3}>
                  <div>
                    <b>
                      TOTAL ADDITIONAL ID CARD :
                      {formattedAmount(totalAdditionalIdCard)}
                    </b>
                  </div>
                </Col>
                <Col span={3}>
                  <div>
                    <b>
                      TOTAL ADDITIONAL DEDUCTION :{formattedAmount(totalOthers)}
                    </b>
                  </div>
                </Col>
                <Col span={3}></Col>
              </Row>
            </Card.Footer>
          </Card>
        </>
      ) : null}
    </>
  );
}

export default OtherDeductionsList;
