/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import ImprestHolderTransactionAPI from 'api/Imprestholdertransaction';
import vendorAPI from 'api/vendor';
import { UserOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { get, isEmpty, find } from 'lodash';
import WizardInput from '../wizard/WizardInput';
import employeeAPI from 'api/getEmployeeDetails';
import { Input, Select, Typography } from 'antd';
import expensesApi from 'api/expenses';
import {
  getErrorMessage,
  getMonthNamesNew,
  monthNames,
  normalizeMonth,
  getCurrandPrevMonth,
  checkEmptyfield, showEmptyVarsToast
} from 'helpers/utils';
import { useParams } from 'react-router-dom';

const AccountsTransaction = ({ validation }) => {
  const params = useParams();
  const [expenses, setExpenses] = useState([]);
  const { Title } = Typography;
  const AddImprestHolderTransactionAPI = useAPI(
    ImprestHolderTransactionAPI.AddImprestHolderTransaction,
  );
  const getByImprestHolderId = useAPI(
    ImprestHolderTransactionAPI.getSubTransdetails,
  );
  const updateImprestHolder = useAPI(
    ImprestHolderTransactionAPI.updateSubTransdetails,
  );

  const [currentMonth, setCurrentMonth] = useState('');
  const [bankName, setBankName] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
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
  const [employeeId, setEmployeeId] = useState(0);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeBankDetails, setEmployeeBankDetails] = useState({});
  const [roomCode, setRoomCode] = useState('');
  const [dates, setDates] = useState();
  const [showTextBox, setShowTextBox] = useState(false);
  const [showTextBox1, setShowTextBox1] = useState(false);
  const [showTextBox2, setShowTextBox2] = useState(false);
  const [showTextBox3, setShowTextBox3] = useState(false);
  const [showTextBox4, setShowTextBox4] = useState(false);
  const [showTextBox5, setShowTextBox5] = useState(false);
  const [showTextBox6, setShowTextBox6] = useState(false);
  const [showTextBox7, setShowTextBox7] = useState(true);
  const [showTextBox8, setShowTextBox8] = useState(false);
  const [vendorName, setVendorName] = useState();
  const [adMonthOptions, setAdMonthOptions] = useState([]);
  const [type, setType] = useState();
  const [expensesType, setExpensesType] = useState('');
  const [vendor, setVendor] = useState([]);
  const [vendorCode, setVendorCode] = useState('');
  const [tdsPercentage, setTdsPercentage] = useState(0);
  const [tdsAmount, setTdsAmount] = useState(0);
  const [grantTotal, setGrantTotal] = useState(0);
  const { register, handleSubmit, clearErrors, setValue, watch, reset } =
    useForm();

  const onError = () => {
    if (!validation) {
      clearErrors();
    }
  };

  const [transactionType] = useState([
    'ADVANCES',
    'EXPENSES',
    'IMPREST_TO',
    'HANDLOAN_REPAYMENT',
    'VENDOR_PAYMENT',
    'SALARY_PAID',
    'GST',
    'ESI',
    'PF',
    'LOAN_EMI',
    'OUTSTANDING',
    'INVESTMENT',
    'OD_RETURN',
    'BANK_CLOSING_BALANCE',
  ]);
  const [creditType] = useState([
    'SALARY_RETURN',
    'IT_RETURN',
    'BANK_RETURN',
    'CLIENT_RECEIPTS',
    'HANDLOAN_RECEIPTS',
    'OD_RECEIPT',
  ]);

  const [source, setSource] = useState();
  const payType = watch('payType');
  const debit = watch('debit');

  const handleChangeSiteId = (value, option) => {
    // const selectedOption = siteIdsOptions.find(
    //   (option) => option.value === value,
    // );
    setCurrentSiteId(option);
    // const units = get(selectedOption, 'label');
    // setUnitCodeWithName(units);
  };

  const handleVendorChange = (e) => {
    setVendorCode(e.target.value);
    const selectedVendor = find(vendor, { vendorCode: e.target.value });
    const vendorName = selectedVendor ? selectedVendor.vendorName : '';
    setVendorName(vendorName);
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
      setShowTextBox4(false);
      // setUnitCodeWithName('');
      setRoomCode('');
      setCurrentSiteId('');
      setVendorName('');
      setVendorCode('');
    } else if (e.target.value === 'Unit Code') {
      setShowTextBox1(true);
      setShowTextBox(false);
      setShowTextBox2(false);
      setShowTextBox4(false);
      setEmployeeId('');
      setEmployeeName('');
      setRoomCode('');
      setVendorName('');
      setVendorCode('');
    } else if (e.target.value === 'Room Code') {
      setShowTextBox2(true);
      setShowTextBox1(false);
      setShowTextBox(false);
      setShowTextBox4(false);
      setEmployeeId('');
      setEmployeeName('');
      setCurrentSiteId('');
      setVendorName('');
      setVendorCode('');
      // setUnitCodeWithName('');
    } else if (e.target.value === 'Vendor Code') {
      setShowTextBox4(true);
      setShowTextBox2(false);
      setShowTextBox1(false);
      setShowTextBox(false);
      setEmployeeId('');
      setEmployeeName('');
      setCurrentSiteId('');
      // setUnitCodeWithName('');
    }
  };
  const onSearch = (value) => {
    if (value) {
      getEmployeeAPI.request(value);
    }
  };
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

  const { Search } = Input;
  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };
  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
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
        const items = get(getEmployeeAPI, 'data.data.items', []);
        const bankDetails =
          items.length > 0 && typeof items[0].bankDetails === 'object'
            ? items[0].bankDetails
            : {};
        setEmployeeBankDetails(bankDetails);
        console.log(bankDetails);
      } else {
        toast.error('Employee not found!', {
          theme: 'colored',
        });
        setEmployeeName('');
        setEmployeeBankDetails({});
      }
    }
  }, [getEmployeeAPI.data]);

  useEffect(() => {
    if (getEmployeeAPI.error) {
      toast.error(`Something went wrong please try again`, {
        theme: 'colored',
      });
    }
  }, [getEmployeeAPI.error]);
  useEffect(() => {
    if (source == 'Emplyee ID') {
      // setUnitCodeWithName('');
      setRoomCode('');
      setCurrentSiteId('');
    } else if (source == 'Unit Code') {
      setEmployeeId('');
      setEmployeeName('');
    }
  }, [currentSiteId, employeeName]);
  const onSubmitData = async (data) => {
    if (!dates || !payType) {
      toast.error(`Please enter all the data!`, {
        theme: 'colored',
      });
      return;
    }
    else if (payType === 'ADVANCES') {
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
      payType === 'SALARY_PAID' ||
        payType === 'SALARY_RETURN' ||
        payType === 'IT_RETURN' ||
        payType === 'BANK_RETURN' ||
        payType === 'CLIENT_RECEIPTS' ||
        payType === 'GST' ||
        payType === 'ESI' ||
        payType === 'HANDLOAN_REPAYMENT' ||
        payType === 'VENDOR_PAYMENT' ||
        payType === 'OD_RETURN' ||
        payType === 'BANK_CLOSING_BALANCE' ||
        payType === 'PF'
        ? monthNames[currentMonth].label
        : '';
    const datas = localStorage.getItem('user');
    const userData = JSON.parse(datas);
    const employeeNumber = userData.employeeId;
    const postData = {
      date: String(dates),
      imprestholderId: 0,
      imprestholderName: '',
      bankName: String(bankName),
      employeeID: Number(employeeId),
      employeeName: String(employeeName),
      unitCodeWithName: get(currentSiteId, 'label', ''),
      unitName: get(currentSiteId, 'value', ''),
      createType: String('ACCOUNTS'),
      roomCode: String(roomCode),
      debit: Number(data.debit),
      payType: String(data.payType),
      explanation: String(data.explanation),
      credit: Number(data.credit),
      createdBy: Number(employeeNumber),
      vendorCode: vendorCode,
      vendorName: vendorName,
      transactionType: String(type),
      expensesType: expensesType,
      advanceMonth: data.advanceMonth,
      month:
        payType === 'SALARY_PAID' ||
          payType === 'SALARY_RETURN' ||
          payType === 'IT_RETURN' ||
          payType === 'BANK_RETURN' ||
          payType === 'CLIENT_RECEIPTS' ||
          payType === 'GST' ||
          payType === 'ESI' ||
          payType === 'HANDLOAN_REPAYMENT' ||
          payType === 'VENDOR_PAYMENT' ||
          payType === 'OD_RETURN' ||
          payType === 'BANK_CLOSING_BALANCE' ||
          payType === 'PF'
          ? `${currentMonthName}-${currentYear}`
          : '',
      modeOfPayment: data.modeOfPayment,
      tdsPercentage: Number(tdsPercentage),
      tdsAmount: tdsAmount,
      isVerified: 'APPROVED',
      bankDetails: employeeBankDetails,
    };
    if (!isEmpty(get(params, 'id'))) {
      delete postData.createdOn;
      delete postData.updatedOn;
      const Ids = params.id;
      const updatedData = { ...postData, id: Ids };
      await updateImprestHolder.request(updatedData);
    } else {
      const updatedData = { ...postData, createType: 'ACCOUNTS' };
      await AddImprestHolderTransactionAPI.request(updatedData);
    }
  };
  useEffect(() => {
    if (updateImprestHolder.data) {
      if (
        get(updateImprestHolder, 'data.success') &&
        !isEmpty(get(updateImprestHolder, 'data.data'))
      ) {
        toast.success(`Accounts Transaction Updated successfully!`, {
          theme: 'colored',
        });
      } else {
        toast.error(`Accounts Transaction Updated failed`, {
          theme: 'colored',
        });
      }
    }
  }, [updateImprestHolder.data]);
  useEffect(() => {
    if (
      get(AddImprestHolderTransactionAPI, 'data.success') &&
      !isEmpty(get(AddImprestHolderTransactionAPI, 'data.data'))
    ) {
      toast.success(`Accounts Transaction Created successfully!`, {
        theme: 'colored',
      });
      handleAllDataClear();
    }
    if (get(AddImprestHolderTransactionAPI, 'data.success') === false) {
      toast.error(get(AddImprestHolderTransactionAPI, 'data.message'), {
        theme: 'colored',
      });
    }
  }, [AddImprestHolderTransactionAPI.data]);

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getByImprestHolderId.request(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if (getByImprestHolderId.data) {
      if (!isEmpty(get(params, 'id'))) {
        reset(getByImprestHolderId.data.data);
        const selecteDate = get(getByImprestHolderId, 'data.data.date', []);
        const inputDate = new Date(selecteDate);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();
        const formattedDateString = `${year}-${month}-${day}`;
        setDates(formattedDateString);
        setEmployeeId(get(getByImprestHolderId, 'data.data.employeeID', 0));
        setCurrentSiteId(get(getByImprestHolderId, 'data.data.unitName', ''));
        if (get(getByImprestHolderId, 'data.data.employeeID', 0)) {
          setSource('Emplyee ID');
          setShowTextBox(true);
        } else if (get(getByImprestHolderId, 'data.data.unitName', '')) {
          setSource('Unit Code');
          setShowTextBox1(true);
        } else if (get(getByImprestHolderId, 'data.data.roomCode', '')) {
          setSource('Room Code');
          setShowTextBox2(true);
        } else if (get(getByImprestHolderId, 'data.data.vendorCode', '')) {
          setSource('Vendor Code');
          setShowTextBox4(true);
        }
        setEmployeeName(
          get(getByImprestHolderId, 'data.data.employeeName', ''),
        );
        setType(get(getByImprestHolderId, 'data.data.payType', ''));
        setType(get(getByImprestHolderId, 'data.data.transactionType', ''));
        setShowTextBox3(true);
        setShowTextBox5(
          get(getByImprestHolderId, 'data.data.transactionType', '') ===
          'DEBIT',
        );
        setShowTextBox7(
          get(getByImprestHolderId, 'data.data.transactionType', '') ===
          'DEBIT',
        );
        setShowTextBox6(
          get(getByImprestHolderId, 'data.data.transactionType', '') ===
          'CREDIT',
        );
        setShowTextBox8(
          get(getByImprestHolderId, 'data.data.transactionType', '') ===
          'CREDIT',
        );

        // setUnitCodeWithName(
        //   get(getByImprestHolderId, 'data.data.unitCodeWithName', ''),
        // );
        setRoomCode(get(getByImprestHolderId, 'data.data.roomCode', ''));
        setBankName(get(getByImprestHolderId, 'data.data.bankName', ''));
        setVendorCode(get(getByImprestHolderId, 'data.data.vendorCode', ''));
        setVendorName(get(getByImprestHolderId, 'data.data.vendorName', ''));
        setExpensesType(
          get(getByImprestHolderId, 'data.data.expensesType', ''),
        );
        setTdsPercentage(
          get(getByImprestHolderId, 'data.data.tdsPercentage', ''),
        );
        const months = get(getByImprestHolderId, 'data.data.month', '').split(
          '-',
        );
        setCurrentMonth(normalizeMonth(months[0]));
        setCurrentYear(months[1]);
        setTdsAmount(get(getByImprestHolderId, 'data.data.tdsAmount', ''));
      }
    }
  }, [getByImprestHolderId.data]);

  useEffect(() => {
    if (AddImprestHolderTransactionAPI.error) {
      toast.error(`Accounts Transaction Creation failed!`, {
        theme: 'colored',
      });
    }
  }, [AddImprestHolderTransactionAPI.error]);
  const handleAllDataClear = (e) => {
    setValue('credit', 0);
    setValue('debit', 0);
    setValue('payType', '');
    setValue('explanation', '');
    setValue('description', '');
    setEmployeeId(0);
    setEmployeeName('');
    setRoomCode('');
    // setUnitCodeWithName('');
    setVendorName('');
    setCurrentSiteId('');
  };

  const handleTypeChanges = (e) => {
    setType(e.target.value);
    if (e.target.value === 'DEBIT') {
      setShowTextBox3(true);
      setShowTextBox5(true);
      setShowTextBox6(false);
      setShowTextBox7(true);
      setShowTextBox8(false);
    } else if (e.target.value === 'CREDIT') {
      setShowTextBox3(true);
      setShowTextBox5(false);
      setShowTextBox6(true);
      setShowTextBox7(false);
      setShowTextBox8(true);
    } else {
      setShowTextBox5(false);
      setShowTextBox6(false);
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

  // const expensesForOptions = [];
  // const roles = expenses ? expenses : [];
  // roles.map((item) => {
  //   expensesForOptions.push({
  //     value: item,
  //     label: item,
  //   });
  // });

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
  const bankOptions = [
    {
      value: 'UB',
      label: 'UB',
    },
    {
      value: 'CUB',
      label: 'CUB',
    },
    {
      value: 'ICICI',
      label: 'ICICI',
    },
  ];
  const handleChangeMonth = (value) => {
    const currentMonthName = monthNames[value].value;
    setCurrentMonth(currentMonthName);
  };

  const handleChangeYear = (value) => {
    setCurrentYear(value);
  };
  const handleBank = (value) => {
    setBankName(value);
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

  useEffect(() => {
    if (payType === 'EXPENSES' || payType === 'DIRECT_EXPENSES') {
      setTdsPercentage(0);
      setTdsAmount(0);
    } else if (payType === 'VENDOR_PAYMENT') {
      setExpensesType(' ');
    } else if (
      payType === 'ADVANCES' ||
      payType === 'IMPREST_TO' ||
      payType === 'HANDLOAN_REPAYMENT'
    ) {
      setExpensesType(' ');
      setTdsPercentage(0);
      setTdsAmount(0);
    }
  }, [payType]);

  const showMonthSelector = [
    'SALARY_PAID',
    'HANDLOAN_REPAYMENT',
    'VENDOR_PAYMENT',
    'OD_RETURN',
    'SALARY_RETURN',
    'IT_RETURN',
    'BANK_RETURN',
    'CLIENT_RECEIPTS',
    'GST',
    'ESI',
    'BANK_CLOSING_BALANCE',
    'PF',
  ].includes(payType);

  if (payType === 'ADVANCES' && adMonthOptions.length === 0) {
    setAdMonthOptions(getCurrandPrevMonth());
  }

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData, onError)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Accounts Credit</h5>
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
            <Col md="6">
              <label>Debit/Credit</label>
              <select
                name="source"
                value={type}
                onChange={handleTypeChanges}
                className="form-select"
              >
                <option value="">Select your option...</option>
                <option value="DEBIT">DEBIT</option>
                <option value="CREDIT">CREDIT</option>
              </select>
            </Col>
            {showTextBox5 && (
              <Col md={6}>
                <WizardInput
                  type="select"
                  label="Transaction Type"
                  name="payType"
                  placeholder="Select Transaction Type:"
                  errors
                  options={transactionType}
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('payType'),
                    // onChange: handleChangeTransaction
                  }}
                />
              </Col>
            )}
            {showTextBox6 && (
              <Col md={6}>
                <WizardInput
                  type="select"
                  label="Transaction Type"
                  name="payType"
                  placeholder="Select Transaction Type:"
                  errors
                  options={creditType}
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('payType'),
                  }}
                />
              </Col>
            )}
            {showTextBox7 && (
              <Col md={6}>
                <WizardInput
                  label="Debit (RS.)"
                  placeholder="Please Enter The Debit (Rs.)"
                  name="debit"
                  errors
                  type="Number"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('debit', {
                      required: 'This field is required',
                    }),
                  }}
                />
              </Col>
            )}
            {showTextBox8 && (
              <Col md={6}>
                <WizardInput
                  label="Credit (RS.)"
                  placeholder="Please Enter The Credit (Rs.)"
                  name="credit"
                  errors
                  type="Number"
                  formGroupProps={{ as: Col, sm: 12 }}
                  formControlProps={{
                    ...register('credit', {
                      required: 'This field is required',
                    }),
                  }}
                />
              </Col>
            )}
            {showMonthSelector && (
              <Col md={6}>
                <div className="month-container" style={{ display: 'flex', gap: 16 }}>
                  <Select
                    label="Year"
                    // defaultValue={currentYear}
                    style={{
                      width: 300,
                    }}
                    onChange={handleChangeYear}
                    options={yearOptions}
                  />
                  <Select
                    label="Month"
                    // defaultValue={currentMonth}
                    value={currentMonth}
                    style={{
                      width: 300,
                    }}
                    onChange={handleChangeMonth}
                    options={getMonthNamesNew(currentMonth)}
                  />
                </div>
              </Col>
            )}
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
            {payType === 'BANK_CLOSING_BALANCE' && (
              <Col md={6}>
                <label>Bank Name</label>
                <br />
                <Select
                  showSearch
                  size="large"
                  placeholder="Select a product"
                  optionFilterProp="children"
                  //className="form-control"
                  onChange={handleBank}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  options={bankOptions}
                  style={{
                    width: 630,
                  }}
                />
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
            {showTextBox3 && payType !== 'BANK_CLOSING_BALANCE' && (
              <Col md="6">
                <label>Source</label>
                <select
                  name="source"
                  value={source}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select your option...</option>
                  {payType === 'GST' ||
                    payType === 'PF' ||
                    payType === 'ESI' ||
                    payType === 'LOAN_EMI' ? (
                    <option value="Unit Code">Unit Code</option>
                  ) : (
                    <>
                      <option value="Emplyee ID">Employee ID</option>
                      <option value="Unit Code">Unit Code</option>
                      <option value="Room Code">Room Code</option>
                      <option value="Vendor Code">Vendor Code</option>
                    </>
                  )}
                </select>
              </Col>
            )}
            {showTextBox && showTextBox3 && (
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
                />
              </Col>
            )}
            {showTextBox && showTextBox3 && (
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
                />
              </Col>
            )}
            {showTextBox2 && showTextBox3 && (
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
            {(showTextBox1 && showTextBox3) || showTextBox4 ? (
              <Col md={6}>
                <label>Unit Code</label>
                <Select
                  defaultValue={currentSiteId}
                  value={currentSiteId}
                  showSearch
                  placeholder="Select a Unit code"
                  optionFilterProp="children"
                  onChange={handleChangeSiteId}
                  // onSearch={onSearch}
                  filterOption={filterOption}
                  options={siteIdsOptions}
                  size="large"
                  style={{ width: '100%' }}
                />
              </Col>
            ) : null}
            {showTextBox4 && (
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
                  {vendor.map((vendor) => (
                    <option key={vendor.vendorName} value={vendor.vendorCode}>
                      {vendor.vendorName}
                    </option>
                  ))}
                </select>
              </Col>
            )}
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
              </>
            )}
            {/* <Col md={6}>
                  <label>TDS Amount</label>
                  <input
                    label="TDS Amount"
                    name="tdsamount"
                    type="String"
                    className="form-control"
                    value={tdsAmount}
                    readOnly
                  />
                </Col> */}
            {payType === 'VENDOR_PAYMENT' && (
              <>
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
            {(payType === 'VENDOR_PAYMENT' ||
              payType === 'CLIENT_RECEIPTS') && (
                <Col md={6}>
                  <label>TDS Amount</label>
                  <input
                    label="TDS Amount"
                    name="tdsamount"
                    type="String"
                    className="form-control"
                    value={tdsAmount}
                  />
                </Col>
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

export default AccountsTransaction;
