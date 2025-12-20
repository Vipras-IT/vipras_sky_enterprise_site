/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
//import IconButton from 'components/common/IconButton';
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
import IconButton from 'components/common/IconButton';

const SubcontractorFilter = ({
  onClickFilterCallback,
  defaultKeyword,
  exportAsExcel,
}) => {
  const [keyword, setKeyword] = React.useState(defaultKeyword);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const searchTypeMapping = {
    'SubContractor Name': 'employeeName',
    'SubContractor Id': 'employeeIDNumber',
    'Unit Code': 'unitCode',
    'Received Date': 'date',
    'Invoice No': 'invoiceNo',
    'TDS Amount': 'tdsAmount',
    'other Deduction': 'otherDeduction',
    'Hand Over To': 'handOverToMD',
    'Imprest By Myself': 'imprestByMyself',
  };
  const [searchType, setSearchType] = useState('Impres Holder ID');

  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };

  const onClickSearch = () => {
    const fromDateFormatted = fromDate
      ? new Date(fromDate).toString()
      : null;
    const toDateFormatted = toDate ? new Date(toDate).toString() : null;
    const filter = {
      key: searchTypeMapping[searchType],
      value: keyword.value,
      from: fromDateFormatted,
      to: toDateFormatted,
    };
    onClickFilterCallback(filter);
  };

  const FromDateChange = (date) => {
    setFromDate(date);
  };

  const ToDateChange = (date) => {
    setToDate(date);
  };

  return (
    <Row>
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">SubContractor</h4>
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
            'SubContractor Name',
            'SubContractor Id',
            'Unit Code',
            'Received Date',
            'Invoice No',
            'TDS Amount',
            'other Deduction',
            'Hand Over To',
            'Imprest By Myself',
          ].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Form.Select>
      </Col>

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
          {/* <Button
            size="sm"
            variant="outline-secondary"
            className="border-300 hover-border-secondary"
            onClick={receivedDatesearch}
          >
            <FontAwesomeIcon icon="search" className="fs--1" />
          </Button> */}
        </InputGroup>
      </Col>
      {/* <Col xs={2} sm="auto" className="d-flex">
        <Select
          defaultValue={todayYears}
          style={{
            width: 100
          }}
          //onChange={handleChangeYear}
          options={years}
        />
        &nbsp;&nbsp;
        <Select
          defaultValue={todayMonth}
          value={todayMonth}
          style={{
            width: 100
          }}
          //onChange={handleChangeMonth}
          options={getMonthNames(todayYears)}
          //selectable={true}
        />
      </Col> */}
      <Col xs={2} sm="auto" className="d-flex">
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

SubcontractorFilter.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default SubcontractorFilter;
