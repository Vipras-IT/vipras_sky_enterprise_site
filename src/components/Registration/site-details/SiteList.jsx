/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import { Table, Card, Dropdown, Form, Button, Spinner } from 'react-bootstrap';
import SiteHeader from './SiteHeader';
import { Link } from 'react-router-dom';
import CardDropdown from 'components/common/CardDropdown';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import siteAPI from 'api/siteCreation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formattedAmount } from 'helpers/utils';

const columns = [
  {
    accessor: 'startdate',
    Header: 'Start Date',
  },
  {
    accessor: 'unitcode',
    Header: 'Unit Code',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'siteName',
    Header: 'Site Name',
  },
  {
    accessor: 'agreedmanpower',
    Header: 'Agreed Manpower',
  },
  {
    accessor: 'location',
    Header: 'Location',
  },
  {
    accessor: 'deployment',
    Header: 'Deployment',
    Cell: (rowData) => {
      return <>{get(rowData, 'row.values.deployment', []).join(' , ')}</>;
    },
  },
  {
    accessor: 'branchCode',
    Header: 'Branch Code',
  },
  {
    accessor: 'agreedamount',
    Header: 'Agreed Amount',
    Cell: (rowData) => {
      const amount = get(rowData, 'row.values.agreedamount', 0);
      return <>{formattedAmount(Number(amount) || '')}</>;
    },
  },
  {
    accessor: 'personName',
    Header: 'Person Name',
  },
  {
    accessor: 'personNumber',
    Header: 'content number',
  },
  {
    accessor: 'personGmail',
    Header: 'Mail',
  },
  {
    accessor: 'renewalDate',
    Header: 'Renewal Date',
    Cell: (rowData) => {
      const test = get(rowData, 'row.values.renewalDate', null);
      if (test !== null) {
        const saleDate = new Date(get(rowData, 'row.values.renewalDate', null));
        const month = saleDate.getMonth() + 1;
        const monthValue = month < 10 ? `0${month}` : `${month}`;
        const day = saleDate.getDate();
        const dayValue = day < 10 ? `0${day}` : `${day}`;
        const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
        return <>{formatDate}</>;
      }
      return <> </>;
    },
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
              to={`/sitesingleview/${get(rowData, 'row.values.id', '')}`}
              className="text-warning"
            >
              View
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to={`/sitecreation/${get(rowData, 'row.values.id', '')}`}
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
    accessor: 'startdate',
    Header: 'Start Date',
  },
  {
    accessor: 'unitcode',
    Header: 'Unit Code',
  },
  {
    accessor: 'siteName',
    Header: 'Site Name',
  },
  {
    accessor: 'agreedmanpower',
    Header: 'No of MP',
  },
  {
    accessor: 'location',
    Header: 'Location',
  },
  {
    accessor: 'deployment',
    Header: 'Deployment',
  },
  {
    accessor: 'country',
    Header: 'Country',
  },
  {
    accessor: 'state',
    Header: 'State',
  },
  {
    accessor: 'city',
    Header: 'City',
  },
  {
    accessor: 'branchCode',
    Header: 'Branch Code',
  },
  {
    accessor: 'builderName',
    Header: 'Builder Name',
  },
  {
    accessor: 'personName',
    Header: 'Person Name',
  },
  {
    accessor: 'renewalDate',
    Header: 'Renewal Date',
  },
  {
    accessor: 'personNumber',
    Header: 'content number',
  },
  {
    accessor: 'personGmail',
    Header: 'Mail',
  },
  {
    accessor: 'agreedamount',
    Header: 'Agreed Amount',
  },
  {
    accessor: 'agreedot',
    Header: 'Agreed OT',
  },
  {
    accessor: 'agreedweekoff',
    Header: 'Agreed Week off',
  },
  {
    accessor: 'securityweekoff',
    Header: 'Security week off',
  },
  {
    accessor: 'agreedholiday',
    Header: 'Agreed Holiday',
  },
  {
    accessor: 'creditPeriod',
    Header: 'Credit Period',
  },
  {
    accessor: 'gstNumber',
    Header: 'GST Number',
  },
  {
    accessor: 'hkConsumableBudget',
    Header: 'HK Consumable Budget',
  },
  {
    accessor: 'hkConsumableAmount',
    Header: 'HK Consumable Amount',
  },
];

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

function SiteList() {
  const { user, logout } = useAuth();
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
      siteAPI.fetchSiteData(
        queryPageIndex,
        queryPageSize,
        queryPageFilter,
        siteId,
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
  //console.log(data.count);
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

    saveAs(blob, 'SiteData.xlsx');
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

  const totalAgreedAmount =
    data?.results?.reduce((accumulator, item) => {
      const fine = Number(item.agreedamount);
      return accumulator + (isNaN(fine) ? 0 : fine);
    }, 0) || 0;

  const totalAgreedManpower =
    data?.results?.reduce((accumulator, item) => {
      const fine = Number(item.agreedmanpower);
      return accumulator + (isNaN(fine) ? 0 : fine);
    }, 0) || 0;

  return (
    <>
      {isSuccess ? (
        <>
          <Card>
            <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
              <div className="position-relative z-index-1 light">
                <h5 className="mb-0 text-white">All Sites Report</h5>
              </div>
            </Card.Header>
            <Card.Header>
              <SiteHeader
                onClickFilterCallback={onClickFilterCallback}
                defaultKeyword={keyword}
                exportAsExcel={onClickExportAsExcel}
                count={data.count}
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
                  <b>
                    TOTAL AGREED AMOUNT :{formattedAmount(totalAgreedAmount)}
                  </b>{' '}
                </div>
                <div>
                  <b>
                    TOTAL AGREED MAN POWER :
                    {formattedAmount(totalAgreedManpower)}
                  </b>{' '}
                </div>
                ;
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

export default SiteList;
