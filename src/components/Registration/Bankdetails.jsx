import PropTypes from 'prop-types';
import WizardInput from '../wizard/WizardInput';
import { Col, Row } from 'react-bootstrap';

const BankDetailsForm = ({ register, errors }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Name of A/C Holder"
          name="accountHolderName"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('bankDetails.accountHolderName'),
          }}
        />
        <WizardInput
          label="Bank Name"
          name="bankName"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('bankDetails.bankName', {
              pattern: {
                value: /[a-zA-Z]/,
                message: 'Bank Name must be valid',
              },
            }),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Branch"
          name="branch"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('bankDetails.branch', {
              pattern: {
                value: /[a-zA-Z]/,
                message: 'Branch must be valid',
              },
            }),
          }}
        />
        <WizardInput
          label="Account No"
          name="accountNumber"
          // type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('bankDetails.accountNumber', {
              pattern: {
                value: /[0-9]/,
                message: 'Account No must be valid',
              },
            }),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="IFSC Code"
          name="ifscode"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('bankDetails.ifscode'),
          }}
        />
        <WizardInput
          type="select"
          label="Is internet bank available?"
          name="internetBank"
          placeholder="Select your internet bank status..."
          errors={errors}
          options={['Yes', 'No']}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('bankDetails.internetBank'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Remark"
          name="remark"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('bankDetails.remark'),
          }}
        />
      </Row>
    </>
  );
};

BankDetailsForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default BankDetailsForm;
