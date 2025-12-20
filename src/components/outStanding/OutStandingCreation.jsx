/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAPI from 'hooks/useApi';
import SubContractorAPI from 'api/subcontractor';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { Select } from 'antd';
import { useParams } from 'react-router-dom';
import WizardInput from 'components/wizard/WizardInput';

const OutStandingCreation = ({ validation }) => {
  const params = useParams();
  const navigate = useNavigate();
  const AddSubContractorAPI = useAPI(
    SubContractorAPI.AddSubContractorTransaction,
  );
  const getSubAPI = useAPI(SubContractorAPI.getSubTransdetails);
  const updateSubAPI = useAPI(SubContractorAPI.updateSubTransdetails);
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const siteIdsOpt = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOpt.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  const [totalAmount, setTotalAmount] = useState();
  const [unitCode, setUnitcode] = useState();
  const [dates, setDates] = useState();
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    //formState: { errors }
  } = useForm();

  const onError = () => {
    if (!validation) {
      clearErrors();
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const defaultUnit = siteIdsOpt[0].label.split('-');
  const [unitCodes, setunitCodes] = useState(defaultUnit[0]);
  const [unitName, setUnitName] = useState(defaultUnit[1]);
  const handleUnitCodeChange = (value) => {
    const selectedOption = siteIdsOpt.find((option) => option.value === value);
    setunitCodes(value);
    const undef = selectedOption.label.split('-');
    setUnitName(undef[1]);
    setUnitcode(selectedOption);
  };

  const onSubmitData = async (data) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      date: dates,
      unitCode: String(unitCodes),
      unitName: String(unitName),
      invoiceNo: data.invoiceNo,
      totalAmount: Number(totalAmount),
      createdBy: Number(userData.employeeId),
    };
    if (!isEmpty(get(params, 'subId'))) {
      delete postData.createdOn;
      delete postData.updatedOn;
      const subIds = params.subId;
      const updatedData = {
        ...postData,
        id: subIds,
        updatedBy: Number(userData.employeeId),
      };
      updateSubAPI.request(updatedData);
    } else {
      await AddSubContractorAPI.request(postData);
    }
  };
  useEffect(() => {
    if (
      get(AddSubContractorAPI, 'data.success') &&
      !isEmpty(get(AddSubContractorAPI, 'data.data'))
    ) {
      toast.success('Sub Contractor Transaction Created successfully!', {
        theme: 'colored',
      });
      navigate('/subcontractorTransactionList', { replace: true });
    }
  }, [AddSubContractorAPI.data]);

  useEffect(() => {
    if (AddSubContractorAPI.error) {
      toast.error('Sub Contractor Transaction Creation failed!', {
        theme: 'colored',
      });
    }
  }, [AddSubContractorAPI.error]);
  useEffect(() => {
    if (!isEmpty(get(params, 'subId'))) {
      getSubAPI.request(params.subId);
    }
  }, [params.subId]);

  useEffect(() => {
    if (updateSubAPI.data) {
      if (
        get(updateSubAPI, 'data.success') &&
        !isEmpty(get(updateSubAPI, 'data.data'))
      ) {
        toast.success('Sub Contractor Transaction Updated successfully!', {
          theme: 'colored',
        });
        navigate('/subcontractorTransactionList', { replace: true });
      } else {
        toast.error('Sub Contractor Transaction updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateSubAPI.data]);

  useEffect(() => {
    if (getSubAPI.data) {
      if (!isEmpty(get(params, 'subId'))) {
        reset(getSubAPI.data.data);
        const selecteDate = get(getSubAPI.data.data, 'date', []);
        const inputDate = new Date(selecteDate);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();
        const formattedDateString = `${year}-${month}-${day}`;
        setDates(formattedDateString);
        const getunitcode = get(getSubAPI.data.data, 'unitCode', []);
        const getunitname = get(getSubAPI.data.data, 'unitName', []);
        const unit = getunitcode + '-' + getunitname;
        setTotalAmount(get(getSubAPI.data.data, 'totalAmount', []));
        setUnitcode(unit);
      }
    }
  }, [getSubAPI.data]);

  const [outStandingType] = useState(['GST', 'SUB-CONTRACTOR']);

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData, onError)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Out Standing Creation</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md="6">
              <WizardInput
                type="select"
                label="Out Standing Type"
                name="paymentMode"
                placeholder="Select your out standing type..."
                errors
                options={outStandingType}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('paymentMode'),
                }}
              />
            </Col>
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
              <label>Unit Code</label>
              <br />
              <Select
                defaultValue={unitCode}
                value={unitCode}
                showSearch
                placeholder="Select a Unit code"
                optionFilterProp="children"
                onChange={handleUnitCodeChange}
                // onSearch={onSearch}
                filterOption={filterOption}
                options={siteIdsOpt}
                size="large"
                style={{ width: '100%' }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Invoice No"
                placeholder="Please Enter The Invoice No"
                name="invoiceNo"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('invoiceNo'),
                }}
              />
            </Col>
            {/* <Col md="6">
              <label>Total Amount</label>
              <Input
                type="number"
                className="form-control"
                label="Total Amount"
                name="totalAmount"
                value={totalAmount}
                onChange={handleTotalAmount}
              />
            </Col> */}
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {AddSubContractorAPI.loading && (
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

export default OutStandingCreation;
