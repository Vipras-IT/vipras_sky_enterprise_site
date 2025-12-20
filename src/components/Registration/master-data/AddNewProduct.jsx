import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useAPI from 'hooks/useApi';
import addProductAPI from 'api/product';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { Select, Typography } from 'antd';
const { Title } = Typography;
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from 'helpers/utils';
const AddProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const updateProductDetailsAPI = useAPI(addProductAPI.updateProductDetails);
  const getProductDetailsByIdAPI = useAPI(addProductAPI.getProductDetailsById);
  const addProductsAPI = useAPI(addProductAPI.addProduct);
  const [productsType] = useState(['STORE', 'ASSET', 'HK']);
  const productsizes = [
    {
      value: '6',
      label: '6',
    },
    {
      value: '7',
      label: '7',
    },
    {
      value: '8',
      label: '8',
    },
    {
      value: '9',
      label: '9',
    },
    {
      value: '10',
      label: '10',
    },
    {
      value: '11',
      label: '11',
    },
    {
      value: '28',
      label: '28',
    },
    {
      value: '30',
      label: '30',
    },
    {
      value: '32',
      label: '32',
    },
    {
      value: '34',
      label: '34',
    },
    {
      value: '36',
      label: '36',
    },
    {
      value: '38',
      label: '38',
    },
    {
      value: '40',
      label: '40',
    },
    {
      value: '42',
      label: '42',
    },
    {
      value: '44',
      label: '44',
    },
    {
      value: '46',
      label: '46',
    },
    {
      value: 'L',
      label: 'L',
    },
    {
      value: 'M',
      label: 'M',
    },
    {
      value: 'S',
      label: 'S',
    },
    {
      value: 'XL',
      label: 'XL',
    },
    {
      value: 'XXL',
      label: 'XXL',
    },
    {
      value: 'XXXL',
      label: 'XXXL',
    },
    {
      value: '1 Star',
      label: '1 Star',
    },
    {
      value: '2 Star',
      label: '2 Star',
    },
    {
      value: 'Nill',
      label: 'Nill',
    },
  ];

  const { register, handleSubmit } = useForm();
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [productName, setProductName] = useState([]);
  const [type, setType] = useState([]);
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchData = async (token) => {
  //     try {
  //       const response = await axios.get(`${settings.apiUrl}/api/v1/product`, {
  //         headers: {
  //           'erp-token': token,
  //         },
  //       });
  //       if (response.data && response.data.data && response.data.data.items) {
  //         setProducts(response.data.data.items);
  //       } else {
  //         console.error('Invalid API response:', response.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData('token');
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await addProductAPI.getProductDetails();
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
      } else {
        console.log(get(response.data, 'data.items', []));

        setProducts(get(response.data, 'data.items', []));
      }
    };
    fetchData();
  }, []);

  const siteIdsOptions = products.map((product) => ({
    value: product.productId,
    label: product.productName,
  }));

  const onSearch = (value) => {
    console.log('search:', value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    if (
      get(addProductsAPI, 'data.success') &&
      !isEmpty(get(addProductsAPI, 'data.data'))
    ) {
      toast.success('Product Added successfully!', {
        theme: 'colored',
      });
      setSelectedProduct(null);
      setProductName('');
      setType('');
    } else if (get(addProductsAPI, 'data.message')) {
      toast.error('Product Name Already Created', {
        theme: 'colored',
      });
    }
  }, [addProductsAPI.data]);
  useEffect(() => {
    if (addProductsAPI.error) {
      toast.error('Product Added failed', {
        theme: 'colored',
      });
    }
  }, [addProductsAPI.error]);

  useEffect(() => {
    if (updateProductDetailsAPI.data) {
      if (
        get(updateProductDetailsAPI, 'data.success') &&
        !isEmpty(get(updateProductDetailsAPI, 'data.data'))
      ) {
        toast.success('Product updated successfully', {
          theme: 'colored',
        });
        navigate('/productlist', { replace: true });
      } else {
        toast.error('Product updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateProductDetailsAPI.data]);

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getProductDetailsByIdAPI.request(params.id);
    }
  }, [params.id]);
  useEffect(() => {
    if (getProductDetailsByIdAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        setProductName(
          get(getProductDetailsByIdAPI.data.data, 'productName', []),
        );
        const sizes = get(getProductDetailsByIdAPI.data.data, 'size', []);
        setSelectedProduct(sizes);
        const type = get(getProductDetailsByIdAPI.data.data, 'type', []);
        setType(type);
        console.log(type);
      }
    }
  }, [getProductDetailsByIdAPI.data]);

  const onSubmitData = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      productName: String(productName),
      size: selectedProduct,
      type: String(type),
      createdBy: Number(userData.employeeId),
    };
    if (!isEmpty(get(params, 'id'))) {
      delete postData.createdOn;
      delete postData.updatedOn;
      const assetIdString = params.id;
      const updatedData = { ...postData, id: assetIdString };
      updateProductDetailsAPI.request(updatedData);
    } else {
      addProductsAPI.request(postData);
    }
  };

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add Products</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md={6}>
              <label>Product Name</label>
              <input
                label="Product Name"
                name="productName"
                type="String"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <label>Product Name</label>
              <br />
              <Select
                showSearch
                size="large"
                placeholder="Select a product"
                optionFilterProp="children"
                //className="form-control"
                onSearch={onSearch}
                filterOption={filterOption}
                options={siteIdsOptions}
                style={{
                  width: 590,
                }}
              />
            </Col>
            <Col md={6}>
              <Title level={5}>Size</Title>
              <Select
                size="large"
                mode="multiple"
                name="size"
                allowClear
                style={{
                  width: '100%',
                }}
                placeholder="Please select"
                defaultValue={[]}
                value={selectedProduct}
                onChange={setSelectedProduct}
                options={productsizes}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('size'),
                }}
              />
            </Col>
            <Col md={6}>
              <label>Products Type</label>
              <select
                name="type"
                onChange={(e) => setType(e.target.value)}
                className="form-control"
                value={type}
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {productsType.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {addProductsAPI.loading && (
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

export default AddProduct;
