/* eslint-disable react/prop-types */

import { Card, Col, Row } from 'react-bootstrap';
import Background from 'components/common/Background';
import bgImage from 'assets/corner-5.png';
import connectCircle from 'assets/connect-circle.png';

const ConnectCard = ({ count }) => {
  return (
    <Card>
      <Background
        image={bgImage}
        className="bg-card"
        style={{
          borderTopRightRadius: '0.375rem',
          borderBottomRightRadius: '0.375rem',
        }}
      />
      <Card.Body className="position-relative">
        <Row className="g-2 align-items-sm-center">
          <Col xs="auto">
            <img src={connectCircle} alt="connectCircle" height={55} />
          </Col>
          <Col>
            <Row className="align-items-center">
              <Col className="pe-xl-8">
                <h2 className="fs-2 mb-3 mb-sm-0 text-primary">
                  {count} - Manual attendance given by you for this Month
                </h2>
              </Col>
              <Col xs="auto" className="ms-auto"></Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ConnectCard;
