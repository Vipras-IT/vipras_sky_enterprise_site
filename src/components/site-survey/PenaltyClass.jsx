import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import WizardInput from 'components/wizard/WizardInput';

const PenaltyClass = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Wrong Parking"
          name="wrongpark"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('wrongpark'),
          }}
        />
        <WizardInput
          label="Over Speed"
          name="overspeed"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('overspeed'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Property Damages"
          name="proptydamage"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('proptydamage'),
          }}
        />
        <WizardInput
          label="Miscellaneous"
          name="miscellaneous"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('miscellaneous'),
          }}
        />
      </Row>
    </>
  );
};

PenaltyClass.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default PenaltyClass;
