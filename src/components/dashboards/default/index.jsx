import { Row, Col } from 'react-bootstrap';
import ImpresHolderProfile from 'components/imprest-holder/ImpresHolderProfile';

const Dashboard = () => {
  return (
    <Row className="g-3">
      <Col xxl={12}>
        <ImpresHolderProfile />
      </Col>
    </Row>
  );
};

export default Dashboard;
