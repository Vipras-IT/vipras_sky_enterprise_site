import PropTypes from 'prop-types';
import LandingSurvey from './Landing';

const HomeFormSuvery = ({ variant, validation, progressBar }) => {
  return (
    <LandingSurvey
      variant={variant}
      validation={validation}
      progressBar={progressBar}
    />
  );
};

HomeFormSuvery.propTypes = {
  variant: PropTypes.oneOf(['pills']),
  validation: PropTypes.bool,
  progressBar: PropTypes.bool,
};

export default HomeFormSuvery;
