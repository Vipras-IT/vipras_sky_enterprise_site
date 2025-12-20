/* eslint-disable react/prop-types */

import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Col,
  Row,
  Button,
  FormControl,
  InputGroup,
  Form,
} from 'react-bootstrap';
import { DatePicker, Select } from 'antd';
import { useState } from 'react';
import expensesApi from 'api/expenses';
import { get } from 'lodash';
import { getErrorMessage, transectionType } from 'helpers/utils';
import { toast } from 'react-toastify';

const ImpresHeader = ({
  onClickFilterCallback,
  defaultKeyword,
  exportAsExcel,
  formattedGranTotalAmountCredit,
}) => {
  const [keyword, setKeyword] = React.useState(defaultKeyword);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [cash, setCash] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [imprestName, setImprestName] = useState([]);
  const [expensesType, setExpensesType] = useState();
  const [type, setType] = useState();
  const searchTypeMapping = {
    'Employee Name': 'employeeName',
    'Employee Number': 'employeeID',
    'Imprest Holder Name': 'imprestholderName',
    'Imprest Holder Id': 'imprestholderId',
    'Unit Code': 'unitCodeWithName',
    'Transaction Type': 'payType',
    'Transaction Status': 'isVerified',
  };

  const [searchType, setSearchType] = React.useState('Employee Number');
  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await expensesApi.getAllExpenses('token');
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
      } else {
        setExpenses(get(response.data, 'data', []));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const imprestfetchData = async () => {
      const response = await expensesApi.getByImpressHolderDropDown('token');
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
      } else {
        setImprestName(get(response.data, 'data', []));
      }
    };
    imprestfetchData();
  }, []);

  const onKeywordChangeExpenseeType = (value) => {
    setType(value);
    setKeyword({ key: searchTypeMapping['expensesType'], value });
  };
  const onKeywordChangeImprestType = (value) => {
    setKeyword({ key: searchTypeMapping['imprestholderId'], value });
  };

  const onKeywordChangeType = (value) => {
    if (value === 'EXPENSES') {
      setExpensesType(value);
    }
    setExpensesType(value);
    setKeyword({ key: searchTypeMapping[value], value });
    // setKeyword({ key: searchTypeMapping['payType'], value: value });
  };

  const onClickSearch = () => {
    if (searchTypeMapping[searchType] === 'employeeID') {
      setCash(true);
    } else {
      setCash(false);
    }
    let filter;
    if (
      searchTypeMapping[searchType] === 'payType' &&
      expensesType === 'EXPENSES' && !!type
    ) {
      filter = {
        key: 'expensesType',
        value: keyword.value,
        from: fromDate ? new Date(fromDate) : null,
        to: toDate ? new Date(toDate) : null,
      };
    } else {
      filter = {
        key: searchTypeMapping[searchType],
        value: keyword.value,
        from: fromDate ? new Date(fromDate) : null,
        to: toDate ? new Date(toDate) : null,
      };
    }
    onClickFilterCallback(filter);
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
        <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">Imprest</h4>
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
            'Employee Name',
            'Employee Number',
            'Imprest Holder Name',
            'Imprest Holder Id',
            'Unit Code',
            'Transaction Type',
            'Transaction Status',
          ].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Form.Select>
      </Col>
      {searchType !== 'Imprest Date' && (
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

      {searchType == 'Transaction Type' && (
        <Select
          showSearch
          style={{ width: 200 }}
          size="large"
          placeholder="Select a type"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={onKeywordChangeType}
          options={transectionType}
        />
      )}

      {expensesType === 'EXPENSES' && (
        <Select
          showSearch
          style={{ width: 200 }}
          size="large"
          placeholder="Select a type"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={onKeywordChangeExpenseeType}
          options={expenses}
        />
      )}
      {searchType === 'Imprest Holder Name' && (
        <Select
          showSearch
          style={{ width: 200 }}
          size="large"
          placeholder="Select a Imprest"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          onChange={onKeywordChangeImprestType}
          options={imprestName}
        />
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
      {cash && (
        <Col xs={2} sm="auto" className="d-flex">
          <div id="orders-actions">
            <IconButton>
              <span className="d-none d-sm-inline-block ms-1">
                Cash in Hand: {formattedGranTotalAmountCredit}
              </span>
            </IconButton>
          </div>
        </Col>
      )}
    </Row>
  );
};

ImpresHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default ImpresHeader;
