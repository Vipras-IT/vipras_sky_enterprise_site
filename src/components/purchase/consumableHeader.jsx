/* eslint-disable react/prop-types */
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Button, FormControl, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { disableFutureDates } from 'helpers/utils';

const ConsumableHeader = ({
  onClickFilterCallback,
  defaultKeyword,
  exportAsExcel,
  onPressChangeYear,
  onPressChangeMonth,
}) => {
  const [keyword, setKeyword] = React.useState(defaultKeyword);
  const searchTypeMapping = {
    'Invoice No': 'invoiceNo',
    'Vendor Name': 'vendorName',
    'Purchase Date': 'date',
    'Vendor Code': 'vendorCode',
    'Unit Code': 'unitCode',
  };
  const [searchType, setSearchType] = React.useState('invoiceNo');
  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };

  const todayDate = new Date();
  const [value, setValue] = useState(todayDate);

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0'); // Formats as "04", "11", etc.
    onPressChangeMonth(currentMonth);
    onPressChangeYear(year);
  };

  const onClickSearch = () => {
    const selectedDate = value;
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dateFilter = `${selectedYear}-${selectedMonth}`;

    if (searchType === 'HK') {
      const defaultFilter = {
        purchaseType: 'HK',
        month: dateFilter,
      };

      onClickFilterCallback({
        key: searchType,
        value: defaultFilter,
      });
    } else {
      onClickFilterCallback({
        key: searchTypeMapping[searchType],
        value: keyword.value,
        month: dateFilter,
      });
    }
  };

  return (
    <Row className="flex-between-center">
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">Purchase</h4>
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
            'Invoice No',
            'Vendor Name',
            'Purchase Date',
            'Vendor Code',
            'Unit Code',
          ].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Form.Select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <FormControl
            size="sm"
            id="search"
            type="search"
            className="shadow-none"
            placeholder="Search"
            value={keyword.value}
            onChange={onKeywordChange}
          />
          <DatePicker
            format="MMM yyyy"
            caretAs={BsCalendar2MonthFill}
            value={value}
            onChange={handleChange}
            shouldDisableDate={disableFutureDates}
          />
          <Button
            size="sm"
            className="border-300 hover-border-secondary"
            onClick={onClickSearch}
          >
            <FontAwesomeIcon icon="search" className="fs--1" />
          </Button>
        </div>
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

ConsumableHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default ConsumableHeader;
