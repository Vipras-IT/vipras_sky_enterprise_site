/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import { Table, Card, Dropdown, Form, Button, Spinner } from 'react-bootstrap';
// import PurchaseHeader from './PurchaseHeader';
// import consumableHeader from './consumableHeader';
import { Link, useNavigate } from 'react-router-dom';
import CardDropdown from 'components/common/CardDropdown';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import purchaseHKAPI from 'api/purchase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import ConsumableHeader from './consumableHeader';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formattedAmount } from 'helpers/utils';
const columns = [
  {
    accessor: 'date',
    Header: 'Purchase Date',
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
    accessor: 'invoiceNo',
    Header: 'Invoice No',
  },
  {
    accessor: 'vendorName',
    Header: 'Vendor Name',
  },
  {
    accessor: 'vendorCode',
    Header: 'Vendor Code',
  },
  {
    accessor: 'cGSTPercentage',
    Header: 'CGST (%)',
  },
  {
    accessor: 'sGSTPercentage',
    Header: 'SGST (%)',
  },
  {
    accessor: 'iGSTPercentage',
    Header: 'IGST (%)',
  },
  {
    accessor: 'totalAmount',
    Header: 'Amount',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.totalAmount', ''))}</>
    ),
  },
  {
    accessor: 'cGSTAmount',
    Header: 'CGST',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.cGSTAmount', ''))}</>
    ),
  },
  {
    accessor: 'sGSTAmount',
    Header: 'SGST',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.sGSTAmount', ''))}</>
    ),
  },
  {
    accessor: 'iGSTAmount',
    Header: 'IGST',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.iGSTAmount', ''))}</>
    ),
  },
  {
    accessor: 'grantTotal',
    Header: 'GrantTotal',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.grantTotal', ''))}</>
    ),
  },
  {
    accessor: 'unitCode',
    Header: 'Unit Code',
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
              to={`/storepurchasesingleview/${get(
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
              to={`/hkpurchase/${get(rowData, 'row.values.id', '')}`}
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
    Header: 'Purchase Date',
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
    accessor: 'invoiceNo',
    Header: 'Invoice No',
  },
  {
    accessor: 'vendorName',
    Header: 'Vendor Name',
  },
  {
    accessor: 'vendorCode',
    Header: 'Vendor Code',
  },
  {
    accessor: 'cGSTPercentage',
    Header: 'CGST (%)',
  },
  {
    accessor: 'sGSTPercentage',
    Header: 'SGST (%)',
  },
  {
    accessor: 'iGSTPercentage',
    Header: 'IGST (%)',
  },
  {
    accessor: 'totalAmount',
    Header: 'Amount',
  },
  {
    accessor: 'cGSTAmount',
    Header: 'CGST',
  },
  {
    accessor: 'sGSTAmount',
    Header: 'SGST',
  },
  {
    accessor: 'iGSTAmount',
    Header: 'IGST',
  },
  {
    accessor: 'grantTotal',
    Header: 'GrantTotal',
  },
  {
    accessor: 'unitCode',
    Header: 'Unit Code',
  },
];

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 200,
  totalCount: null,
  queryPageFilter: { key: '', value: '' },
};

const page_changed = 'page_changed';
const page_size_changed = 'page_size_changed';
const total_count_changed = 'total_count_changed';
const page_filter_changed = 'page_filter_changed';

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

function HKPurchaseList() {
  const { user } = useAuth();
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
  const todayDate = new Date();
  const initialYear = todayDate.getFullYear();
  const initialMonth = String(todayDate.getMonth() + 1).padStart(2, '0');
  const [todayYears, setTodayYears] = useState(initialYear);
  const [todayMonth, setTodayMonth] = useState(initialMonth);
  const { isLoading, error, data, isSuccess } = useQuery(
    [queryPageIndex, queryPageSize, queryPageFilter],
    () =>
      purchaseHKAPI.fetchpurchaseHKData(
        queryPageIndex,
        queryPageSize,
        queryPageFilter,
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
  //   const [allPurchaseData, setAllPurchaseData] = useState([]);
  //  setAllPurchaseData(date);
  React.useEffect(() => {
    dispatch({ type: page_changed, payload: pageIndex });
  }, [pageIndex]);

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
    const filename = `Consumable_Purchase_${formattedDate}.xlsx`;

    saveAs(blob, filename);
  };

  React.useEffect(() => {
    dispatch({ type: page_size_changed, payload: pageSize });
    gotoPage(0);
  }, [pageSize, gotoPage]);

  const totalAmounts =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.totalAmount || 0),
      0,
    ) || 0;
  const grantTotals =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.grantTotal || 0),
      0,
    ) || 0;

  React.useEffect(() => {
    if (useFilter) {
      dispatch({ type: page_filter_changed, payload: keyword });
      gotoPage(0);
    }
  }, [keyword, gotoPage, useFilter]);

   const handleChangeYear = (value) => {
      setTodayYears(value);
    };
  
    const handleChangeMonth = (value) => {
      setTodayMonth(value);
    };
  
    React.useEffect(() => {
      setTodayYears(todayYears);
      setTodayMonth(todayMonth);
    }, []);

  React.useEffect(() => {
    if (data?.count) {
      dispatch({
        type: total_count_changed,
        payload: data.count,
      });
    }
  }, [data?.count]);
  //console.log("data ===============>", data);
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
            <Card.Header>
              <ConsumableHeader
                onClickFilterCallback={onClickFilterCallback}
                defaultKeyword={keyword}
                exportAsExcel={onClickExportAsExcel}
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
                  {' '}
                  <b>TOTAL AMOUNT : {formattedAmount(totalAmounts)}</b>
                </div>
                <div>
                  {' '}
                  <b>TOTAL GRANT TOTAL : {formattedAmount(grantTotals)}</b>
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
                    {[200, 400, 600].map((pageSize) => (
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

export default HKPurchaseList;
