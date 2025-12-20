/* eslint-disable react/prop-types */

import { Card, Col, Row } from 'react-bootstrap';
import TransactionChart from './TransactionChart';

const Transactions = ({ available, used }) => {
  return (
    <Card className="card h-100 min-h-30">
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative card-title-min-h">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">Available Balance</h5>
        </div>
      </Card.Header>
      <Card.Body className="p-3 d-flex aligm-items-center">
        <TransactionChart available={available} used={used} />
      </Card.Body>
      <Card.Footer className="border-top border-200 py-0">
        <Row>
          <Col className="border-end border-200 py-3 d-flex justify-content-center">
            <div>
              <h6 className="fs-0 mb-0 d-flex align-items-center">Balance</h6>
              <h6 className="fs-0 mb-0 d-flex align-items-center">
                {available}
              </h6>
            </div>
          </Col>
          <Col className="py-3 d-flex justify-content-center">
            <div>
              <h6 className="fs-0 mb-0 d-flex align-items-center">Used</h6>
              <h6 className="fs-0 mb-0 d-flex align-items-center">{used}</h6>
            </div>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default Transactions;
