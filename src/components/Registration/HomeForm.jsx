import PropTypes from 'prop-types';
import LayoutForm from './LayoutForm';
import AuthWizardProvider from '../wizard/AuthWizardProvider';

const HomeForm = ({ variant, validation, progressBar }) => {
  return (
    <AuthWizardProvider>
      <LayoutForm
        variant={variant}
        validation={validation}
        progressBar={progressBar}
      />
    </AuthWizardProvider>
  );
};

HomeForm.propTypes = {
  variant: PropTypes.oneOf(['pills']),
  validation: PropTypes.bool,
  progressBar: PropTypes.bool,
};

export default HomeForm;
