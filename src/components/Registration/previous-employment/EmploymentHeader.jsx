import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';

import { Col, Form, Row, Button } from 'react-bootstrap';

const RecentPurchasesHeader = ({ selectedRowIds }) => {
  return (
    <Row className="flex-between-center">
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h5 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">
          Employment details
        </h5>
      </Col>
      <Col xs={8} sm="auto" className="ms-auto text-end ps-0">
        {Object.keys(selectedRowIds).length > 0 ? (
          <div className="d-flex">
            <Form.Select size="sm" aria-label="Bulk actions">
              <option>Bulk Actions</option>
              <option value="refund">Refund</option>
              <option value="delete">Delete</option>
              <option value="archive">Archive</option>
            </Form.Select>
            <Button
              type="button"
              variant="falcon-default"
              size="sm"
              className="ms-2"
            >
              Apply
            </Button>
          </div>
        ) : (
          <div id="orders-actions">
            <IconButton
              variant="primary"
              size="sm"
              icon="plus"
              transform="shrink-3"
            >
              <span className="d-none d-sm-inline-block ms-1">New</span>
            </IconButton>
          </div>
        )}
      </Col>
    </Row>
  );
};

RecentPurchasesHeader.propTypes = {
  selectedRowIds: PropTypes.object,
};

export default RecentPurchasesHeader;
