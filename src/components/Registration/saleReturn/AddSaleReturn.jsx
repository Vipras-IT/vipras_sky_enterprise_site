import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import SalesAPI from 'api/deduction';
import { toast } from 'react-toastify';
import { get, isEmpty, toNumber } from 'lodash';
import { Typography, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import employeeAPI from 'api/getEmployeeDetails';
const { Title } = Typography;
const SaleReturn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const addSaleReturnAPI = useAPI(SalesAPI.AddSaleReturn);
  const getEmployeeAPI = useAPI(employeeAPI.getEmployeeByEmployeeNumber);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [size, setsize] = useState('');
  const [purchaseRate, setPurchaseRate] = useState('');
  const [salesRate, setSalesRate] = useState('');

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };
  const handlechangeProductName = (e) => {
    setProductName(e.target.value);
  };
  const handlechangequantity = (e) => {
    setQuantity(e.target.value);
  };
  const handlechangesize = (e) => {
    setsize(e.target.value);
  };
  const handlechangepurchaseRate = (e) => {
    setPurchaseRate(e.target.value);
  };
  const handlechangesalesRate = (e) => {
    setSalesRate(e.target.value);
  };

  const onSearch = (value) => {
    if (value) {
      getEmployeeAPI.request(value, get(user, 'token'));
    }
  };
  const { Search } = Input;

  const onSubmitData = () => {
    const postData = {
      employeeId: toNumber(employeeId),
      employeeName: String(employeeName),
      productName: String(productName),
      quantity: toNumber(quantity),
      size: String(size),
      purchaseRate: toNumber(purchaseRate),
      salesRate: toNumber(salesRate),
    };
    addSaleReturnAPI.request(postData, get(user, 'token'));
  };

  useEffect(() => {
    if (getEmployeeAPI.data) {
      if (
        get(getEmployeeAPI, 'data.success') &&
        !isEmpty(get(getEmployeeAPI, 'data.data.items'))
      ) {
        setEmployeeName(
          get(getEmployeeAPI, 'data.data.items[0].employeeName', ''),
        );
      } else {
        toast.error('Employee not found!', {
          theme: 'colored',
        });
        setEmployeeName('');
      }
    }
  }, [getEmployeeAPI.data]);

  useEffect(() => {
    if (getEmployeeAPI.error) {
      toast.error('Something went wrong please try again', {
        theme: 'colored',
      });
    }
  }, [getEmployeeAPI.error]);

  useEffect(() => {
    if (
      get(addSaleReturnAPI, 'data.success') &&
      !isEmpty(get(addSaleReturnAPI, 'data.data'))
    ) {
      toast.success('sale Return added successfully', {
        theme: 'colored',
      });
      navigate('/salereturndetails', { replace: true });
    }
  }, [addSaleReturnAPI.data]);

  useEffect(() => {
    if (addSaleReturnAPI.error) {
      toast.error('sales added failed', {
        theme: 'colored',
      });
    }
  }, [addSaleReturnAPI.error]);

  const { register, handleSubmit } = useForm();

  return (
    <Card
      as={Form}
      onSubmit={handleSubmit(onSubmitData)}
      className="theme-wizard mb-5"
    >
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">Sales Return</h5>
        </div>
      </Card.Header>

      <Card.Body className="fw-normal px-md-6 py-4">
        <Row className="g-2 mb-3">
          <Col md="6">
            <Title level={5}>Employee Id</Title>
            <Search
              name="employeeId"
              size="large"
              placeholder="employee Id"
              value={employeeId}
              onChange={handleEmployeeIdChange}
              onSearch={onSearch}
              enterButton
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('employeeId'),
              }}
            />
          </Col>
          <Col md="6">
            <Title level={5}>Employee Name</Title>
            <Input
              name="employeeName"
              size="large"
              prefix={<UserOutlined />}
              value={employeeName}
              readOnly
              onChange={handleEmployeeNameChange}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('employeeName'),
              }}
            />
          </Col>
          <Col md="6">
            <label>Product Name</label>
            <Input
              type="text"
              className="form-control"
              label="productName"
              name="productName"
              value={productName}
              onChange={handlechangeProductName}
            />
          </Col>
          <Col md="6">
            <label>Quantity</label>
            <Input
              type="number"
              className="form-control"
              label="quantity"
              name="quantity"
              value={quantity}
              onChange={handlechangequantity}
            />
          </Col>
          <Col md="6">
            <label>Size</label>
            <Input
              type="text"
              className="form-control"
              label="size"
              name="size"
              value={size}
              onChange={handlechangesize}
            />
          </Col>
          <Col md="6">
            <label>Purchase Rate</label>
            <Input
              type="number"
              className="form-control"
              label="purchaseRate"
              name="purchaseRate"
              value={purchaseRate}
              onChange={handlechangepurchaseRate}
            />
          </Col>
          <Col md="6">
            <label>Sales Rate</label>
            <Input
              type="number"
              className="form-control"
              label="salesRate"
              name="salesRate"
              value={salesRate}
              onChange={handlechangesalesRate}
            />
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <Row className="g-2 mb-3">
          <Col md={4}></Col>
          <Col md={4}>
            <Button type="submit" color="primary" className="mt-3 w-100">
              {addSaleReturnAPI.loading && (
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
  );
};

export default SaleReturn;
