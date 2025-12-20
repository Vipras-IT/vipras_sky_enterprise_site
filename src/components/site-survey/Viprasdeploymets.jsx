import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import WizardInput from 'components/wizard/WizardInput';

const Viprasdeployments = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Facility Manager"
          name="facilitymanager"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('facilitymanager'),
          }}
        />
        <WizardInput
          label="Facility Engineer"
          name="facilityengg"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('facilityengg'),
          }}
        />
      </Row>

      <Row className="g-2 mb-3">
        <WizardInput
          label="Accounts / Help Desk"
          name="accounthelpdesk"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('accounthelpdesk'),
          }}
        />
        <WizardInput
          label="Technicial Manager / Supervisor "
          name="techmanagersupervisor"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('techmanagersupervisor'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="WTP Operator"
          name="wtpoperator"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('wtpoperator'),
          }}
        />
        <WizardInput
          label="STP Operator"
          name="stpoperator"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('stpoperator'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Electrician"
          name="electrician"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('electrician'),
          }}
        />
        <WizardInput
          label="Plumber"
          name="plumber"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('plumber'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Multi Skill Technician"
          name="multiskilltech"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('multiskilltech'),
          }}
        />
        <WizardInput
          label="Swimming Pool Opreator"
          name="swimmingpoooper"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('swimmingpoooper'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Gym Trainer"
          name="gymtrainer"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('gymtrainer'),
          }}
        />
        <WizardInput
          label="HK Supervisor"
          name="hksupervisor"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('hksupervisor'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="HK--Female"
          name="hkfemale"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('hkfemale'),
          }}
        />
        <WizardInput
          label="HK Male"
          name="hkmale"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('hkmale'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Gardner Supervisor"
          name="gardnersupervisor"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('gardnersupervisor'),
          }}
        />
        <WizardInput
          label="Gardner-Male"
          name="gardnermale"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('gardnermale'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Gardner-Female"
          name="gardnerfemale"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('gardnerfemale'),
          }}
        />
        <WizardInput
          label="Scavenger"
          name="scavenger"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('scavenger'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Security Officer"
          name="securityofficer"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('securityofficer'),
          }}
        />
        <WizardInput
          label="Assistant Security Officer"
          name="asssecurityofficer"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('asssecurityofficer'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Security Guard"
          name="securityguard"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('securityguard'),
          }}
        />
        <WizardInput
          label="Security Lady Guard"
          name="securityladyguard"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('securityladyguard'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Life Guard"
          name="lifeguard"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('lifeguard'),
          }}
        />
        <WizardInput
          label="Fire Guard"
          name="fireguard"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('fireguard'),
          }}
        />
      </Row>
    </>
  );
};

Viprasdeployments.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default Viprasdeployments;
