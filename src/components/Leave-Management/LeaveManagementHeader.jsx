/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { DatePicker, Select } from 'antd';
import {
    Col,
    Row,
    Button,
    FormControl,
    InputGroup,
    Form,
} from 'react-bootstrap';
import { lowerCase } from 'lodash';

const LeaveManagementHeader = ({
    onClickFilterCallback,
    defaultKeyword,
    exportAsExcel,
    totalCount,
}) => {
    const [keyword, setKeyword] = React.useState(defaultKeyword);
    const [dobDate, setDobDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [totalcount, setTotalCount] = useState(totalCount);
    const searchTypeMapping = {
        'Employee Name': 'employeeName',
        'Employee Number': 'employeeNumber',
        // 'Unit Code': 'siteCode',
        'Approval Status': 'approvalStatus'
    };
    const [searchType, setSearchType] = React.useState('Employee Number');

    const onKeywordChange = (e) => {
        setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
    };

    const getTotalDataCount = () => {
        setTotalCount(totalCount);
    };
    React.useEffect(() => {
        getTotalDataCount();
    }, [totalCount]);

    const roleDegination = window.localStorage.getItem('role');
    const roles = roleDegination ? JSON.parse(roleDegination) : [];

    return (
        <Row>
            <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
                <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">Employees</h4>
            </Col>
            <Col xs={4} sm="auto" className="d-flex">
                <Form.Select
                    size="sm"
                    className="me-2 width-15"
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                    }}
                >
                    {[
                        'Employee Number',
                        'Employee Name',
                        // 'Unit Code',
                        'Approval Status'
                    ].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            {/* {searchType === 'Date Range' ? (
                <Col xs={2} sm="auto" className="d-flex flex-between-center">
                    <InputGroup className="position-relative input-search-width">
                        <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
                            <h4 className="fs-0 mb-0 text-nowrap px-2 py-2 py-xl-0">From</h4>
                        </Col>
                        <DatePicker
                            size="small"
                            value={fromDate}
                            onChange={(date) => setFromDate(date)}
                        />
                    </InputGroup>
                    <div style={{ marginLeft: '10px' }}></div>
                    <Col xs={2} sm="auto" className="d-flex align-items-center pe-0">
                        <h4 className="fs-0 mb-0 text-nowrap px-2 py-2 py-xl-0">To</h4>
                    </Col>
                    <InputGroup className="position-relative input-search-width">
                        <DatePicker
                            size="small"
                            value={toDate}
                            onChange={(date) => setToDate(date)}
                        />
                        <Button
                            size="sm"
                            variant="outline-secondary"
                            className="border-300 hover-border-secondary ms-2"
                            onClick={() => {
                                if (fromDate && toDate) {
                                    onClickFilterCallback({
                                        key: searchTypeMapping[searchType],
                                        value: {
                                            from: fromDate.toISOString(),
                                            to: toDate.toISOString(),
                                        },
                                    });
                                }
                            }}
                        >
                            <FontAwesomeIcon icon="search" className="fs--1" />
                        </Button>
                    </InputGroup>
                </Col>
            ) :  */}
            {searchType === 'Approval Status' ? (
                <Col xs={4} sm="auto" className="d-flex">
                    <Form.Select
                        size="sm"
                        onChange={(e) => {
                            setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
                        }}
                    >
                        <option value="">Select Status</option>
                        <option value="true">Approved</option>
                        <option value="false">Rejected</option>
                        <option value="null">Pending</option>
                    </Form.Select>
                    <Button
                        size="sm"
                        variant="outline-secondary"
                        className="border-300 hover-border-secondary ms-2"
                        onClick={() => onClickFilterCallback(keyword)}
                    >
                        <FontAwesomeIcon icon="search" className="fs--1" />
                    </Button>
                </Col>
            ) : (
                <Col xs={4} sm="auto" className="d-flex">
                    <InputGroup className="position-relative input-search-width">
                        <FormControl
                            size="sm"
                            id="search"
                            type="search"
                            className="shadow-none"
                            placeholder="Search"
                            value={keyword.value}
                            onChange={onKeywordChange}
                            onKeyDown={
                                (e) => {
                                    if (e.key === 'Enter') { onClickFilterCallback(keyword) }
                                }
                            }
                        />
                        <Button
                            size="sm"
                            variant="outline-secondary"
                            className="border-300 hover-border-secondary"
                            onClick={() => onClickFilterCallback(keyword)}
                        >
                            <FontAwesomeIcon icon="search" className="fs--1" />
                        </Button>
                    </InputGroup>
                </Col>
            )}

            <Col xs={2} sm="auto" className="d-flex">
                <div id="orders-actions">
                    <IconButton
                        style={{ backgroundColor: 'rgb(98 195 37)' }}
                        size="sm"
                        transform="shrink-3"
                        onClick={exportAsExcel}
                    >
                        <span className="d-none d-sm-inline-block ms-1">
                            Total Count:{totalcount}
                        </span>
                    </IconButton>
                </div>
            </Col>
            <Col xs={2} sm="auto" className="d-flex">
                <div id="orders-actions">
                </div>
            </Col>
        </Row>
    );
};

LeaveManagementHeader.propTypes = {
    handleTicketsSearch: PropTypes.func,
};

export default LeaveManagementHeader;
