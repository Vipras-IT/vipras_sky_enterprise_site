/* eslint-disable react/jsx-key */
import React, { useState, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import { useQuery, useQueryClient } from 'react-query';
import { Table, Card, Button, Spinner, Modal, Form } from 'react-bootstrap';
import SimpleBarReact from 'simplebar-react';
import { get } from 'lodash';
import leavemanagementAPI from '../../api/leaveManagement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useAuth } from 'hooks/useAuth';
import LeaveManagementHeader from './LeaveManagementHeader';
// import LeaveManagementHeader from '../LeaveManagement/LeaveManagementHeader';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const initialState = {
    queryPageIndex: 0,
    queryPageSize: 5000,
    totalCount: null,
    queryPageFilter: { key: '', value: '' },
};

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

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';

const LeaveManagement = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [
        { queryPageIndex, queryPageSize, totalCount, queryPageFilter },
        dispatch,
    ] = React.useReducer(reducer, initialState);

    const [keyword, setKeyword] = useState({ key: '', value: '' });
    const [useFilter, setUseFilter] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalStep, setModalStep] = useState('ACTION_CHOICE'); // approve or reject 
    const [rejectReason, setRejectReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onClickFilterCallback = (filter) => {
        setUseFilter(true);
        setKeyword(filter);
    };

    const siteId = get(user, 'unitCodes');

    const { isLoading, error, data, isSuccess } = useQuery(
        [queryPageIndex, queryPageSize, queryPageFilter, siteId],
        () => {
            return leavemanagementAPI.getEmployeeLeaveData(queryPageIndex, queryPageSize, queryPageFilter, siteId);
        },
        {
            keepPreviousData: true,
            staleTime: Infinity,
            cacheTime: 0,
        },
    );

    // Handlers
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRow(null);
        setModalStep('ACTION_CHOICE');
        setRejectReason('');
        setIsSubmitting(false);
    };

    const handleApproveClick = (row) => {
        setSelectedRow(row);
        setModalStep('APPROVE_CONFIRM');
        setShowModal(true);
    };

    const handleRejectClick = (row) => {
        setSelectedRow(row);
        setModalStep('REJECT_REASON');
        setShowModal(true);
    };

    const handleApprove = async () => {
        if (!selectedRow) return;

        setIsSubmitting(true);
        try {
            const payload = {
                approvalStatus: true,
                reason: "-",
                updatedBy: get(user, 'userId'),
                updatedByName: get(user, 'fullName')
            };
            await leavemanagementAPI.updateLeave(selectedRow.id || selectedRow._id, payload);
            toast.success('Leave approved successfully');
            queryClient.invalidateQueries([queryPageIndex, queryPageSize, queryPageFilter, siteId]);
            handleCloseModal();
        } catch (error) {
            console.error("Error approving leave:", error);
            toast.error('Failed to approve leave');
        } finally {
            setIsSubmitting(false);
        }
    };

    // const handleRejectClick = () => {
    //     setModalStep('REJECT_REASON');
    // };

    const handleRejectSubmit = async () => {
        if (!selectedRow) return;
        if (!rejectReason.trim()) {
            toast.warning('Please enter a reason for rejection');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                approvalStatus: false,
                reason: rejectReason,
                updatedBy: get(user, 'userId'),
                updatedByName: get(user, 'fullName')
            };
            await leavemanagementAPI.updateLeave(selectedRow.id || selectedRow._id, payload);
            toast.success('Leave rejected successfully');
            queryClient.invalidateQueries([queryPageIndex, queryPageSize, queryPageFilter, siteId]); // Refresh data
            handleCloseModal();
        } catch (error) {
            console.error("Error rejecting leave:", error);
            toast.error('Failed to reject leave');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSuperAdmin = get(user, 'role') === 'SUPER_ADMIN';

    const columns = useMemo(() => {
        const baseColumns = [
            {
                accessor: 'employeeNumber',
                Header: 'Employee Number',
            },
            {
                accessor: 'employeeName',
                Header: 'Employee Name',
                headerProps: { className: 'pe-7' },
            },
            {
                accessor: 'fromDate',
                Header: 'From Date',
                Cell: ({ value }) => value ? new Date(value).toLocaleDateString("en-IN") : '-',
            },
            {
                accessor: 'toDate',
                Header: 'To Date',
                Cell: ({ value }) => value ? new Date(value).toLocaleDateString("en-IN") : '-',
            },
            {
                accessor: 'noOfDays',
                Header: 'No. of Days',
            },
            {
                accessor: 'description',
                Header: 'Reason',
            },
            {
                accessor: 'reason',
                Header: 'Reject Reason',
            },
            {
                accessor: 'updatedBy',
                Header: 'Updated ID',
            },
            {
                Header: 'Status',
                accessor: 'approvalStatus',
                Cell: ({ value }) => {
                    // backend send true or false
                    let statusText = 'Pending';
                    // let badgeClass = 'bg-warning';

                    if (value === true) {
                        statusText = 'Approved';
                        // badgeClass = 'bg-success';
                    } else if (value === false) {
                        statusText = 'Rejected';
                        // badgeClass = 'bg-danger';
                    }

                    return (
                        // <span className={`badge ${badgeClass}`}>
                        <span>
                            {statusText}
                        </span>
                    );
                }
            }
        ];

        if (isSuperAdmin) {
            baseColumns.splice(2, 0, {
                accessor: 'siteCode',
                Header: 'Site Code',
                headerProps: { className: 'pe-7' },
            });
        }

        // append action column
        baseColumns.push({
            Header: 'Action',
            accessor: 'action',
            disableSortBy: true,
            Cell: ({ row }) => {
                const status = row.original.approvalStatus; // check the approval status
                return (
                    <div className="d-flex gap-3 justify-content-end">
                        {status == null && (
                            <>
                                <Button
                                    variant="falcon-default"
                                    size="md"
                                    className="text-success"
                                    onClick={() => handleApproveClick(row.original)}
                                    title="Approve"
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                                <Button
                                    variant="falcon-default"
                                    size="md"
                                    className="text-danger"
                                    onClick={() => handleRejectClick(row.original)}
                                    title="Reject"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </Button>
                            </>
                        )}
                    </div>
                );
            }
        });

        return baseColumns;
    }, [isSuperAdmin, user]);

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
            data: isSuccess ? [...data.results].sort((a, b) => (b.id || b._id || '').localeCompare(a.id || a._id || '')) : [],
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

    return (
        <>
            {isSuccess ? (
                <>
                    <Card>
                        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
                            <div className="position-relative z-index-1 light">
                                <h5 className="mb-0 text-white">All Leave Report</h5>
                            </div>
                        </Card.Header>
                        <Card.Header>
                            <LeaveManagementHeader
                                onClickFilterCallback={onClickFilterCallback}
                                defaultKeyword={keyword}
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
                                                {pageSize === 5000 ? `Show ${pageSize}` : 'Show All'}
                                                {/* {pageSize === 5000 ? `Show ${pageSize}` : 'Show All'} */}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </div>
                        </Card.Footer>
                    </Card>

                    {/* Approve/Reject Modal */}
                    <Modal show={showModal} onHide={handleCloseModal} centered size="md">
                        <Modal.Header closeButton className="bg-shape  modal-shape-header px-4 position-relative">
                            <div className="position-relative z-index-1 light">
                                <h5 className="mb-0 text-white">
                                    {modalStep === 'ACTION_CHOICE' ? 'Leave Action' : 'Reject Reason'}
                                </h5>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            {modalStep === 'APPROVE_CONFIRM' ? (
                                <div className="d-flex flex-column gap-3 py-2">
                                    <p className="mb-0 text-center">Are you sure you want to approve this leave request?</p>
                                    <div className="d-flex justify-content-center gap-3">
                                        <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>
                                            Cancel
                                        </Button>
                                        <Button variant="success" onClick={handleApprove} disabled={isSubmitting}>
                                            {isSubmitting ? 'Processing...' : 'Approve'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Form>
                                    <Form.Group className="mb-3" controlId="rejectReason">
                                        <Form.Label>Reason for Rejection</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                        // placeholder="Enter reason..."
                                        />
                                    </Form.Group>
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>
                                            Cancel
                                        </Button>
                                        <Button variant="danger" onClick={handleRejectSubmit} disabled={isSubmitting}>
                                            {isSubmitting ? 'Processing...' : 'Submit'}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Modal.Body>
                    </Modal>
                </>
            ) : null}
        </>
    )
}
export default LeaveManagement