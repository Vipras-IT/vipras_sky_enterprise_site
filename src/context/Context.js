import { createContext } from 'react';
import { settings } from 'config/Config';

const AppContext = createContext(settings);

export const AuthWizardContext = createContext({ user: {} });

export const RegistrationContext = createContext({ employee: {} });

export default AppContext;
