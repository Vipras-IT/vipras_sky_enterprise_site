/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import notificationAPI from 'api/notificationapi';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import WizardInput from 'components/wizard/WizardInput';
import { Select, Typography } from 'antd';
import { getErrorMessage } from 'helpers/utils';
import siteAPI from 'api/siteCreation';

const AddRole = () => {
  const { Title } = Typography;
  const { user } = useAuth();
  const roleAPI = useAPI(notificationAPI.postRole);
  const { register, handleSubmit, watch } = useForm();

  useEffect(() => {
    if (get(roleAPI, 'data.success') && !isEmpty(get(roleAPI, 'data.data'))) {
      toast.success('Role Added successfully!', {
        theme: 'colored',
      });
      //   navigate('/vendor-list', { replace: true });
    } else if (get(roleAPI, 'data.message')) {
      toast.error('Role Added failed', {
        theme: 'colored',
      });
    }
  }, [roleAPI.data]);

  useEffect(() => {
    if (roleAPI.error) {
      toast.error('Role Added failed', {
        theme: 'colored',
      });
    }
  }, [roleAPI.error]);

  const onSubmitData = async (data) => {
    const postData = {
      role: String(data.role),
    };
    roleAPI.request(postData, get(user, 'token'));
    const response = await siteAPI.getAllRole();
    window.localStorage.setItem(
      'role',
      JSON.stringify(get(response, 'data.data', [])),
    );
    showUpdateEmployee();
  };

  useEffect(() => {
    showUpdateEmployee();
  }, []);
  const [assignedForOptions, setAssignedForOptions] = useState([]);
  // useEffect(() => {
  const showUpdateEmployee = async () => {
    try {
      const response = await notificationAPI.getRole(get(user, 'token'));
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
        return;
      }

      const roles = get(response, 'data.data', []);
      const options = roles.map((item) => ({
        value: item,
        label: item,
      }));

      setAssignedForOptions(options);
    } catch (error) {
      toast.error('An error occurred while fetching roles.', {
        theme: 'colored',
      });
      console.error(error);
    }
  };

  //   showUpdateEmployee();
  // }, [roles]);

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add Role</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md={6}>
              <WizardInput
                label="Role"
                name="role"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('role', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col span={6} offset={1}>
              <Title level={5}>Existing Role</Title>
              <Select
                showSearch
                size="large"
                style={{
                  width: '100%',
                }}
                options={assignedForOptions}
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {roleAPI.loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <span className="ps-2">Save</span>
              </Button>
            </Col>
            <Col md={4}></Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

export default AddRole;
