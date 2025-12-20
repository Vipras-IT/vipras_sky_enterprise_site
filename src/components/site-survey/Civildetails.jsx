import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import WizardInput from 'components/wizard/WizardInput';

const Civildetails = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No Of Acres"
          name="noofacres"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofacres'),
          }}
        />
        <WizardInput
          label="Compound Wall"
          name="compoundwall"
          type="select"
          options={['Full', 'Partial', 'No']}
          placeholder="Select compound Type?"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('compoundwall'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Any Construction Work"
          name="anyconstriongoing"
          type="select"
          options={['Yes', 'No']}
          placeholder="Is Any Construction going?"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('anyconstriongoing'),
          }}
        />
        <WizardInput
          label="If Yes Duration"
          name="duration"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('duration'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Seepage Area"
          name="noofseepage"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofseepage'),
          }}
        />
        <WizardInput
          label="No of Civil Damage Area"
          name="noofcivildamagearea"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofcivildamagearea'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Footpath Damage Area"
          name="nooffootpath"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooffootpath'),
          }}
        />
        <WizardInput
          label="No of Paverblock Damage Area"
          name="noofpaverblock"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofpaverblock'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No.of Drinage Damage Area"
          name="noofdrinagearea"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofdrinagearea'),
          }}
        />
      </Row>
    </>
  );
};

Civildetails.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default Civildetails;
