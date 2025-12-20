/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import SubContractorAPI from 'api/subcontractor';
import { toast } from 'react-toastify';
import { get, isEmpty, toNumber } from 'lodash';
import WizardInput from '../../wizard/WizardInput';
import { Typography, Input, Select } from 'antd';
const { Title } = Typography;
import employeeAPI from 'api/getEmployeeDetails';
import { UserOutlined, HistoryOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const SubContractorTransaction = ({ validation }) => {
  const { user } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const AddSubContractorAPI = useAPI(
    SubContractorAPI.AddSubContractorTransaction,
  );
  const getSubAPI = useAPI(SubContractorAPI.getSubTransdetails);
  const updateSubAPI = useAPI(SubContractorAPI.updateSubTransdetails);
  const getEmployeeAPI = useAPI(employeeAPI.getEmployeeByEmployeeNumber);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
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
  const [receivedAmount, setReceivedAmount] = useState();
  const [receivedDate, setReceivedDate] = useState();
  const [tdsPercentage, SetTdsPercentage] = useState();
  const [tdsAmount, setCTdsAmount] = useState();
  const [otherDeduction, setOtherDeduction] = useState('');
  const [showremarksTextBox, setShowRemarksTextBox] = useState(false);
  const [otherDeductionRemarks, setOtherDeductionRemarks] = useState('');
  const [handOverToMD, setHandOverToMD] = useState('');
  const [imprestByMyself, setImprestByMyself] = useState('');
  const [unitCode, setUnitcode] = useState(get(siteIdsOpt[0], 'value', ''));
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

  const [paymentMode] = useState(['Gpay', 'NEFT', 'Cheque', 'RTGS', 'Cash']);
  const handleTotalAmount = (e) => {
    setTotalAmount(e.target.value);
    tdsPercentageCal(tdsPercentage);
  };

  const handleChangePoDate = (e) => {
    setReceivedDate(e.target.value);
  };

  const handleReceivedAmount = (e) => {
    setReceivedAmount(e.target.value);
  };
  const handletdsPercentage = (e) => {
    SetTdsPercentage(e.target.value);
    tdsPercentageCal(e.target.value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const tdsPercentageCal = (percentage) => {
    const tdsPercentage = percentage;
    const tdsAmount = (Number(tdsPercentage) / 100) * Number(totalAmount);
    const tdsAmounts = Math.round(tdsAmount);
    setCTdsAmount(tdsAmounts);
  };

  const handleDeductionChange = (e) => {
    const value = e.target.value;
    setOtherDeduction(value);
    setShowRemarksTextBox(value.trim() !== '');
  };
  useEffect(() => {
    tdsPercentageCal(tdsPercentage);
    //setCTdsAmount(per_tds);
    Calculation();
  }, [tdsPercentageCal, tdsPercentage]);

  const handleDeductionRemarksChange = (e) => {
    setOtherDeductionRemarks(e.target.value);
  };
  const handlehandOverToMDChange = (e) => {
    setHandOverToMD(e.target.value);
    Calculation();
  };
  const Calculation = () => {
    const total_imprest = totalAmount - tdsAmount;
    const total_imprest1 = total_imprest - otherDeduction;
    const total_final = total_imprest1 - handOverToMD;
    setImprestByMyself(total_final);
  };

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
  };
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
  const onSearch = (value) => {
    if (value) {
      getEmployeeAPI.request(value, get(user, 'token'));
    }
  };
  const { Search } = Input;
  useEffect(() => {
    if (getEmployeeAPI.data) {
      if (
        get(getEmployeeAPI, 'data.success') &&
        !isEmpty(get(getEmployeeAPI, 'data.data.items'))
      ) {
        setEmployeeName(
          get(getEmployeeAPI, 'data.data.items[0].employeeName', ''),
        );
        setDesignation(get(getEmployeeAPI, 'data.data.items[0].role', ''));
      } else {
        toast.error('Employee not found!', {
          theme: 'colored',
        });
        setEmployeeName('');
        setDesignation('');
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

  const onSubmitData = async (data) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      date: dates,
      unitCode: String(unitCodes),
      unitName: String(unitName),
      invoiceNo: data.invoiceNo,
      totalAmount: Number(totalAmount),
      employeeIDNumber: toNumber(employeeId),
      employeeName: String(employeeName),
      designation: String(designation),
      paymentMode: String(data.paymentMode),
      tdsPercentage: Number(tdsPercentage),
      tdsAmount: Number(tdsAmount),
      receivedAmount: Number(receivedAmount),
      receivedDate: receivedDate,
      otherDeduction: Number(otherDeduction),
      otherDeductionRemarks: String(otherDeductionRemarks),
      handOverToMD: Number(handOverToMD),
      imprestByMyself: Number(imprestByMyself),
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

      updateSubAPI.request(updatedData, get(user, 'token'));
    } else {
      await AddSubContractorAPI.request(postData, get(user, 'token'));
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
      getSubAPI.request(params.subId, get(user, 'token'));
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

        const selecteDates = get(getSubAPI.data.data, 'receivedDate', '');
        const inputDates = new Date(selecteDates);
        const days = inputDates.getUTCDate().toString().padStart(2, '0');
        const months = (inputDates.getUTCMonth() + 1)
          .toString()
          .padStart(2, '0');
        const years = inputDates.getUTCFullYear();
        const formattedDateStrings = `${years}-${months}-${days}`;

        setReceivedDate(formattedDateStrings);
        const getunitcode = get(getSubAPI.data.data, 'unitCode', '');
        const getunitname = get(getSubAPI.data.data, 'unitName', '');
        const matchingOption = siteIdsOpt.find(
          (option) => option.value === getunitcode,
        );
        setUnitcode(matchingOption ? matchingOption.value : '');
        setunitCodes(getunitcode);
        setUnitName(getunitname);
        setEmployeeId(get(getSubAPI.data.data, 'employeeIDNumber', []));
        setEmployeeName(get(getSubAPI.data.data, 'employeeName', []));
        setDesignation(get(getSubAPI.data.data, 'designation', []));
        setTotalAmount(get(getSubAPI.data.data, 'totalAmount', []));
        SetTdsPercentage(get(getSubAPI.data.data, 'tdsPercentage', []));
        setCTdsAmount(get(getSubAPI.data.data, 'tdsAmount', []));
        setOtherDeduction(get(getSubAPI.data.data, 'otherDeduction', []));
        setOtherDeductionRemarks(
          get(getSubAPI.data.data, 'otherDeductionRemarks', []),
        );
        setReceivedAmount(get(getSubAPI.data.data, 'receivedAmount', []));

        setHandOverToMD(get(getSubAPI.data.data, 'handOverToMD', []));
        setImprestByMyself(get(getSubAPI.data.data, 'imprestByMyself', []));
      }
    }
  }, [getSubAPI.data]);
  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData, onError)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add Sub Contractor Transaction</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md={6}>
              <Title level={5}>SubContractor Id</Title>
              <Search
                name="employeeId"
                size="large"
                placeholder="employee Id"
                value={employeeId}
                onChange={handleEmployeeIdChange}
                onSearch={onSearch}
                enterButton
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('employeeId'),
                }}
              />
            </Col>
            <Col md={6}>
              <Title level={5}>SubContractor Name</Title>
              <Input
                name="employeeName"
                size="large"
                prefix={<UserOutlined />}
                value={employeeName}
                onChange={handleEmployeeNameChange}
                readOnly
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('employeeName'),
                }}
              />
            </Col>
            <Col md={6}>
              <Title level={5}>Designation</Title>
              <Input
                name="designation"
                size="large"
                prefix={<HistoryOutlined />}
                value={designation}
                onChange={handleDesignationChange}
                readOnly
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('designation'),
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
            {/* <Col span={6}>
              <label>UnitCode</label>
              <select
                name="unitCode"
                onChange={handleUnitCodeChange}
                className="form-control"
                value={unitCode}
              >
                <option value="" disabled>
                  Select a Unit Code
                </option>
                {siteIds.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Col> */}
            <Col md={6}>
              <label>Unit Code</label>
              <br />
              <Select
                value={unitCode}
                showSearch
                placeholder="Select a Unit code"
                optionFilterProp="children"
                onChange={handleUnitCodeChange}
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
            <Col md={6}>
              <WizardInput
                type="select"
                label="Payment Mode"
                name="paymentMode"
                placeholder="Select your paymentMode..."
                errors
                options={paymentMode}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('paymentMode'),
                }}
              />
            </Col>
            <Col md="6">
              <label>Total Amount</label>
              <Input
                type="number"
                className="form-control"
                label="Total Amount"
                name="totalAmount"
                value={totalAmount}
                onChange={handleTotalAmount}
              />
            </Col>
            <Col md="6">
              <label>TDS (%)</label>
              <Input
                type="number"
                className="form-control"
                label="TDS (%)"
                name="tdsPercentage"
                value={tdsPercentage}
                onChange={handletdsPercentage}
              />
            </Col>

            <Col md="6">
              <label>Received Amount</label>
              <Input
                type="number"
                className="form-control"
                label="Received Amount"
                name="receivedAmount"
                value={receivedAmount}
                onChange={handleReceivedAmount}
              />
            </Col>
            <Col md="6">
              <label>Received Date (DD/MM/YYYY)</label>
              <input
                label="Date (DD-MM-YYYY)"
                name="date"
                type="date"
                value={receivedDate}
                onChange={handleChangePoDate}
                className="form-control"
              />
            </Col>

            <Col md="6">
              <label>TDS Amount</label>
              <Input type="number" className="form-control" value={tdsAmount} />
            </Col>
            <Col md="6">
              <label>Other Deduction</label>
              <Input
                type="number"
                className="form-control"
                label="Other Deduction"
                name="otherDeduction"
                value={otherDeduction}
                onChange={handleDeductionChange}
              />
            </Col>
            {showremarksTextBox && (
              <Col md="6">
                <label>Other Deduction Remarks</label>
                <Input
                  type="text"
                  className="form-control"
                  label="Other Deduction Remarks"
                  name="otherDeductionRemarks"
                  value={otherDeductionRemarks}
                  onChange={handleDeductionRemarksChange}
                />
              </Col>
            )}
            <Col md="6">
              <label>Cash To Bank</label>
              <Input
                type="number"
                className="form-control"
                label="HandOver To MD"
                name="handOverToMD"
                value={handOverToMD}
                onChange={handlehandOverToMDChange}
              />
            </Col>
            <Col md="6">
              <label>Imprest By Myself</label>
              <Input
                type="number"
                className="form-control"
                value={imprestByMyself}
              />
            </Col>
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

export default SubContractorTransaction;
