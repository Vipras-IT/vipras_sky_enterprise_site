/* eslint-disable react/prop-types */
import { useState } from 'react';
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Col,
  Row,
  Button,
  FormControl,
  InputGroup,
  Form,
} from 'react-bootstrap';
import { DatePicker } from 'antd';

const AccountsTransactionHeader = ({
  onClickFilterCallback,
  defaultKeyword,
  exportAsExcel,
}) => {
  const searchTypeMapping = {
    'Employee Number': 'employeeID',
    'Employee Name': 'employeeName',
    'Unit Code': 'unitCode',
    'Room Code': 'roomCode',
    'Vendor Code': 'vendorCode',
    'Debit Amount': 'debit',
    'Credit Amount': 'credit',
    'Transaction Type': 'payType',
    'Expenses Type': 'expensesType',
    Remarks: 'explanation',
  };

  const [keyword, setKeyword] = React.useState(defaultKeyword);
  const [searchType, setSearchType] = React.useState('Employee Number');
  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const onClickSearch = () => {
    onClickFilterCallback({
      key: searchTypeMapping[searchType],
      value: keyword.value,
      from: fromDate ? new Date(fromDate) : null,
      to: toDate ? new Date(toDate) : null,
    });
  };

  const FromDateChange = (date) => {
    setFromDate(date);
  };

  const ToDateChange = (date) => {
    setToDate(date);
  };

  return (
    <Row className="flex-between-center">
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">Accounts</h4>
      </Col>
      <Col xs={4} sm="auto" className="d-flex flex-between-center">
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
            'Unit Code',
            'Room Code',
            'Vendor Code',
            'Debit Amount',
            'Credit Amount',
            'Transaction Type',
            'Expenses Type',
            'Remarks',
          ].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Form.Select>
      </Col>
      {searchType !== 'Date' && (
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
            />
            <Button
              size="sm"
              variant="outline-secondary"
              className="border-300 hover-border-secondary"
              onClick={onClickSearch}
            >
              <FontAwesomeIcon icon="search" className="fs--1" />
            </Button>
          </InputGroup>
        </Col>
      )}

      <Col xs={2} sm="auto" className="d-flex flex-between-center">
        <InputGroup className="position-relative input-search-width">
          <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
            <h4 className="fs-0 mb-0 text-nowrap px-2 py-2 py-xl-0">From</h4>
          </Col>
          <DatePicker size="small" value={fromDate} onChange={FromDateChange} />
        </InputGroup>
        <div style={{ marginLeft: '20px' }}></div>
        <Col xs={2} sm="auto" className="d-flex align-items-center pe-0">
          <h4 className="fs-0 mb-0 text-nowrap px-2 py-2 py-xl-0">To</h4>
        </Col>
        <InputGroup className="position-relative input-search-width">
          <DatePicker size="small" value={toDate} onChange={ToDateChange} />
        </InputGroup>
      </Col>

      <Col xs={4} sm="auto" className="ms-auto text-end ps-0">
        <div id="orders-actions">
          <IconButton
            variant="primary"
            size="sm"
            icon="external-link-alt"
            transform="shrink-3"
            onClick={exportAsExcel}
          >
            <span className="d-none d-sm-inline-block ms-1">Export</span>
          </IconButton>
        </div>
      </Col>
    </Row>
  );
};

AccountsTransactionHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default AccountsTransactionHeader;
