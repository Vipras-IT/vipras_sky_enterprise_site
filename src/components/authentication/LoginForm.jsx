import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import siteAPI from 'api/siteCreation';
import loginAPI from 'api/login';
import { get } from 'lodash';
import { getErrorMessage } from 'helpers/utils';

const LoginForm = ({ hasLabel }) => {
  const { login } = useAuth();
  // State
  const getLoginAPI = useAPI(loginAPI.getUser);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });

  const userNavigation = () => {
    toast.success(`Logged in as ${formData.username}`, {
      theme: 'colored',
    });
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (getLoginAPI.data && get(getLoginAPI, 'data.success')) {
      login(get(getLoginAPI.data, 'data', {}));
      addAllSiteIds();
      addAllRoles();
    } else {
      toast.error(get(getLoginAPI, 'data.message'), {
        theme: 'colored',
      });
    }
  }, [getLoginAPI.data]);

  const addAllSiteIds = async () => {
    const response = await siteAPI.getAllSiteIds();
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      window.localStorage.setItem(
        'siteIds',
        JSON.stringify(get(response, 'data.data', [])),
      );
    }
  };
  const addAllRoles = async () => {
    const response = await siteAPI.getAllRole();
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      userNavigation();
      window.localStorage.setItem(
        'role',
        JSON.stringify(get(response, 'data.data', [])),
      );
    }
  };

  useEffect(() => {
    if (getLoginAPI.error) {
      toast.error('You have entered an invalid username or password', {
        theme: 'colored',
      });
    }
  }, [getLoginAPI.error]);

  // Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    getLoginAPI.request({
      userId: formData.username,
      password: formData.password,
    });
  };

  const handleFieldChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Username</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Username' : ''}
          value={formData.username}
          name="username"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Password</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Password' : ''}
          value={formData.password}
          name="password"
          onChange={handleFieldChange}
          type="password"
        />
      </Form.Group>

      <Row className="justify-content-between align-items-center">
        <Col xs="auto">
          <Form.Check type="checkbox" id="rememberMe" className="mb-0">
            <Form.Check.Input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  remember: e.target.checked,
                })
              }
            />
            <Form.Check.Label className="mb-0 text-700">
              Remember me
            </Form.Check.Label>
          </Form.Check>
        </Col>

        <Col xs="auto">
          <Link className="fs--1 mb-0" to="/forgot-password">
            Forgot Password?
          </Link>
        </Col>
      </Row>

      <Form.Group>
        <Button
          type="submit"
          color="primary"
          className="mt-3 w-100"
          disabled={!formData.username || !formData.password}
        >
          {getLoginAPI.loading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          <span className="ps-2">Log in</span>
        </Button>
      </Form.Group>
    </Form>
  );
};

LoginForm.propTypes = {
  layout: PropTypes.string,
  hasLabel: PropTypes.bool,
};

LoginForm.defaultProps = {
  layout: 'simple',
  hasLabel: false,
};

export default LoginForm;
