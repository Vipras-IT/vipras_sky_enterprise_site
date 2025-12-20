/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
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

const BulkEmployeesHeader = ({
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
  // const [todayMonth, setTodayMonth] = useState(todayDate.getMonth());
  // const [todayYears, setTodayYears] = useState(todayDate.getFullYear());

  // function getMonthNames(year) {
  //   const todayDate = new Date();
  //   const currentMonth = todayDate.getMonth();
  //   const months = Array.from({ length: 12 }, (_, index) => {
  //     const monthDate = new Date(year, index, 1);
  //     const monthName = monthDate.toLocaleString('default', { month: 'long' });
  //     return {
  //       label: monthName,
  //       value: index,
  //       disabled: index < currentMonth - 12
  //     };
  //   });
  //   return months;
  // }

  // const years = [
  //   {
  //     value: 2024,
  //     label: '2024'
  //   },
  //   {
  //     value: 2025,
  //     label: '2025'
  //   },
  //   {
  //     value: 2026,
  //     label: '2026'
  //   }
  // ];
  // const handleChangeYear = value => {
  //   console.log(value);
  //   setTodayYears(value);
  //   onPressChangeYear(value);
  // };

  // const handleChangeMonth = value => {
  //   const currentMonthName = month[value].value;
  //   const currentMonthNamelabel = month[value].label;
  //   console.log(month[value].label);
  //   setTodayMonth(currentMonthName);
  //   onPressChangeMonth(currentMonthNamelabel);
  // };
  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const currentMonthName = date.getMonth();
    onPressChangeMonth(month[currentMonthName].label);
    onPressChangeYear(year);
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
      value = shiftOptionsMapping[value.toUpperCase()];
    }
    if (searchType === 'Attendance Date') {
      const selectedDate = new Date(keyword.value);
      value = selectedDate.toLocaleDateString();
    }

    if (searchType === 'Employee Number') {
      console.log('searchType', searchType);
      const dateFilter = currentMonth + '-' + currentYear;
      const selectedDate = Number(keyword.value);
      const defaultFilter = {
        employeeNumber: selectedDate,
        month: dateFilter,
      };
      onClickFilterCallback({
        key: searchTypeMapping[searchType],
        value: defaultFilter,
      });
      return;
      // value = defaultFilter;
    }
    onClickFilterCallback({
      key: searchTypeMapping[searchType],
      value: value,
    });
  };

  return (
    <>
      <Row className="flex-between-center">
        <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
          <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">
            Bulk Report Attendance
          </h4>
        </Col>
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
        <Col xs={4} sm="auto" className="ms-auto text-end ps-0">
          <div id="orders-actions">
            {/* <Select
              defaultValue={todayYears}
              style={{
                width: 120
              }}
              onChange={handleChangeYear}
              value={todayYears}
              options={years}
            />
            &nbsp;&nbsp;
            <Select
              defaultValue={todayMonth}
              value={todayMonth}
              style={{
                width: 120
              }}
              onChange={handleChangeMonth}
              options={getMonthNames(todayYears)}
            /> */}
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

BulkEmployeesHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default BulkEmployeesHeader;
