import PropTypes from 'prop-types';
import WizardLayout from './LayoutForm';
import RegistrationProvider from './RegistrationProvider';

const RegistrationWizard = ({ variant, validation, progressBar }) => {
  return (
    <RegistrationProvider>
      <WizardLayout
        variant={variant}
        validation={validation}
        progressBar={progressBar}
      />
    </RegistrationProvider>
  );
};

RegistrationWizard.propTypes = {
  variant: PropTypes.oneOf(['pills']),
  validation: PropTypes.bool,
  progressBar: PropTypes.bool,
};

export default RegistrationWizard;
