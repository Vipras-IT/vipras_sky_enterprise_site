/* eslint-disable react/prop-types */
import IconButton from 'components/common/IconButton';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

const RecentPurchasesHeader = ({ handleModel, pageName }) => {
  let title;

  if (pageName === 'PreEmpment') {
    title = 'Previous Employment Details';
  } else if (pageName === 'Empty') {
    title = 'Site ManPower/Billing Details';
  } else if (pageName === 'Other') {
    title = 'Site Other Service Details';
  } else if (pageName === 'Tenant') {
    title = 'Tenant Employee Details';
  } else {
    title = 'Family Details';
  }

  return (
    <Row className="flex-between-center">
      <Col xs={4} sm="auto" className="d-flex align-items-center pe-0">
        <h5 className="fs-0 mb-0 text-nowrap py-2 py-xl-0">{title}</h5>
      </Col>
      <Col xs={8} sm="auto" className="ms-auto text-end ps-0">
        <div id="orders-actions">
          <IconButton
            variant="primary"
            size="sm"
            icon="plus"
            transform="shrink-3"
            onClick={handleModel}
          >
            <span className="d-none d-sm-inline-block ms-1">New</span>
          </IconButton>
        </div>
      </Col>
    </Row>
  );
};

RecentPurchasesHeader.propTypes = {
  selectedRowIds: PropTypes.object,
  watch: PropTypes.func,
};

export default RecentPurchasesHeader;
