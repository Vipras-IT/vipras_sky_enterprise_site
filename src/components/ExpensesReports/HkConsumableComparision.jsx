/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Table, Card, Form, Spinner } from 'react-bootstrap';
import { Col, Row, Space, Select, Button } from 'antd';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import {
  formattedAmount,
  monthNames,
  disableFutureDates,
} from 'helpers/utils';
import invoiceApi from 'api/invoiceApi';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const columns = [
  {
    accessor: 'siteId',
    Header: 'Unit Code',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'siteName',
    Header: 'Unit Name',
  },
  {
    accessor: 'billingAmount',
    Header: 'Budget Amount',
    Cell: (rowData) => {
      return (
        <>{formattedAmount(get(rowData, 'row.values.billingAmount', null))}</>
      );
    },
  },
  {
    accessor: 'grossSalary',
    Header: 'Purchase Amount',
    Cell: (rowData) => {
      return (
        <>{formattedAmount(get(rowData, 'row.values.grossSalary', null))}</>
      );
    },
  },
  {
    accessor: 'profitOrLoss',
    Header: 'Profit or Loss',
    Cell: ({ row }) => {
      const { billingAmount, grossSalary } = row.original;
      const difference = billingAmount - grossSalary;
      return difference >= 0
        ? `${formattedAmount(difference)}`
        : `${formattedAmount(difference)}`;
    },
  },
];

const exportColumn = [
  {
    accessor: 'siteId',
    Header: 'Unit Code',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'siteName',
    Header: 'Unit Name',
  },
  {
    accessor: 'billingAmount',
    Header: 'Budget Amount',
  },
  {
    accessor: 'grossSalary',
    Header: 'Purchase Amount',
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

function HkConsumableComparision() {
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

  const currentYear = new Date().getFullYear();
  // const years = Array.from({ length: 10 }, (_, index) => currentYear - index);

  const [value, setValue] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(monthNames[0].value);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { isLoading, error, data, isSuccess } = useQuery(
    [
      queryPageIndex,
      queryPageSize,
      queryPageFilter,
      selectedMonth,
      selectedYear,
    ],
    () => invoiceApi.getHkConsumable(selectedMonth, selectedYear),
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
    const filename = `HK-Consumable-Comparision_${formattedDate}.xlsx`;

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
      (accumulator, item) => accumulator + (item.billingAmount || 0),
      0,
    ) || 0;

  const totalGrossSalary =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.grossSalary || 0),
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


  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const style = {
    padding: '8px 0',
  };

  return (
    <>
      {isSuccess ? (
        <>
          <Card>
            <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
              <div className="position-relative z-index-1 light">
                <h5 className="mb-0 text-white">Hk Consumable Comparison</h5>
              </div>
            </Card.Header>
            <Row align="middle">
              <Col style={style} span={13} offset={1}>
                <Space wrap>
                  <DatePicker
                    format="MMM yyyy"
                    caretAs={BsCalendar2MonthFill}
                    value={value}
                    onChange={handleChange}
                    shouldDisableDate={disableFutureDates}
                  />
                  <div id="orders-actions">
                    <IconButton
                      variant="primary"
                      size="sm"
                      icon="external-link-alt"
                      transform="shrink-3"
                      onClick={onClickExportAsExcel}
                    >
                      <span className="d-none d-sm-inline-block ms-1">
                        Export
                      </span>
                    </IconButton>
                  </div>
                </Space>
              </Col>
            </Row>
            <Card.Body className="p-0">
              <SimpleBarReact>
                <Table
                  {...getTableProps({
                    bordered: true,
                    striped: true,
                    className: 'fs--1 mb-0 overflow-hidden',
                  })}
                >
                  <thead className="bg-200 text-900 text-nowrap align-middle">
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
                  <b>TOTAL BUDGET: {formattedAmount(totalAdvances)}</b>
                </div>
                <div>
                  {' '}
                  <b>TOTAL PURCHASE: {formattedAmount(totalGrossSalary)}</b>
                </div>
                <div>
                  <b>
                    {totalAdvances - totalGrossSalary < 0 ? 'LOSS' : 'PROFIT'}:{' '}
                    {formattedAmount(totalAdvances - totalGrossSalary)}
                  </b>
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
            </Card.Footer>
          </Card>
        </>
      ) : null}
    </>
  );
}

export default HkConsumableComparision;
