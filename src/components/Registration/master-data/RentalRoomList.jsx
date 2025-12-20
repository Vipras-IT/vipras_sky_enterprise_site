/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery } from 'react-query';
import { Table, Card, Dropdown, Form, Button, Spinner } from 'react-bootstrap';
import RentalCreationAPI from 'api/rentalCreation';
import RentalRoomListHeader from './RentalRoomListHeader';
import { Link } from 'react-router-dom';
import CardDropdown from 'components/common/CardDropdown';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const columns = [
  {
    accessor: 'startDate',
    Header: 'Start Date',
  },
  {
    accessor: 'branchCode',
    Header: 'Branch Code',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'roomCode',
    Header: 'Rooms Code',
  },
  {
    accessor: 'roomsallottedUnit',
    Header: 'Rooms Alloted Unit',
  },
  {
    accessor: 'agreementExpiryDate',
    Header: 'Agreement Expiry Date',
  },
  {
    accessor: 'inchargePerson',
    Header: 'Incharge Person',
  },
  {
    accessor: 'inchargePersonNo',
    Header: 'Incharge Person No',
  },
  {
    accessor: 'agreementPeriod',
    Header: 'Agreement Period',
  },
  {
    accessor: 'contactNumber',
    Header: 'Contact Number',
  },
  {
    accessor: 'location',
    Header: 'Location',
  },
  {
    accessor: 'id',
    Header: 'Action',
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
              to={`/rentalsingleview/${get(rowData, 'row.values.id', '')}`}
              className="text-warning"
            >
              View
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to={`/add-new-rental-rooms/${get(rowData, 'row.values.id', '')}`}
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

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
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

function RentalRoomList() {
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

  const token = get(user, 'token');

  const { isLoading, error, data, isSuccess } = useQuery(
    [queryPageIndex, queryPageSize, queryPageFilter],
    () =>
      RentalCreationAPI.fetchRoomRentalData(
        queryPageIndex,
        queryPageSize,
        queryPageFilter,
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

  React.useEffect(() => {
    if (data?.count) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: data.count,
      });
    }
  }, [data?.count]);

  const exportColumn = [
    {
      accessor: 'startDate',
      Header: 'Start Date',
      // Cell: ({ value }) => {
      //   if (!value) return '';
      //   const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
      //   return format(parsedDate, 'dd MMM yyyy');
      // },
    },
    {
      accessor: 'branchCode',
      Header: 'Branch Code',
      headerProps: { className: 'pe-7' },
    },
    {
      accessor: 'roomCode',
      Header: 'Room Code',
    },
    {
      accessor: 'roomsallottedUnit',
      Header: 'Rooms Allotted Unit',
    },
    {
      accessor: 'inchargePerson',
      Header: 'Incharge Person',
    },
    {
      accessor: 'inchargePersonNo',
      Header: 'Incharge Person No',
    },
    {
      accessor: 'roomOwnersName',
      Header: "Room Owner's Name",
    },
    {
      accessor: 'contactNumber',
      Header: 'Contact Number',
    },
    {
      accessor: 'roomAddress',
      Header: 'Room Address',
    },
    {
      accessor: 'accountHolderName',
      Header: 'Account Holder Name',
    },
    {
      accessor: 'accountNo',
      Header: 'Account Number',
    },
    {
      accessor: 'bank',
      Header: 'Bank',
    },
    {
      accessor: 'branch',
      Header: 'Bank Branch',
    },
    {
      accessor: 'ifscCode',
      Header: 'IFSC Code',
    },
    {
      accessor: 'advanceAmount',
      Header: 'Advance Amount',
    },
    {
      accessor: 'rentalAmount',
      Header: 'Rental Amount',
    },
    {
      accessor: 'ebandWater',
      Header: 'EB & Water Charges',
    },
    {
      accessor: 'rentalDate',
      Header: 'Rental Date',
      // Cell: ({ value }) => {
      //   if (!value) return '';
      //   const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
      //   return format(parsedDate, 'dd MMM yyyy');
      // },
    },
    {
      accessor: 'agreementPeriod',
      Header: 'Agreement Period',
    },
    {
      accessor: 'agreementExpiryDate',
      Header: 'Agreement Expiry',
      // Cell: ({ value }) => {
      //   if (!value) return '';
      //   const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
      //   return format(parsedDate, 'dd MMM yyyy');
      // },
    },
    {
      accessor: 'capacityRoom',
      Header: 'Capacity',
    },
    {
      accessor: 'NoOfEmployeesAssigned',
      Header: 'Employees Assigned',
    },
    {
      accessor: 'location',
      Header: 'Location',
    },
    {
      accessor: 'vacant',
      Header: 'Vacant',
    },
    {
      accessor: 'IfRentDeductFromAdvance',
      Header: 'Rent Deducted from Advance',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      accessor: 'balanceAdvanceAmount',
      Header: 'Balance Advance Amount',
    },
    {
      accessor: 'advanceClaim',
      Header: 'Advance Claimed',
      Cell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      accessor: 'advanceClaimAmount',
      Header: 'Advance Claim Amount',
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
    const filename = `Rental_Room_list_${formattedDate}.xlsx`;

    saveAs(blob, filename);
  };

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
                <h5 className="mb-0 text-white">All Room Rental Report</h5>
              </div>
            </Card.Header>
            <Card.Header>
              <RentalRoomListHeader
                onClickFilterCallback={onClickFilterCallback}
                defaultKeyword={keyword}
                exportAsExcel={onClickExportAsExcel}
              />
            </Card.Header>
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
                  <Form.Select
                    size="sm"
                    className="me-2"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                    }}
                  >
                    {[10, 20, 30, 40, 50, 100, 200, 'All'].map((pageSize) => (
                      <option
                        key={pageSize}
                        value={pageSize === 'All' ?  data?.count : pageSize}
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

export default RentalRoomList;
