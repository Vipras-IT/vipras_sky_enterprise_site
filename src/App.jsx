import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './layouts/Layout';

const App = () => {
  return (
    <Router basename="/">
      <Layout />
    </Router>
  );
};

export default App;
