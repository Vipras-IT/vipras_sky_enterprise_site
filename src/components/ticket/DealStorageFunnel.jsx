import { Card } from 'react-bootstrap';
import DealStorageFunnelChart from './DealStorageFunnelChart';

const DealStorageFunnel = () => {
  return (
    <Card>
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">Ticket</h5>
        </div>
      </Card.Header>
      <Card.Body dir="ltr">
        <DealStorageFunnelChart />
      </Card.Body>
    </Card>
  );
};

export default DealStorageFunnel;
