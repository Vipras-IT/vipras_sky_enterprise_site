import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import WizardInput from 'components/wizard/WizardInput';

const Electricdetails = ({ register, errors }) => {
  return (
    <>
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
          label="No.of DB Boxs/Supply Pillors"
          name="noofsupplypillors"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofsupplypillors'),
          }}
        />
        <WizardInput
          label="No.of Electrical Shaft "
          name="noofelectricshaft"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofelectricshaft'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No.of Lights"
          name="nooflights"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooflights'),
          }}
        />
        <WizardInput
          label="No.of EB Meters"
          name="noofebmeters"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofebmeters'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No.of EB Posts"
          name="noofebpostes"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofebpostes'),
          }}
        />
        <WizardInput
          label="No Of Lift"
          name="nooflift"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooflift'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Lift Company Name"
          name="liftcompanyname"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('liftcompanyname'),
          }}
        />
        <WizardInput
          label="No Of DG's"
          name="noofdgs"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofdgs'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Dg Back Up - Individual"
          name="dgbackupindv"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('dgbackupindv'),
          }}
        />
        <WizardInput
          label="Dg Back Up - Common"
          name="dgbackupcmn"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('dgbackupcmn'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No.of HAVC"
          name="noofhavc"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofhavc'),
          }}
        />
        <WizardInput
          label="No.of ACs"
          name="noofacs"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofacs'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No.of Chiller Plant"
          name="noofchillerplt"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofchillerplt'),
          }}
        />
      </Row>
    </>
  );
};

Electricdetails.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default Electricdetails;
