import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import WizardInput from 'components/wizard/WizardInput';

const CostEffectiveMeasure = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Cost Effective Measure in EB Consumable"
          name="costeffectiveebmeasure"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('costeffectiveebmeasure'),
          }}
        />
        <WizardInput
          label="Water Consumable"
          name="waterconsumable"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('waterconsumable'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="HK-Consumable"
          name="hkconsumable"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('hkconsumable'),
          }}
        />
        <WizardInput
          label="Stp-Wtp-Sp-Consumable"
          name="stpwtpconsume"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('stpwtpconsume'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Existing Measurements / Costs "
          name="existingmeasurscosts"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('existingmeasurscosts'),
          }}
        />
      </Row>
    </>
  );
};

CostEffectiveMeasure.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default CostEffectiveMeasure;
