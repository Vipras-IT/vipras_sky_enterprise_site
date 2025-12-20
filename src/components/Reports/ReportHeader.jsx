/* eslint-disable react/prop-types */
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Col,
  Row,
  Button,
  FormControl,
  InputGroup,
  Form,
} from 'react-bootstrap';

const SiteReportHeader = ({ onClickFilterCallback, defaultKeyword }) => {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [searchType, setSearchType] = useState('employeeId');
  const onKeywordChange = (e) => {
    setKeyword({ key: searchType, value: e.target.value });
  };
  const onClickSearch = () => {
    onClickFilterCallback({ key: searchType, value: keyword.value });
  };

  return (
    <Row className="flex-between-center">
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h4 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">Select</h4>
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
          {['siteName', 'unitcode', 'employeeId'].map((pageSize) => (
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
          >
            <span className="d-none d-sm-inline-block ms-1">Export</span>
          </IconButton>
        </div>
      </Col>
    </Row>
  );
};

SiteReportHeader.propTypes = {
  handleTicketsSearch: PropTypes.func,
};

export default SiteReportHeader;
