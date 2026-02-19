/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import WizardInput from '../wizard/WizardInput';
import { Col, Row } from 'react-bootstrap';

const LocalAddressForm = ({ register, errors, setValue, watch }) => {
  const addressAsSame = watch('localAddress.addressSameAsPermanent');
  const addressValue = watch('permanentAddress.address');
  const pincodeValue = watch('permanentAddress.pincode');
  const districtValue = watch('permanentAddress.district');
  const stateValue = watch('permanentAddress.state');
  const contactNumberValue = watch('permanentAddress.contactNumber');
  const additionalContactNumberValue = watch(
    'permanentAddress.additionalContactNumber',
  );
  const referedByValue = watch('permanentAddress.referedBy');

  useEffect(() => {
    if (addressAsSame) {
      setValue('localAddress.address', addressValue);
      setValue('localAddress.pincode', pincodeValue);
      setValue('localAddress.district', districtValue);
      setValue('localAddress.state', stateValue);
      setValue('localAddress.contactNumber', contactNumberValue);
      setValue(
        'localAddress.additionalContactNumber',
        additionalContactNumberValue,
      );
      setValue('localAddress.referedBy', referedByValue);
    }
  }, [addressAsSame]);
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          type="checkbox"
          errors={errors}
          label={<>Copy from Permanent Address</>}
          name="addressSameAsPermanent "
          formControlProps={{
            ...register('localAddress.addressSameAsPermanent'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          type="textarea"
          label="Address"
          name="localAddress.address"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('localAddress.address'),
          }}
        />
        <WizardInput
          label="PinCode"
          name="localAddress.pincode"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('localAddress.pincode'
              // , {
              // maxLength: 6,
              // pattern: /[0-9]{6}/,
              // }
            ),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="District Name"
          name="localAddress.district"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('localAddress.district'),
          }}
        />
        <WizardInput
          label="State Name"
          name="state"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('localAddress.state'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Contact No"
          name="localAddress.contactNumber"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('localAddress.contactNumber'
              // ,{
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
          name="localAddress.additionalContactNumber"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('localAddress.additionalContactNumber'
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
            ...register('localAddress.referedBy'),
          }}
        />
      </Row>
    </>
  );
};

LocalAddressForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default LocalAddressForm;
