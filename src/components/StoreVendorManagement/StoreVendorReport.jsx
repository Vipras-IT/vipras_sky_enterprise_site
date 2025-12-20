/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import { Table, Card, Dropdown, Form, Button, Spinner } from 'react-bootstrap';
import PurchaseHeader from '../purchase/PurchaseHeader';
import { Link, useNavigate } from 'react-router-dom';
import CardDropdown from 'components/common/CardDropdown';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
//import purchaseAPI from 'api/purchase';
import vendorAPI from 'api/storeVendorPayment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import { formattedAmount } from 'helpers/utils';

const columns = [
  {
    accessor: 'purchaseDate',
    Header: 'Date',
    Cell: (rowData) => {
      const saleDate = new Date(get(rowData, 'row.values.purchaseDate', null));
      const month = saleDate.getMonth() + 1;
      const monthValue = month < 10 ? `0${month}` : `${month}`;
      const day = saleDate.getDate();
      const dayValue = day < 10 ? `0${day}` : `${day}`;
      const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
      return <>{formatDate}</>;
    },
  },
  {
    accessor: 'invocieNo',
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
    accessor: 'credit',
    Header: 'Credit (Rs.)',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.credit', ''))}</>
    ),
  },
  {
    accessor: 'debit',
    Header: 'Debit (Rs.)',
    Cell: (rowData) => (
      <>{formattedAmount(get(rowData, 'row.values.debit', ''))}</>
    ),
  },
  {
    accessor: 'tdsPercentage',
    Header: 'Tds Percentage',
  },
  {
    accessor: 'tdsAmount',
    Header: 'Tds Amount',
  },
  {
    accessor: 'modeOfPayment',
    Header: 'Mode of Payment',
  },

  //   {
  //     accessor: 'id',
  //     Header: '',
  //     disableSortBy: true,
  //     cellProps: {
  //       className: 'text-end py-2'
  //     },
  //     Cell: rowData => {
  //       return (
  //         <CardDropdown iconClassName="fs--1" drop="start">
  //           <div className="py-2">
  //             <Dropdown.Item
  //               as={Link}
  //               to={`/store-vendor-payment-management/${get(
  //                 rowData,
  //                 'row.values.id',
  //                 ''
  //               )}`}
  //               className="text-danger"
  //             >
  //               pay
  //             </Dropdown.Item>
  //           </div>
  //         </CardDropdown>
  //       );
  //     }
  //   }
];

const exportColumn = [
  {
    accessor: 'purchaseDate',
    Header: 'Date',
    Cell: (rowData) => {
      const saleDate = new Date(get(rowData, 'row.values.purchaseDate', null));
      const month = saleDate.getMonth() + 1;
      const monthValue = month < 10 ? `0${month}` : `${month}`;
      const day = saleDate.getDate();
      const dayValue = day < 10 ? `0${day}` : `${day}`;
      const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
      return <>{formatDate}</>;
    },
  },
  {
    accessor: 'invocieNo',
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
    accessor: 'credit',
    Header: 'Credit (Rs.)',
  },
  {
    accessor: 'debit',
    Header: 'Debit (Rs.)',
  },
  {
    accessor: 'tdsPercentage',
    Header: 'Tds Percentage',
  },
  {
    accessor: 'tdsAmount',
    Header: 'Tds Amount',
  },
  {
    accessor: 'modeOfPayment',
    Header: 'Mode of Payment',
  },
];

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 100,
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

function StoreVendorReport() {
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

  const { isLoading, error, data, isSuccess } = useQuery(
    [queryPageIndex, queryPageSize, queryPageFilter],
    () =>
      vendorAPI.fetchStoreVendordManagementData(
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
  //   const [allPurchaseData, setAllPurchaseData] = useState([]);
  //  setAllPurchaseData(date);
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
  //console.log("data ===============>", data);
  React.useEffect(() => {
    if (data?.hasError && data?.hasError == '401') {
      // logout();
      // navigate('/', { replace: true });
    }
  }, [data?.hasError]);

  const totalCredit =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.credit || 0),
      0,
    ) || 0;

  const totalDebit =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.debit || 0),
      0,
    ) || 0;

  const totalTds =
    data?.results?.reduce(
      (accumulator, item) => accumulator + (item.tdsAmount || 0),
      0,
    ) || 0;

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
    const filename = `Store_Vendor_Report_${formattedDate}.xlsx`;

    saveAs(blob, filename);
  };

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
              <PurchaseHeader
                onClickFilterCallback={onClickFilterCallback}
                defaultKeyword={keyword}
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
                  <b>TOTAL CREDIT : {formattedAmount(totalCredit)}</b>
                </div>
                <div>
                  {' '}
                  <b>TOTAL DEBIT : {formattedAmount(totalDebit)}</b>
                </div>

                <div>
                  {' '}
                  <b>TOTAL DEBIT : {formattedAmount(totalTds)}</b>
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
                    {[100, 200, 500, 1000].map((pageSize) => (
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

export default StoreVendorReport;
