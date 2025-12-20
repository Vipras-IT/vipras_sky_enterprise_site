/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Col,
  Row,
  Button,
  FormControl,
  InputGroup,
  Form,
} from 'react-bootstrap';
import expensesApi from 'api/expenses';
import { get } from 'lodash';
import IconButton from 'components/common/IconButton';
import { DatePicker, Select } from 'antd';
import { getErrorMessage, transectionType } from 'helpers/utils';
import { toast } from 'react-toastify';

const ImprestHolderTransactionHeader = ({
  onClickFilterCallback,
  defaultKeyword,
  formattedGranTotalAmountCredit,
  exportAsExcel,
}) => {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [cash, setCash] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const searchTypeMapping = {
    'Impres Holder ID': 'imprestholderId',
    'Impres Holder Name': 'imprestholderName',
    'Employee ID': 'employeeID',
    'Employee Name': 'employeeName',
    'Unit Code': 'unitCodeWithName',
    'Transaction Type': 'payType',
    'Expense Type': 'expensesType',
    'Debit Amount': 'debit',
    'Credit Amount': 'credit',
    'Transactions Description': 'description',
    'Transactions Remark': 'explanation',
  };

  const [searchType, setSearchType] = useState('Impres Holder ID');
  const [expenses, setExpenses] = useState([]);
  const [expensesType, setExpensesType] = useState();
  const [type, setType] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await expensesApi.getAllExpenses();
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

  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };

  const onKeywordChangeType = (value) => {
    if (value === 'EXPENSES') {
      setExpensesType(value);
    }
    setExpensesType(value);
    setKeyword({ key: searchTypeMapping[value], value });
  };
  const onKeywordChangeExpenseeType = (value) => {
    setType(value);
    setKeyword({ key: searchTypeMapping['expensesType'], value });
  };

  const onClickSearch = () => {
    if (
      searchTypeMapping[searchType] === 'employeeID' ||
      searchTypeMapping[searchType] === 'imprestholderId'
    ) {
      setCash(true);
    } else {
      setCash(false);
    }

    let filter;
    if (
      searchTypeMapping[searchType] === 'payType' &&
      expensesType === 'EXPENSES' &&  !!type
    ) {
      console.log('type', type); 
      
      filter = {
        key: 'expensesType',
        value: keyword.value,
        from: fromDate ? new Date(fromDate).toString() : null,
        to: toDate ? new Date(toDate).toString() : null,
      };
    } else {
      console.log('type', type); 
      filter = {
        key: searchTypeMapping[searchType],
        value: keyword.value,
        from: fromDate ? new Date(fromDate).toString() : null,
        to: toDate ? new Date(toDate).toString() : null,
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
    <Row>
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0"></Col>
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
            'Impres Holder ID',
            'Impres Holder Name',
            'Employee ID',
            'Employee Name',
            'Unit Code',
            'Debit Amount',
            'Credit Amount',
            'Transactions Remark',
            'Transactions Description',
            'Transaction Type',
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
      {searchType === 'Transaction Type' && (
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

ImprestHolderTransactionHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default ImprestHolderTransactionHeader;
