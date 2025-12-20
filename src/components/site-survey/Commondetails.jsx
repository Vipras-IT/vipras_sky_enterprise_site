import PropTypes from 'prop-types';
import WizardInput from 'components/wizard/WizardInput';
import { Row, Col } from 'react-bootstrap';

const Commondetails = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Facility Office"
          name="facilityoff"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('facilityoff'),
          }}
        />
        <WizardInput
          label="Association Office"
          name="assoffice"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('assoffice'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No.of Vendors"
          name="noofvendors"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofvendors'),
          }}
        />
        <WizardInput
          label="Pantry Room"
          name="pntryroom"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('pntryroom'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Club House"
          name="clubhouse"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('clubhouse'),
          }}
        />
        <WizardInput
          label="Gym"
          name="gym"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('gym'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No.of Library"
          name="nooflibrary"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooflibrary'),
          }}
        />
        <WizardInput
          label="No of Manuals"
          name="noofmanuals"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofmanuals'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Swimming Pool"
          name="swimpool"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('swimpool'),
          }}
        />
        <WizardInput
          label="Party Hall / Multi Purpose Hall"
          name="noofhalls"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofhalls'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Commercial Space"
          name="commercialspace"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('commercialspace'),
          }}
        />
        <WizardInput
          label="Any Super Market"
          name="noofsupermkt"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofsupermkt'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Iron Shop"
          name="ironshop"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('ironshop'),
          }}
        />
        <WizardInput
          label="No of Gas Bank"
          name="noofgasbank"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofgasbank'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Fish Pond"
          name="nooffishpond"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooffishpond'),
          }}
        />
        <WizardInput
          label="No of Fountain"
          name="nooffountain"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooffountain'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Parks"
          name="noofparks"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofparks'),
          }}
        />
        <WizardInput
          label="No of Bench in Parks"
          name="noofbenchsinparks"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofbenchsinparks'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of OSR Area"
          name="noofosrarea"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofosrarea'),
          }}
        />
        <WizardInput
          label="No of OTS Area"
          name="noofotsarea"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofotsarea'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Play Grounds"
          name="noofplaygrounds"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofplaygrounds'),
          }}
        />
        <WizardInput
          label="No of Grounds - Indoor"
          name="noofgrounds"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofgrounds'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Grounds - Outdoor"
          name="noofgroundsoutdoor"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofgroundsoutdoor'),
          }}
        />
      </Row>
    </>
  );
};

Commondetails.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default Commondetails;
