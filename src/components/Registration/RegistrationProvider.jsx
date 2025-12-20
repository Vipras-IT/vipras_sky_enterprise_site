import { useState } from 'react';
import PropTypes from 'prop-types';
import { RegistrationContext } from 'context/Context';

const RegistrationProvider = ({ children }) => {
  const [employee, setEmployee] = useState({});
  const [step, setStep] = useState(1);

  const value = { employee, setEmployee, step, setStep };
  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

RegistrationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RegistrationProvider;
