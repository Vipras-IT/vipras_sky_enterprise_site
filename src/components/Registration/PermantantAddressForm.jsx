import PropTypes from 'prop-types';
import WizardInput from '../wizard/WizardInput';
import { Col, Row } from 'react-bootstrap';

const PermantAddressForm = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          type="textarea"
          label="Address"
          name="permanentAddress.address"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('permanentAddress.address'),
          }}
        />
        <WizardInput
          label="PinCode"
          name="permanentAddress.pincode"
          errors={errors}
          type="number"
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('permanentAddress.pincode'
              //   , {
              //   pattern: {
              //     value: /[0-9]{6}/,
              //     message: 'Pincode must be valid',
              //   },
              //   minLength: {
              //     value: 6,
              //     message: 'Pincode must be valid',
              //   },
              //   maxLength: {
              //     value: 6,
              //     message: 'Pincode must be valid',
              //   },
              // }
            ),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="District Name"
          name="permanentAddress.district"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('permanentAddress.district'),
          }}
        />
        <WizardInput
          label="State Name"
          name="state"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('permanentAddress.state'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Contact No"
          name="permanentAddress.contactNumber"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('permanentAddress.contactNumber'
            //   , {
            //   pattern: {
            //     value: /[0-9]{10}/,
            //     message: 'Contact number must be valid',
            //   },
            //   minLength: {
            //     value: 10,
            //     message: 'Contact number should be 10 char only',
            //   },
            //   maxLength: {
            //     value: 10,
            //     message: 'Contact number should be 10 char only',
            //   },
            // }
          ),
          }}
        />
        <WizardInput
          label="Additional Contact No"
          name="permanentAddress.additionalContactNumber"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('permanentAddress.additionalContactNumber'
            //   , {
            //   pattern: {
            //     value: /[0-9]{10}/,
            //     message: 'Contact number must be valid',
            //   },
            //   minLength: {
            //     value: 10,
            //     message: 'Contact number should be 10 char only',
            //   },
            //   maxLength: {
            //     value: 10,
            //     message: 'Contact number should be 10 char only',
            //   },
            // }
          ),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Reference by"
          name="referedBy"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('permanentAddress.referedBy'),
          }}
        />
      </Row>
    </>
  );
};

PermantAddressForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default PermantAddressForm;
