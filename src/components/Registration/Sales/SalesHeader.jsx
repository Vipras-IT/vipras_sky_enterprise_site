/* eslint-disable react/prop-types */
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

const EmployeesHeader = ({
  onClickFilterCallback,
  defaultKeyword,
  exportAsExcel,
}) => {
  const [keyword, setKeyword] = React.useState(defaultKeyword);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const searchTypeMapping = {
    'Employee Name': 'employeeName',
    'Employee Number': 'employeeId',
    'Unit Code': 'unitCode',
    'Sales Date': 'date',
  };
  const [searchType, setSearchType] = React.useState('Employee Number');
  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };
  const onClickSearch = () => {
    onClickFilterCallback({
      key: searchTypeMapping[searchType],
      value: keyword.value,
    });
  };
  const FromDateChange = (date) => {
    setFromDate(date);
  };

  const ToDateChange = (date) => {
    setToDate(date);
  };

  const salesDatesearch = () => {
    if (fromDate && toDate) {
      const selectedFromDate = new Date(fromDate).toString();
      const selectedToDate = new Date(toDate).toString();
      onClickFilterCallback({
        key: searchTypeMapping[searchType],
        value: { from: selectedFromDate, to: selectedToDate },
      });
    }
  };
  return (
    <Row className="flex-between-center">
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">Sales</h4>
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
          {['Employee Name', 'Employee Number', 'Unit Code', 'Sales Date'].map(
            (pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ),
          )}
        </Form.Select>
      </Col>
      {searchType !== 'Sales Date' && (
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
      {searchType === 'Sales Date' && (
        <Col xs={2} sm="auto" className="d-flex flex-between-center">
          <InputGroup className="position-relative input-search-width">
            <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
              <h4 className="fs-0 mb-0 text-nowrap px-2 py-2 py-xl-0">From</h4>
            </Col>
            <DatePicker
              size="small"
              value={fromDate}
              onChange={FromDateChange}
            />
          </InputGroup>
          <div style={{ marginLeft: '20px' }}></div>
          <Col xs={2} sm="auto" className="d-flex align-items-center pe-0">
            <h4 className="fs-0 mb-0 text-nowrap px-2 py-2 py-xl-0">To</h4>
          </Col>
          <InputGroup className="position-relative input-search-width">
            <DatePicker size="small" value={toDate} onChange={ToDateChange} />
            <Button
              size="sm"
              variant="outline-secondary"
              className="border-300 hover-border-secondary"
              onClick={salesDatesearch}
            >
              <FontAwesomeIcon icon="search" className="fs--1" />
            </Button>
          </InputGroup>
        </Col>
      )}
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

EmployeesHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default EmployeesHeader;
