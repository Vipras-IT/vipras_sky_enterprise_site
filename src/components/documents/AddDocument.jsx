import { Row, Col, Card } from 'react-bootstrap';
import FolderImage from 'assets/folder.png';
import FolderVideo from 'assets/video_folder.png';
import FolderDoc from 'assets/doc_folder.png';
import { Link } from 'react-router-dom';

const AddDocument = () => {
  return (
    <div>
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">Add Documents</h5>
        </div>
      </Card.Header>
      <Card.Body className="fw-normal px-md-6 py-4">
        <Row className="g-2 mb-3">
          <Col md={2}>
            <span>
              <h2>Photos</h2>
            </span>
            <button>
              <Link to="/addphotos">
                <img src={FolderImage} alt="" width={130} />
              </Link>
            </button>
          </Col>
          <Col md={2}>
            <span>
              <h2>Videos</h2>
            </span>
            <button>
              <img src={FolderVideo} alt="" width={130} height={130} />
            </button>
          </Col>
          <Col md={2}>
            <span>
              <h2>Docs</h2>
            </span>
            <button>
              <Link to="/add-dmr-document">
                <img src={FolderDoc} alt="" width={130} />
              </Link>
            </button>
          </Col>
        </Row>
      </Card.Body>
    </div>
  );
};
export default AddDocument;
