import { useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import vendorAPI from 'api/vendor';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import WizardInput from '../../wizard/WizardInput';
import { useNavigate, useParams } from 'react-router-dom';
const AddVendor = () => {
  const { user } = useAuth();
  const addvendorAPI = useAPI(vendorAPI.updatevendordetails);
  const updateVendorAPI = useAPI(vendorAPI.updateVendor);
  const getByIdVendorAPI = useAPI(vendorAPI.getVendorByID);
  const params = useParams();
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      get(addvendorAPI, 'data.success') &&
      !isEmpty(get(addvendorAPI, 'data.data'))
    ) {
      toast.success('Vendor Added successfully!', {
        theme: 'colored',
      });
      navigate('/vendor-list', { replace: true });
    } else if (get(addvendorAPI, 'data.message')) {
      toast.error('Vendor Name Already Created', {
        theme: 'colored',
      });
    }
  }, [addvendorAPI.data]);

  useEffect(() => {
    if (addvendorAPI.error) {
      toast.error('Vendor Added failed', {
        theme: 'colored',
      });
    }
  }, [addvendorAPI.error]);
  useEffect(() => {
    if (updateVendorAPI.data) {
      if (
        get(updateVendorAPI, 'data.success') &&
        !isEmpty(get(updateVendorAPI, 'data.data'))
      ) {
        toast.success('vendor updated successfully', {
          theme: 'colored',
        });
        navigate('/vendor-list', { replace: true });
      } else {
        toast.error('vendor updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateVendorAPI.data]);
  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getByIdVendorAPI.request(params.id, get(user, 'token'));
    }
  }, [params.id]);
  useEffect(() => {
    if (getByIdVendorAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        reset(getByIdVendorAPI.data.data);
      }
    }
  }, [getByIdVendorAPI.data]);
  const onSubmitData = async (data) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      vendorName: String(data.vendorName),
      gstNumber: String(data.gstNumber),
      billingAddress: String(data.billingAddress),
      accountHolderName: String(data.accountHolderName),
      accountNumber: String(data.accountNumber),
      bankName: String(data.bankName),
      branch: String(data.branch),
      ifscCode: String(data.ifscCode),
      contactNumber: String(data.contactNumber),
      remarks: String(data.remarks),
      createdBy: Number(userData.employeeId),
    };
    if (!isEmpty(get(params, 'id'))) {
      delete postData.createdOn;
      delete postData.updatedOn;
      const assetIdString = params.id;
      const updatedData = { ...postData, id: assetIdString };
      updateVendorAPI.request(updatedData, get(user, 'token'));
    } else {
      addvendorAPI.request(postData, get(user, 'token'));
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
            <h5 className="mb-0 text-white">Add Vendor</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md={6}>
              <WizardInput
                label="Vendor Name"
                name="vendorName"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('vendorName', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="GST Number"
                name="gstNumber"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('gstNumber'),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Billing Address"
                name="billingAddress"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('billingAddress', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Account Holder Name"
                name="accountHolderName"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('accountHolderName', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Account Number"
                name="accountNumber"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('accountNumber', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Bank Name"
                name="bankName"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('bankName', {
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'Alphabet characters only',
                    },
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Branch"
                name="branch"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('branch', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="IFSC Code"
                name="ifscCode"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('ifscCode', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Contact Number"
                name="contactNumber"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('contactNumber'),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Remarks"
                name="remarks"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('remarks'),
                }}
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {addvendorAPI.loading && (
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

export default AddVendor;
