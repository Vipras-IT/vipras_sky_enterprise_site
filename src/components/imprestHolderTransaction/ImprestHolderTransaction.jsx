/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import ImprestHolderTransactionAPI from 'api/Imprestholdertransaction';
import { UserOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import vendorAPI from 'api/vendor';
import WizardInput from '../wizard/WizardInput';
import employeeAPI from 'api/getEmployeeDetails';
import { Input, Select, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import expensesApi from 'api/expenses';
import { getErrorMessage, getMonthNamesNew, monthNames, getCurrandPrevMonth, checkEmptyfield, showEmptyVarsToast } from 'helpers/utils';

const ImprestHolderTransaction = ({ validation }) => {
  const todayDate = new Date();
  const formatDate = (date) => date.toISOString().split('T')[0];
  const maxDate = formatDate(todayDate);
  const minDate = formatDate(new Date(todayDate.setDate(todayDate.getDate() - 30)));

  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { Title } = Typography;
  const AddImprestHolderTransactionAPI = useAPI(
    ImprestHolderTransactionAPI.AddImprestHolderTransaction,
  );
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [expenses, setExpenses] = useState([]);
  const getSubAPI = useAPI(ImprestHolderTransactionAPI.getSubTransdetails);
  const updateSubAPI = useAPI(
    ImprestHolderTransactionAPI.updateSubTransdetails,
  );
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const siteIdsOptions = [];
  const [paymentMode] = useState(['Gpay', 'NEFT', 'Cheque', 'RTGS', 'Cash']);
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const [currentSiteId, setCurrentSiteId] = useState();
  const getEmployeeAPI = useAPI(employeeAPI.getEmployeeByEmployeeNumber);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  // const [unitNames, setUnitNames] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [dates, setDates] = useState(maxDate);
  const [showTextBox, setShowTextBox] = useState(false);
  const [showTextBox1, setShowTextBox1] = useState(false);
  const [showTextBox2, setShowTextBox2] = useState(false);
  const [showTextBox3, setShowTextBox3] = useState(false);
  const [expensesType, setExpensesType] = useState('');
  const { register, handleSubmit, clearErrors, reset, watch } = useForm();
  const [tdsPercentage, setTdsPercentage] = useState(0);
  const [tdsAmount, setTdsAmount] = useState(0);
  const [grantTotal, setGrantTotal] = useState(0);
  const [vendorName, setVendorName] = useState('');
  const [vendorCode, setVendorCode] = useState('');
  const [vendor, setVendor] = useState([]);
  const [adMonthOptions, setAdMonthOptions] = useState([]);
  const payType = watch('payType');
  const debit = watch('debit');
  const onError = () => {
    if (!validation) {
      clearErrors();
    }
  };
  const handlePercentageChange = (e) => {
    setTdsPercentage(e.target.value);
  };
  useEffect(() => {
    if (tdsPercentage) {
      const tdsAmount = (Number(tdsPercentage) / 100) * Number(debit);
      const roundAmount = Math.round(tdsAmount);
      const finalAmount = Number(debit) - roundAmount;
      setGrantTotal(finalAmount);
      setTdsAmount(roundAmount);
    }
  }, [tdsPercentage]);
  const [transactionType] = useState([
    'ADVANCES',
    'EXPENSES',
    'IMPREST_TO',
    'SALARY_PAID',
    'VENDOR_PAYMENT',
    'HANDLOAN_REPAYMENT'

  ]);
  const [source, setSource] = useState();

  const handleChangeSiteId = (value, option) => {
    setCurrentSiteId(option);
  };

  const handleChangeExpensessType = (value) => {
    setExpensesType(value);
  };

  const handleChange = (e) => {
    setSource(e.target.value);
    if (e.target.value === 'Emplyee ID') {
      setShowTextBox(true);
      setShowTextBox1(false);
      setShowTextBox2(false);
      setShowTextBox3(false);
      setRoomCode('');
      setCurrentSiteId('');
      setVendorName('');
      setVendorCode('');
    } else if (e.target.value === 'Unit Code') {
      setShowTextBox1(true);
      setShowTextBox(false);
      setShowTextBox2(false);
      setShowTextBox3(false);
      setEmployeeId('');
      setEmployeeName('');
      setRoomCode('');
      setVendorName('');
      setVendorCode('');
    } else if (e.target.value === 'Room Code') {
      setShowTextBox2(true);
      setShowTextBox1(false);
      setShowTextBox(false);
      setShowTextBox3(false);
      setEmployeeId('');
      setEmployeeName('');
      setCurrentSiteId('');
      setVendorName('');
      setVendorCode('');
    } else if (e.target.value === 'Vendor Code') {
      setShowTextBox1(false);
      setShowTextBox3(true);
      setShowTextBox2(false);
      setShowTextBox(false);
      setEmployeeId('');
      setEmployeeName('');
    }
  };

  const onSearch = (value) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.employeeId == value && payType === 'IMPREST_TO') {
      toast.error('You cannot search for your own employee ID!', {
        theme: 'colored',
      });
      return;
    } else if (value) {
      getEmployeeAPI.request(value);
    }
  };
  const { Search } = Input;
  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };
  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getSubAPI.request(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if (getSubAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        reset(getSubAPI.data.data);
        const selecteDate = get(getSubAPI.data.data, 'date', []);
        const inputDate = new Date(selecteDate);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();
        const formattedDateString = `${year}-${month}-${day}`;
        setDates(formattedDateString);
        if (get(getSubAPI.data.data, 'employeeID', 0)) {
          setShowTextBox(true);
          setSource('Emplyee ID');
          setEmployeeId(get(getSubAPI.data.data, 'employeeID', 0));
          setEmployeeName(get(getSubAPI.data.data, 'employeeName', ''));
        } else if (get(getSubAPI.data.data, 'unitCodeWithName', '')) {
          setSource('Unit Code');
          setShowTextBox1(true);
          setCurrentSiteId(get(getSubAPI.data.data, 'unitCodeWithName', ''));
        } else if (get(getSubAPI.data.data, 'roomCode', '')) {
          setSource('Room Code');
          setShowTextBox2(true);
          setRoomCode(get(getSubAPI.data.data, 'roomCode', ' '));
        } else if (get(getSubAPI.data.data, 'vendorCode', '')) {
          setSource('Vendor Code');
          setShowTextBox3(true);
          setShowTextBox1(true);
          setVendorCode(get(getSubAPI.data.data, 'vendorCode', ' '));
          setVendorName(get(getSubAPI.data.data, 'vendorName', ' '));
          setCurrentSiteId(get(getSubAPI.data.data, 'unitCodeWithName', ''));
          setTdsPercentage(get(getSubAPI.data.data, 'tdsPercentage', 0));
          setTdsAmount(get(getSubAPI.data.data, 'tdsAmount', 0));
        }
      }
    }
  }, [getSubAPI.data]);

  useEffect(() => {
    if (updateSubAPI.data) {
      if (
        get(updateSubAPI, 'data.success') &&
        !isEmpty(get(updateSubAPI, 'data.data'))
      ) {
        toast.success('Imprest Transaction  Updated successfully!', {
          theme: 'colored',
        });
        navigate('/impress-list', { replace: true });
      } else {
        console.log(updateSubAPI.message);

        toast.error('Imprest Transaction updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateSubAPI.data]);

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
    if (source == 'Emplyee ID') {
      // setUnitNames('');
      setRoomCode('');
      setCurrentSiteId('');
    } else if (source == 'Unit Code') {
      setEmployeeId('');
      setEmployeeName('');
    } else if (source == 'Vendor Code') {
      setEmployeeId('');
      setEmployeeName('');
      // setUnitNames('');
      setRoomCode('');
      setCurrentSiteId(' ');
    } else {
      console.log();
    }
  }, [currentSiteId, employeeName]);

  const onSubmitData = async (data) => {

    if (!dates || !payType) {
      toast.error('Please enter all the data!', {
        theme: 'colored',
      });
      return;
    } else if (payType === 'ADVANCES') {
      let emptyVars = [];
      const month = data.advanceMonth ? data.advanceMonth : '';
      emptyVars = checkEmptyfield({ month, debit, source });
      if (['month', 'debit', 'source'].some(item => emptyVars.includes(item))) {
        showEmptyVarsToast(emptyVars);
        return;
      } else {
        emptyVars = checkEmptyfield({ employeeId, employeeName });
        if (emptyVars.length > 0) {
          showEmptyVarsToast(emptyVars);
          return;
        }
      }
    }

    if (String(data.payType) === 'EXPENSES' && source !== 'Unit Code') {
      toast.error('Error: SiteId is missing when payType is EXPENSES!', {
        theme: 'colored',
      });
      return;
    }


    const selectedDate = new Date(dates);
    const selectedMonth = selectedDate.getMonth();
    const currentMonthName =
      payType === 'SALARY_PAID' || payType === 'HANDLOAN_REPAYMENT'
        ? monthNames[currentMonth].label
        : monthNames[selectedMonth].label;

    const datas = localStorage.getItem('user');
    const userData = JSON.parse(datas);
    const firstname = userData.fullName;
    const employeeNumber = userData.employeeId;
    const createType = 'IMPREST';
    const postData = {
      date: String(dates),
      imprestholderId: Number(employeeNumber),
      imprestholderName: String(firstname),
      employeeID: Number(employeeId),
      employeeName: String(employeeName),
      unitCodeWithName: String(currentSiteId?.label || ''),
      unitName: String(currentSiteId?.value || ''),
      roomCode: String(roomCode),
      debit: Number(data.debit),
      payType: String(data.payType),
      explanation: String(data.explanation),
      credit: Number(0),
      description: String(data.description),
      createType: String(createType),
      transactionType: 'DEBIT',
      createdBy: Number(employeeNumber),
      expensesType: expensesType,
      advanceMonth: data.advanceMonth,
      month:
        payType === 'SALARY_PAID' || payType === 'HANDLOAN_REPAYMENT'
          ? `${currentMonthName}-${currentYear}`
          : '',

      isVerified: 'PENDING',
      vendorCode: String(vendorCode),
      vendorName: String(vendorName),
      modeOfPayment: data.modeOfPayment,
      tdsPercentage: Number(tdsPercentage),
      tdsAmount: tdsAmount,
    };
    if (!isEmpty(get(params, 'id'))) {
      delete postData.createdOn;
      delete postData.updatedOn;
      const subIds = params.id;
      const updatedData = { ...postData, id: subIds };
      updateSubAPI.request(updatedData);
    } else {
      await AddImprestHolderTransactionAPI.request(
        postData
      );
    }
  };

  useEffect(() => {
    if (
      get(AddImprestHolderTransactionAPI, 'data.success') &&
      !isEmpty(get(AddImprestHolderTransactionAPI, 'data.data'))
    ) {
      toast.success('Imprest Transaction Created successfully!', {
        theme: 'colored',
      });
      if (user.access.includes('IMPREST_HOLDER')) {
        navigate('/impress-list', { replace: true });
      } else {
        navigate('/imprestholder-transaction-list', { replace: true });
      }
    }
    if (get(AddImprestHolderTransactionAPI, 'data.success') === false) {
      toast.error(get(AddImprestHolderTransactionAPI, 'data.message'), {
        theme: 'colored',
      });
    }
  }, [AddImprestHolderTransactionAPI.data]);

  useEffect(() => {
    if (AddImprestHolderTransactionAPI.error) {
      toast.error('Imprest Transaction Creation failed!', {
        theme: 'colored',
      });
    }
  }, [AddImprestHolderTransactionAPI.error]);

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
  useEffect(() => {
    vendorAPI
      .getVentorNameDetails()
      .then((response) => {
        setVendor(get(response, 'data.data.items', []));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleVendorChange = (e) => {
    const newVendorCode = e.target.value;
    const selectedVendor = vendor.find((v) => v.vendorCode === newVendorCode);
    const newName = selectedVendor ? selectedVendor.vendorName : '';
    setVendorCode(newVendorCode);
    setVendorName(newName);
  };

  const yearOptions = [
    {
      value: 2023,
      label: '2023',
    },
    {
      value: 2024,
      label: '2024',
    },
    {
      value: 2025,
      label: '2025',
    },
    {
      value: 2026,
      label: '2026',
    },
  ];
  const handleChangeMonth = (value) => {
    const currentMonthName = monthNames[value].value;
    setCurrentMonth(currentMonthName);
  };

  const handleChangeYear = (value) => {
    setCurrentYear(value);
  };


  if(payType === 'ADVANCES' && adMonthOptions.length === 0) {
    setAdMonthOptions (getCurrandPrevMonth());
  }
  const getmonthdata = (event) => {
    console.log('Selected Transaction Type:');

    // Add your logic here to fetch or update based on the selected value
  };

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData, onError)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add Imprest Transaction</h5>
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
                max={maxDate}
                min={minDate}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                type="select"
                label="Transaction Type"
                name="payType"
                placeholder="Select Transaction Type:"
                errors
                options={transactionType}
                formGroupProps={{ as: Col, sm: 12 }}
                onChange={getmonthdata}
                    // onChange={(e) => getmonthdata(e.target.value)}
                formControlProps={{
                  ...register('payType'),
                }}
              />
            </Col>
            {(payType === 'ADVANCES') && (
              <Col md={6}>
                <WizardInput
                  type="select"
                  label="Advance Month"
                  name="month"
                  placeholder="Select Advance Month:"
                  errors
                  options={adMonthOptions}
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('advanceMonth'),
                  }}
                />
              </Col>
            )}
            <Col md={6}>
              <WizardInput
                label="Debit (Rs.)"
                placeholder="Please Enter The Debit (Rs.)"
                name="debit"
                errors
                type="Number"
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('debit'),
                }}
              />
            </Col>
            {(payType === 'SALARY_PAID' || payType === 'HANDLOAN_REPAYMENT') && (
              <Col md={6}>
                <div className="month-container">
                  <Select
                    defaultValue={currentYear}
                    style={{
                      width: 200,
                      marginRight: 10
                    }}
                    onChange={handleChangeYear}
                    options={yearOptions}
                  />
                  <Select
                    defaultValue={currentMonth}
                    value={currentMonth}
                    style={{
                      width: 200,
                    }}
                    onChange={handleChangeMonth}
                    options={getMonthNamesNew(currentMonth)}
                  />
                </div>
              </Col>
            )}
            <Col md={6}>
              <WizardInput
                label="Remarks"
                placeholder="Please Enter The Remarks"
                name="explanation"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('explanation'),
                }}
              />
            </Col>
            <Col md="6">
              <label>Source</label>
              <select
                name="source"
                value={source}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select your option...</option>
                <option value="Emplyee ID">Employee ID</option>
                <option value="Unit Code">Unit Code</option>
                <option value="Room Code">Room Code</option>
                <option value="Vendor Code">Vendor Code</option>
              </select>
            </Col>
            {showTextBox && (
              <Col md="6">
                <label>Employee Id</label>
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
                  required
                />
              </Col>
            )}
            {showTextBox && (
              <Col md="6">
                <label>Employee Name</label>
                <Input
                  name="employeeName"
                  size="large"
                  prefix={<UserOutlined />}
                  value={employeeName}
                  onChange={handleEmployeeNameChange}
                  readOnly
                  formGroupProps={{ as: Col, sm: 6 }}
                  formControlProps={{
                    ...register('employeeName'),
                  }}
                  required
                />
              </Col>
            )}
            {showTextBox2 && (
              <Col md="6">
                <label>Room Code</label>
                <Input
                  type="text"
                  className="form-control"
                  label="Room Code"
                  name="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                />
              </Col>
            )}
            {showTextBox3 && (
              <Col md={6}>
                <label>Vendor Name</label>
                <select
                  name="Sub-Contractor Name"
                  onChange={handleVendorChange}
                  value={vendorCode}
                  className="form-control"
                >
                  <option value="" disabled>
                    Select a Vendor Name
                  </option>
                  {vendor.map((v) => (
                    <option key={v.vendorCode} value={v.vendorCode}>
                      {v.vendorName}
                    </option>
                  ))}
                </select>
              </Col>
            )}
            {(showTextBox3 || showTextBox1) && (
              <Col md={6}>
                <label>Unit Code</label>
                <Select
                  defaultValue={currentSiteId}
                  value={currentSiteId}
                  showSearch
                  placeholder="Select a Unit code"
                  optionFilterProp="children"
                  onChange={handleChangeSiteId}
                  filterOption={filterOption}
                  options={siteIdsOptions}
                  size="large"
                  style={{ width: '100%' }}
                />
              </Col>
            )}
            <Col md={6}>
              <WizardInput
                label="Description"
                placeholder="Please Enter The description"
                name="description"
                errors
                type="String"
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('description'),
                }}
              />
            </Col>
            {payType === 'EXPENSES' && (
              <Col md={6}>
                <Title level={5}>Expenses Type</Title>
                <Select
                  showSearch
                  size="large"
                  optionFilterProp="value"
                  style={{
                    width: '100%',
                  }}
                  formGroupProps={{ as: Col, sm: 12 }}
                  value={expensesType}
                  onChange={handleChangeExpensessType}
                  filterOption={filterOption}
                  options={expenses}
                />
              </Col>
            )}
            {payType === 'VENDOR_PAYMENT' && (
              <>
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
              </>
            )}
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {AddImprestHolderTransactionAPI.loading && (
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

export default ImprestHolderTransaction;
