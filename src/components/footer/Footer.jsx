import { Col, Row } from 'react-bootstrap';

const Footer = () => (
  <footer className="footer">
    <Row className="justify-content-center text-center fs--1 mt-4 mb-3">
      <Col sm="auto">
        <p className="mb-0 text-600 text-center">
          Vipras Facility Management Solutions Pvt Ltd., All rights reserved.{' '}
          <span className="d-none d-sm-inline-block">| </span>
          <br className="d-sm-none" /> {new Date().getFullYear()} &copy;{' '}
        </p>
      </Col>
    </Row>
  </footer>
);

export default Footer;
