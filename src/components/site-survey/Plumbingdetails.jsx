import WizardInput from 'components/wizard/WizardInput';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

const Plumbingdetails = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Water Pumbing System"
          name="wtrpumbsys"
          type="select"
          placeholder="Select your pumbing type"
          options={[]}
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('wtrpumbsys'),
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
          label="No of Pumbing Shaft"
          name="noofpumbshaft"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofpumbshaft'),
          }}
        />
        <WizardInput
          label="No of Stainer"
          name="noofstain"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofstain'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of PRV"
          name="noofprv"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofprv'),
          }}
        />
        <WizardInput
          label="No of Well"
          name="noofwell"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofwell'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Bore well"
          name="noofborewell"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofborewell'),
          }}
        />
        <WizardInput
          label="No of Sumps and Capacity -Ltr"
          name="noofsumpcpty"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofsumpcpty'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Rain Water Sumps and Capacity -Ltr"
          name="noofraincpty"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofraincpty'),
          }}
        />
        <WizardInput
          label="No of OH Tank and Capacity -Ltr"
          name="noofohtnkcpty"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofohtnkcpty'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of RO and Capacity - Ltr"
          name="noofrocpty"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('application'),
          }}
        />
        <WizardInput
          label="No of Water Inlet (with meter)"
          name="noofwtrinlet"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofwtrinlet'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Water Inlet (without meter)"
          name="noofwtrwithotmtr"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofwtrwithotmtr'),
          }}
        />
      </Row>
    </>
  );
};

Plumbingdetails.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default Plumbingdetails;
