/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth } from 'hooks/useAuth';
import { get } from 'lodash';
import expensesApi from 'api/expenses';
import WizardInput from 'components/wizard/WizardInput';
import { Select, Typography } from 'antd';
import { getErrorMessage } from 'helpers/utils';

const AddExpenses = () => {
  const { Title } = Typography;
  const { user } = useAuth();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const onSubmitData = async (data) => {
    const postData = {
      expenses: String(data.expenses),
    };
    setLoading(true);
    const response = await expensesApi.postExpenses(
      postData
    );
    const errorMessage = getErrorMessage(response);
    setLoading(false);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      toast.success('Expenses added successfully', {
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await expensesApi.getAllExpenses();
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
      } else {
        setExpenses(get(response.data, 'data', []));
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add Expenses</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md={6}>
              <WizardInput
                label="Expenses"
                name="expenses"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('expenses', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col span={6} offset={1}>
              <Title level={5}>Existing Expenses</Title>
              <Select
                showSearch
                size="large"
                style={{
                  width: '100%',
                }}
                options={expenses}
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {loading && (
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

export default AddExpenses;
