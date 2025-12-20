// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './hooks/useAuth';
import App from './App';
import Main from './AppContainer';
import './css/theme.min.css';
import './css/user.min.css';
import 'helpers/initFA';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AuthProvider>
    <Main>
      <App />
    </Main>
  </AuthProvider>,
);
