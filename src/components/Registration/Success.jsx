import { RegistrationContext } from 'context/Context';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

const Success = ({ reset }) => {
  const { setStep, setEmployee } = useContext(RegistrationContext);

  const emptyData = () => {
    setStep(1);
    setEmployee({});
    reset();
  };

  return (
    <>
      <Row>
        <Col className="text-center">
          <div className="wizard-lottie-wrapper">
            <div className="wizard-lottie mx-auto"></div>
          </div>
          <h4 className="mb-1">Your Employee ID Created</h4>
          <p className="fs-0">All the Best</p>
          <Button color="primary" className="px-5 my-3" onClick={emptyData}>
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
