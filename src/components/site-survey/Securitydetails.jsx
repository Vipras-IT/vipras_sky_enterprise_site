import WizardInput from 'components/wizard/WizardInput';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

const Securitydetails = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Gate"
          name="noofgate"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofgate'),
          }}
        />
        <WizardInput
          label="Boom Barrier"
          name="boombarrier"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('boombarrier'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Security Cabin"
          name="securitycabin"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('securitycabin'),
          }}
        />
        <WizardInput
          label="Security Mobile Device"
          name="sectymobiledev"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('sectymobiledev'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No.of Car Parking Slots"
          name="noofcarparking"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofcarparking'),
          }}
        />
        <WizardInput
          label="Driver Waiting Area"
          name="drivingwaitarea"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('drivingwaitarea'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No.of Old Vehicles (Unused for long time)"
          name="noofoldvechiles"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofoldvechiles'),
          }}
        />
        <WizardInput
          label="No of Sprinklar"
          name="noofsprinklar"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofsprinklar'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Jackey Pump"
          name="noofjackeypump"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofjackeypump'),
          }}
        />
        <WizardInput
          label="No of UPS"
          name="noofups"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofups'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of UPS Battery"
          name="noofupsbattery"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofupsbattery'),
          }}
        />
        <WizardInput
          label="No of Lighting Arrester"
          name="nooflightingarrester"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooflightingarrester'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Lights"
          name="nooflights"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooflights'),
          }}
        />
        <WizardInput
          label="Fire Hydrant"
          name="firehydrant"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('firehydrant'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Fire Hydrant Tank Capacity (Lts)"
          name="firehydranttankcpty"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('firehydranttankcpty'),
          }}
        />
        <WizardInput
          label="No of Biometric Device"
          name="noofbiometricdevice"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofbiometricdevice'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No Of Camera"
          name="noofcamera"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofcamera'),
          }}
        />
        <WizardInput
          label="Cctv Monitor and Place"
          name="cctvmonitorplace"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('cctvmonitorplace'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="RFID Reader"
          name="rfidreader"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('rfidreader'),
          }}
        />
      </Row>
    </>
  );
};

Securitydetails.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default Securitydetails;
