/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Col,
  Row,
  Button,
  FormControl,
  InputGroup,
  Form,
} from 'react-bootstrap';
import { disableFutureDates, getMonthNames } from 'helpers/utils';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import dayjs from 'dayjs';

const EmployeesHeader = ({
  onClickFilterCallback,
  defaultKeyword,
  exportAsExcel,
  onPressChangeYear,
  onPressChangeMonth,
}) => {
  const [keyword, setKeyword] = React.useState(defaultKeyword);
  const searchTypeMapping = {
    'Employee Number': 'employeeNumber',
    'Employee Name': 'employeeName',
    'Unit Code': 'siteId',
    'Shift Options': 'shift',
    'Attendance Date': 'date',
    'Authorized Officer': 'operationManager',
    'Authorized Officer ID': 'operationManagerId',
  };
  const [searchType, setSearchType] = React.useState('Employee Number');
  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };

  const todayDate = new Date();
  const monthList = getMonthNames(todayDate.getFullYear());
  const [month, setMonth] = useState(monthList);
  const [value, setValue] = useState(todayDate);
  const today = dayjs();
  const [fromDate, setFromDate] = React.useState(today);
  const [toDate, setToDate] = React.useState(null);

  const FromDateChange = (date) => {
    setFromDate(date);
  };
  const ToDateChange = (date) => {
    setToDate(date);
  };

  const handleChange = (date) => {
    setValue(date); 
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    onPressChangeMonth(month[monthIndex].label);
    onPressChangeYear(year);
    const firstDay = new Date(year, monthIndex, 1); 
    const lastDay = new Date(year, monthIndex + 1, 0);
  
    lastDay.setHours(23, 59, 59, 999);
  
    setFromDate(firstDay);
    setToDate(lastDay);
  };
  
  const isInSelectedMonth = (date) => {
    if (!value) return false;

    const selectedYear = value.getFullYear();
    const selectedMonth = value.getMonth();

    const dateToCheck = new Date(date);
    return (
      dateToCheck.getFullYear() === selectedYear &&
      dateToCheck.getMonth() === selectedMonth
    );
  };

  // Custom function to disable dates outside the selected month
  const shouldDisableDate = (date) => {
    return !isInSelectedMonth(date);
  };
  let currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const onClickSearch = () => {
    let value = keyword.value;

    if (searchType === 'Shift Options') {
      const shiftOptionsMapping = {
        A: 'A',
        B: 'B',
        C: 'C',
        D: 'D',
        N: 'N',
        G: 'G',
      };
      value = shiftOptionsMapping[value?.toUpperCase()];
    }

    if (searchType === 'Attendance Date') {
      const selectedDate = new Date(keyword.value);
      value = selectedDate.toLocaleDateString();
    }

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from) {
      from.setUTCHours(0, 0, 0, 0);
    }
    if (to) {
      to.setUTCHours(23, 59, 59, 999); // use UTC to match from
    }

  
    if (searchType === 'Employee Number') {
      const selectedMonth = from?.toLocaleString('default', { month: 'long' });
      const selectedYear = from?.getFullYear();
      const dateFilter = `${selectedMonth}-${selectedYear}`;
      const selectedDate = Number(keyword.value);
      const defaultFilter = {
        employeeNumber: selectedDate,
        month: dateFilter,
        from,
        to,
      };

      onClickFilterCallback({
        key: searchTypeMapping[searchType],
        value: defaultFilter,
      });
      return;
    } 

    const payload = {
      key: searchTypeMapping[searchType],
      value: {
        [searchTypeMapping[searchType]]: value,
        from: from ? from.toISOString() : null,
        to: to ? to.toISOString() : null,
      },
    };
  
    onClickFilterCallback(payload);
  };
  

  useEffect(() => {
    onClickSearch();
  }, []);
  return (
    <>
      <Row className="flex-between-center">
        <Col xs={4} sm="auto" className="d-flex flex-between-center">
          <div>
            <Form.Select
              size="sm"
              className="me-2 width-15"
              defaultValue={searchType}
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
              }}
            >
              {[
                'Employee Number',
                'Employee Name',
                'Unit Code',
                'Shift Options',
                'Attendance Date',
                'Authorized Officer',
                'Authorized Officer ID',
              ].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </Form.Select>
          </div>
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
          </InputGroup>

          <Col xs={2} sm="auto" className="d-flex flex-between-center">
            <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
              <h4 className="fs-0 mb-0 text-nowrap px-2 py-2 py-xl-0">From</h4>
            </Col>
            <InputGroup className="position-relative input-search-width">
              <DatePicker
                size="small"
                value={fromDate}
                onChange={FromDateChange}
                shouldDisableDate={shouldDisableDate}
              />
            </InputGroup>
            <div style={{ marginLeft: '20px' }}></div>
            <Col xs={2} sm="auto" className="d-flex align-items-center pe-0">
              <h4 className="fs-0 mb-0 text-nowrap px-2 py-2 py-xl-0">To</h4>
            </Col>
            <InputGroup className="position-relative input-search-width">
              <DatePicker
                size="small"
                value={toDate}
                onChange={ToDateChange}
                shouldDisableDate={shouldDisableDate}
              />
            </InputGroup>
          </Col>
          <Button
            size="sm"
            className="border-300 hover-border-secondary "
            style={{ marginLeft: '1rem' }}
            onClick={onClickSearch}
          >
            <FontAwesomeIcon icon="search" className="fs--1 " />
          </Button>
        </Col>
        <Col xs={4} sm="auto" className="ms-auto text-end ps-0">
          <div id="orders-actions">
            <DatePicker
              format="MMM yyyy"
              caretAs={BsCalendar2MonthFill}
              value={value}
              onChange={handleChange}
              shouldDisableDate={disableFutureDates}
            />
            &nbsp;&nbsp;
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
    </>
  );
};

EmployeesHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default EmployeesHeader;
