import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import Logo from 'components/common/Logo';
import { Outlet } from 'react-router-dom';

const ErrorLayout = () => {
  return (
    <section className="py-0">
      <Row className="flex-center min-vh-100 py-6">
        <Col sm={11} md={9} lg={7} xl={6} className="col-xxl-5">
          <Logo />
          <Outlet />
        </Col>
      </Row>
    </section>
  );
};

ErrorLayout.propTypes = {
  match: PropTypes.object,
};

export default ErrorLayout;
