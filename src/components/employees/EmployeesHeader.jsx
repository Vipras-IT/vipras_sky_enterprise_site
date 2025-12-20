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

const EmployeesHeader = ({
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
    'Aadhar Number': 'aadharNumber',
    'Unit Code': 'siteCode',
    'UAN Number': 'documents.pfNumber',
    'ESI Number': 'documents.esiNumber',
    'AC Number': 'bankDetails.accountNumber',
    Designation: 'role',
    'Date of birth': 'employeeDOB',
    'Joining Date': 'joiningDate',
    'Resign Employee': 'isActive',
  };
  const [searchType, setSearchType] = React.useState('Employee Number');

  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };
  const onClickSearch = () => {
    let value = keyword.value;
    if (searchTypeMapping[searchType] === 'isActive') {
      value = !(lowerCase(keyword.value) === 'resigned');
    }
    onClickFilterCallback({
      key: searchTypeMapping[searchType],
      value: value,
    });
  };

  const onKeywordChangeType = (value) => {
    console.log(value);
    setKeyword({ key: searchTypeMapping['Designation'], value: value });
  };

  const DOBDateChange = (date) => {
    setDobDate(date);
  };

  const DOBDatesearch = () => {
    if (dobDate) {
      const selectedDate = new Date(dobDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${day}/${month}/${year}`;

      onClickFilterCallback({
        key: searchTypeMapping[searchType],
        value: formattedDate,
      });
    }
  };

  const FromDateChange = (date) => {
    setFromDate(date);
  };

  const ToDateChange = (date) => {
    setToDate(date);
  };

  const joinDatesearch = () => {
    if (fromDate && toDate) {
      const selectedFromDate = new Date(fromDate);
      const yearFrom = selectedFromDate.getFullYear();
      const monthFrom = String(selectedFromDate.getMonth() + 1).padStart(
        2,
        '0',
      );
      const dayFrom = String(selectedFromDate.getDate()).padStart(2, '0');
      const formattedFromDate = `${yearFrom}/${monthFrom}/${dayFrom}`;

      const selectedToDate = new Date(toDate);
      const yearTo = selectedToDate.getFullYear();
      const monthTo = String(selectedToDate.getMonth() + 1).padStart(2, '0');
      const dayTo = String(selectedToDate.getDate()).padStart(2, '0');
      const formattedToDate = `${yearTo}/${monthTo}/${dayTo}`;

      onClickFilterCallback({
        key: searchTypeMapping[searchType],
        value: {
          from: new Date(formattedFromDate).toString(),
          to: new Date(formattedToDate).toString(),
        },
      });
    }
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
            'Aadhar Number',
            'Unit Code',
            'UAN Number',
            'ESI Number',
            'AC Number',
            'Designation',
            'Date of birth',
            'Joining Date',
            'Resign Employee',
          ].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Form.Select>
      </Col>
      {searchType !== 'Date of birth' && searchType !== 'Joining Date' && (
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
      {searchType === 'Date of birth' && (
        <Col xs={4} sm="auto" className="d-flex flex-between-center">
          <InputGroup className="position-relative input-search-width">
            <DatePicker
              size="small"
              Select={dobDate}
              // value={dobDate}
              onChange={DOBDateChange}
            />
            <Button
              size="sm"
              variant="outline-secondary"
              className="border-300 hover-border-secondary"
              onClick={DOBDatesearch}
            >
              <FontAwesomeIcon icon="search" className="fs--1" />
            </Button>
          </InputGroup>
        </Col>
      )}

      {searchType === 'Joining Date' && (
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
              onClick={joinDatesearch}
            >
              <FontAwesomeIcon icon="search" className="fs--1" />
            </Button>
          </InputGroup>
        </Col>
      )}

      {searchType == 'Designation' && (
        <Select
          showSearch
          style={{ width: 250 }}
          size="large"
          placeholder="Select a designation"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={onKeywordChangeType}
          options={roles.map((role, index) => ({
            value: role,
            label: role,
          }))}
        />
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
