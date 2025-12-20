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

const SaleReturnHeader = ({
  onClickFilterCallback,
  defaultKeyword,
  exportAsExcel,
}) => {
  const [keyword, setKeyword] = React.useState(defaultKeyword);
  const searchTypeMapping = {
    'Employee Id': 'employeeId',
    'Employee Name': 'employeeName',
    'Product Name': 'productName',
    'Purchase Rate': 'purchaseRate',
    'Sales Rate': 'salesRate',
  };
  const [searchType, setSearchType] = React.useState('employeeId');
  const onKeywordChange = (e) => {
    setKeyword({ key: searchTypeMapping[searchType], value: e.target.value });
  };
  const onClickSearch = () => {
    onClickFilterCallback({
      key: searchTypeMapping[searchType],
      value: keyword.value,
    });
  };

  return (
    <Row className="flex-between-center">
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">Sale Return</h4>
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
            'Employee Id',
            'Employee Name',
            'Product Name',
            'Purchase Rate',
            'Sales Rate',
          ].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Form.Select>
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

SaleReturnHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default SaleReturnHeader;
