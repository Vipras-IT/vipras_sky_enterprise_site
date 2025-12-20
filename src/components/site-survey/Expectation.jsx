import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import WizardInput from 'components/wizard/WizardInput';

const Expectation = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Facility Manager-C Licence Holder"
          name="facilitymgrlicense"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('facilitymgrlicense'),
          }}
        />
        <WizardInput
          label="Help Desk -Bank /Tally Know"
          name="helpdesk"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('helpdesk'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Security Officer-Exe Army"
          name="securityexarmy"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('securityexarmy'),
          }}
        />
        <WizardInput
          label="Age Limit"
          name="agelimit"
          type="select"
          options={['Yes', 'No']}
          placeholder="Select"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('agelimit'),
          }}
        />
      </Row>
    </>
  );
};

Expectation.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default Expectation;
