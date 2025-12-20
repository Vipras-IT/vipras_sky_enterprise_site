import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import WizardInput from 'components/wizard/WizardInput';

const RevenueSources = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Move In/Out"
          name="moveinout"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('moveinout'),
          }}
        />
        <WizardInput
          label="Rental"
          name="rental"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('rental'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Event Management"
          name="eventmgt"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('eventmgt'),
          }}
        />
        <WizardInput
          label="Advertisement /Board"
          name="advertiseboard"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('advertiseboard'),
          }}
        />
      </Row>
    </>
  );
};

RevenueSources.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default RevenueSources;
