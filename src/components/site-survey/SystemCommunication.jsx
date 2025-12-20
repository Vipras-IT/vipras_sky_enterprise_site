import WizardInput from 'components/wizard/WizardInput';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SystemCommunication = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Application"
          name="application"
          type="select"
          placeholder="Select your application type"
          options={['ADDA', 'Mygate', 'Nobroker Hood']}
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('application'),
          }}
        />
        <WizardInput
          label="No of Computers"
          name="noofcomputers"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofebrooms'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Transformer"
          name="nooftransformer"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooftransformer'),
          }}
        />
        <WizardInput
          label="No of EB Rooms"
          name="noofebrooms"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofebrooms'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Transformer"
          name="nooftransformer"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooftransformer'),
          }}
        />
        <WizardInput
          label="No of EB Rooms"
          name="noofebrooms"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofebrooms'),
          }}
        />
      </Row>
    </>
  );
};

SystemCommunication.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default SystemCommunication;
