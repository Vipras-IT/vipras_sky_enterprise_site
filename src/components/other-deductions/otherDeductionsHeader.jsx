/* eslint-disable react/prop-types */
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import {
  Col,
  Row,
  Button,
  FormControl,
  InputGroup,
  Form,
} from 'react-bootstrap';
import { DatePicker } from 'antd';

const OtherDeductionsHeader = ({
  onClickFilterCallback,
  defaultKeyword,
  totalCount,
  exportAsExcel,
}) => {
  const [keyword, setKeyword] = React.useState(defaultKeyword);
  const [totalcount, setTotalCount] = useState(totalCount);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const searchTypeMapping = {
    'Employee Number': 'employeeIDNumber',
    'Employee Name': 'employeeName',
    'Unit Code': 'unitCode',
    'Advances Deduction': 'advance',
    'Transport Deduction': 'transport',
    'Vipras Mart': 'viprasMart',
    'Fine Deduction': 'fine',
    'Attendance Bonus': 'attendanceBonus',
    'Others Deduction': 'others',
    'Additional Id Card': 'additionalIdCard',
  };
  const [searchType, setSearchType] = React.useState('Employee Number');

  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };
  const onClickSearch = () => {
    onClickFilterCallback({
      key: searchTypeMapping[searchType],
      value: keyword.value,
      from: fromDate ? new Date(fromDate).toString() : null,
      to: toDate ? new Date(toDate).toString() : null,
    });
  };

  const getTotalDataCount = () => {
    setTotalCount(totalCount);
  };
  React.useEffect(() => {
    getTotalDataCount();
  }, [totalCount]);

  const FromDateChange = (date) => {
    setFromDate(date);
  };

  const ToDateChange = (date) => {
    setToDate(date);
  };

  return (
    <Row>
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">OtherDeductions</h4>
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
            'Unit Code',
            'Advances Deduction',
            'Transport Deduction',
            'Vipras Mart Deduction',
            'Fine Deduction',
            'Attendance Bonus',
            'Others Deduction',
            'Additional Id Card',
          ].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Form.Select>
      </Col>
      {searchType !== 'Deduction Date' && (
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

      <Col xs={2} sm="auto" className="d-flex">
        <div id="orders-actions">
          <IconButton>
            <span className="d-none d-sm-inline-block ms-1">
              Total Count:{totalcount}
            </span>
          </IconButton>
        </div>
      </Col>
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

OtherDeductionsHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default OtherDeductionsHeader;
