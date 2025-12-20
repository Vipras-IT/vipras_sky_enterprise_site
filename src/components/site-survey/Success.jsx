import PropTypes from 'prop-types';
import { Button, Col, Row } from 'react-bootstrap';

const Success = () => {
  return (
    <>
      <Row>
        <Col className="text-center">
          <div className="wizard-lottie-wrapper">
            <div className="wizard-lottie mx-auto">Success</div>
          </div>
          <h4 className="mb-1">Your account is all set!</h4>
          <p className="fs-0">Now you can access to your account</p>
          <Button color="primary" className="px-5 my-3" onClick={() => {}}>
            Start Over
          </Button>
        </Col>
      </Row>
    </>
  );
};

Success.propTypes = {
  reset: PropTypes.func.isRequired,
};

export default Success;
