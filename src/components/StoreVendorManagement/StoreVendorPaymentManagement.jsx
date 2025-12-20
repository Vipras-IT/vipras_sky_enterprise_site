import { useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import storeVendorAPI from 'api/storeVendorPayment';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import WizardInput from 'components/wizard/WizardInput';
import { useState } from 'react';

const StoreVendorPaymentManagement = () => {
  const { user } = useAuth();
  // const navigate = useNavigate();
  // State
  const addStorevendorAPI = useAPI(storeVendorAPI.postStoreVendordetails);
  const updateVendorAPI = useAPI(
    storeVendorAPI.updateStoreVendordManagementdetails,
  );
  const getByIdVendorAPI = useAPI(storeVendorAPI.getStoreVendordetails);
  const params = useParams();
  const [debit, setDebit] = useState(0);
  const [tdsPercentage, setTdsPercentage] = useState();
  const [tdsAmount, setTdsAmount] = useState();
  const [credit, setCredit] = useState(0);
  const [grantTotal, setGrantTotal] = useState(0);
  const [paymentMode] = useState(['Gpay', 'NEFT', 'Cheque', 'RTGS', 'Cash']);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [dates, setDates] = useState();
  const [description, setDescription] = useState('');
  useEffect(() => {
    if (
      get(addStorevendorAPI, 'data.success') &&
      !isEmpty(get(addStorevendorAPI, 'data.data'))
    ) {
      toast.success('Vendor Added successfully!', {
        theme: 'colored',
      });
      navigate('/storevendor-report', { replace: true });
    }
  }, [addStorevendorAPI.data]);

  useEffect(() => {
    if (addStorevendorAPI.error) {
      toast.error('Vendor Added failed', {
        theme: 'colored',
      });
    }
  }, [addStorevendorAPI.error]);
  useEffect(() => {
    if (updateVendorAPI.data) {
      if (
        get(updateVendorAPI, 'data.success') &&
        !isEmpty(get(updateVendorAPI, 'data.data'))
      ) {
        toast.success('Store vendor updated successfully', {
          theme: 'colored',
        });
        navigate('/storevendor-report', { replace: true });
      } else {
        toast.error('Store vendor updation failed', {
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
        setDebit(get(getByIdVendorAPI.data.data, 'debit', []));
      }
    }
  }, [getByIdVendorAPI.data]);
  const onSubmitData = async (data) => {
    const postData = {
      purchaseDate: dates,
      vendorCode: String(data.vendorCode),
      invocieNo: String(data.invocieNo),
      vendorName: String(data.vendorName),
      modeOfPayment: String(data.modeOfPayment),
      debit: debit,
      credit: Number(credit),
      tdsPercentage: Number(tdsPercentage),
      tdsAmount: Number(tdsAmount),
      description: description,
    };
    if (!isEmpty(get(params, 'id'))) {
      delete postData.createdOn;
      delete postData.updatedOn;
      const assetIdString = params.id;
      const debitAmount = postData.debit;
      const debitFinalAmount = debitAmount - credit;
      const updatedData = {
        ...postData,
        id: assetIdString,
        debit: debitFinalAmount,
      };
      updateVendorAPI.request(updatedData, get(user, 'token'));
      // updateImprestholderAPI.request(postData, get(user, 'token'));
    } else {
      addStorevendorAPI.request(postData, get(user, 'token'));
    }
  };
  const handlePercentageChange = (e) => {
    setTdsPercentage(e.target.value);
    const tdsPer = e.target.value;
    const tdsAmount = (Number(tdsPer) / 100) * Number(credit);
    const roundAmount = Math.round(tdsAmount);
    const finalAmount = credit - roundAmount;
    //setCredit(finalAmount);
    setGrantTotal(finalAmount);
    setTdsAmount(roundAmount);
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
            <h5 className="mb-0 text-white">Store Vendor Management</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>Date (DD-MM-YYYY)</label>
              <input
                label="Date (DD-MM-YYYY)"
                name="date"
                type="date"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="form-control"
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Invoice No"
                name="invocieNo"
                type="String"
                readOnly
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('invocieNo', {
                    required: 'This field is required',
                  }),
                  readOnly: true,
                }}
              />
            </Col>
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
                  readOnly: true,
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Vendor Code"
                name="vendorCode"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('vendorCode', {
                    required: 'This field is required',
                  }),
                  readOnly: true,
                }}
              />
            </Col>
            <Col md={6}>
              <label>Debit (Rs.)</label>
              <input
                label="Debit (Rs.)"
                name="debit"
                type="number"
                value={debit}
                className="form-control"
                readOnly
                onChange={(e) => setDebit(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                type="select"
                label="Payment Mode"
                name="modeOfPayment"
                placeholder="Select your paymentMode..."
                errors
                options={paymentMode}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('modeOfPayment'),
                }}
              />
            </Col>
            <Col md={6}>
              <label>Credit (Rs.)</label>
              <input
                label="Credit (Rs.)"
                name="credit"
                type="number"
                className="form-control"
                value={credit}
                // readOnly
                onChange={(e) => setCredit(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <label>TDS Percentage</label>
              <input
                label="TDS Percentage"
                name="tdsPercentage"
                type="String"
                className="form-control"
                value={tdsPercentage}
                onChange={handlePercentageChange}
              />
            </Col>
            <Col md={6}>
              <label>TDS Amount</label>
              <input
                label="TDS Amount"
                name="tdsamount"
                type="String"
                className="form-control"
                value={tdsAmount}
                readOnly
              />
            </Col>
            <Col md={6}>
              <label>Grant Total</label>
              <input
                label="Grant Total"
                name="grantTotal"
                type="String"
                className="form-control"
                value={grantTotal}
                onChange={(e) => setGrantTotal(e.target.value)}
                readOnly
              />
            </Col>
            <Col md={6}>
              <label>Description</label>
              <input
                label="description"
                name="description"
                type="string"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {addStorevendorAPI.loading && (
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

export default StoreVendorPaymentManagement;
