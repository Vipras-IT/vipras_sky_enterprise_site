/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import SalesAPI from 'api/deduction';
import { toast } from 'react-toastify';
import { get, isEmpty, toNumber } from 'lodash';
import { settings } from 'config/Config';
import ProductTable from 'components/Registration/Sales/ProductTable';
import WizardInput from 'components/wizard/WizardInput';
import { Select, Typography, Input } from 'antd';
import { UserOutlined, HistoryOutlined } from '@ant-design/icons';
import employeeAPI from 'api/getEmployeeDetails';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from 'helpers/utils';
const { Title } = Typography;

const Sale = ({ validation, title, employeeNumber }) => {
  const { user } = useAuth();
  const params = useParams();
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const [showAdvanceAmount, setShowAdvanceAmount] = useState(false);
  const [isMonthlyAdvance, setIsMonthlyAdvance] = useState('NO');
  const [advanceAmount, setAdvanceAmount] = useState(0);

  const siteIdsOpt = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOpt.push({
      value: siteIdArray[0],
      label: item,
    });
  });

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const [currentSiteId, setCurrentSiteId] = useState(
    get(siteIdsOpt[0], 'value', ''),
  );
  const navigate = useNavigate();
  const addSalesAPI = useAPI(SalesAPI.AddSales);
  const updateSalesAPI = useAPI(SalesAPI.updatesalesdetails);
  const getSaleAPI = useAPI(SalesAPI.getSaledetails);
  const MonthTypes = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
  ];
  const [Duration, setDuration] = useState([]);
  const getEmployeeAPI = useAPI(employeeAPI.getEmployeeByEmployeeNumber);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');

  const [tableData, setTableData] = useState([]);
  const [date, setDate] = useState([]);
  const [headerTitle, setHeaderTitle] = useState('Sales Deduction');
  const [productData, setProductData] = useState([]);

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleChangeSiteId = (value) => {
    const selectedOption = siteIdsOpt.find((option) => option.value === value);
    setCurrentSiteId(get(selectedOption, 'label'));
  };

  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
  };
  const onSearch = (value) => {
    if (value) {
      getEmployeeAPI.request(value, get(user, 'token'));
    }
  };
  const { Search } = Input;

  const { register, handleSubmit, reset, clearErrors, setValue } = useForm();

  const calculateTotalAmount = () => {
    let total = 0;

    for (const row of tableData) {
      total += row.amount;
    }

    return total;
  };

  const onSubmitData = () => {
    if (tableData.length > 0 || showAdvanceAmount) {
      const userData = JSON.parse(localStorage.getItem('user'));
      const postData = {
        date: date,
        employeeId: toNumber(employeeId),
        employeeName: String(employeeName),
        products: tableData,
        totalAmount: showAdvanceAmount
          ? Number(advanceAmount)
          : calculateTotalAmount(),
        deductionDuration: Duration,
        isMonthlyAdvance: isMonthlyAdvance,
        designation: designation,
        unitCode: String(currentSiteId),
        createdBy: Number(userData.employeeId),
      };
      if (!isEmpty(get(params, 'saleId'))) {
        delete postData.createdOn;
        delete postData.updatedOn;
        postData.id = get(params, 'saleId');
        updateSalesAPI.request(postData, get(user, 'token'));
      } else {
        addSalesAPI.request(postData, get(user, 'token'));
      }
    } else {
      toast.error('Please add one product', {
        theme: 'colored',
      });
    }
  };
  const onError = () => {
    if (!validation) {
      clearErrors();
    }
  };

  const handleMonthlyAdvanceChanges = (e) => {
    setIsMonthlyAdvance(e.target.value);
    setShowAdvanceAmount(e.target.value === 'YES');
  };

  const handleAdvanceAmountChanges = (e) => {
    setAdvanceAmount(e.target.value);
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
        setDesignation(get(getEmployeeAPI, 'data.data.items[0].role', ''));
      } else {
        toast.error('Employee not found!', {
          theme: 'colored',
        });
        setEmployeeName('');
        setDesignation('');
      }
    }
  }, [getEmployeeAPI.data, employeeId]);

  useEffect(() => {
    if (getEmployeeAPI.error) {
      toast.error('Something went wrong please try again', {
        theme: 'colored',
      });
    }
  }, [getEmployeeAPI.error]);

  useEffect(() => {
    if (
      get(addSalesAPI, 'data.success') &&
      !isEmpty(get(addSalesAPI, 'data.data'))
    ) {
      toast.success('sales added successfully', {
        theme: 'colored',
      });
      handleAllDataClear();
    }
  }, [addSalesAPI.data]);

  const handleAllDataClear = (e) => {
    setValue('advanceAmount', '');
    setEmployeeName('');
    setDesignation('');
    setEmployeeId('');
    setDuration([]);
    setCurrentSiteId('');
    setTableData([]);
  };

  useEffect(() => {
    if (updateSalesAPI.data) {
      if (
        get(updateSalesAPI, 'data.success') &&
        !isEmpty(get(updateSalesAPI, 'data.data'))
      ) {
        toast.success('Sale updated successfully', {
          theme: 'colored',
        });
        navigate('/salesdetails', { replace: true });
      } else {
        toast.error('Sale updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateSalesAPI.data]);

  useEffect(() => {
    if (addSalesAPI.error) {
      toast.error('sales added failed', {
        theme: 'colored',
      });
    }
  }, [addSalesAPI.error]);

  useEffect(() => {
    if (!isEmpty(get(params, 'saleId'))) {
      setHeaderTitle(title);
      getSaleAPI.request(params.saleId, get(user, 'token'));
    }
  }, [params.saleId]);
  useEffect(() => {
    if (title) {
      setEmployeeId(employeeNumber);
      setHeaderTitle(title);
      onSearch(employeeNumber);
    } else {
      setHeaderTitle('Sales Deduction');
    }
  }, []);

  useEffect(() => {
    if (getSaleAPI.data) {
      if (!isEmpty(get(params, 'saleId'))) {
        reset(getSaleAPI.data.data);
        const selecteDate = get(getSaleAPI.data.data, 'date', []);
        const inputDate = new Date(selecteDate);

        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();

        const formattedDateString = `${year}-${month}-${day}`;
        setDate(formattedDateString);
        setDuration(get(getSaleAPI.data.data, 'deductionDuration', ''));
        setEmployeeId(get(getSaleAPI.data.data, 'employeeId', ''));
        setEmployeeName(get(getSaleAPI.data.data, 'employeeName', ''));
        setDesignation(get(getSaleAPI.data.data, 'designation', ''));
        setTableData(get(getSaleAPI.data.data, 'products', ''));
        setCurrentSiteId(get(getSaleAPI.data.data, 'unitCode', ''));
        const isMonthlyAdvance = get(
          getSaleAPI,
          'data.data.isMonthlyAdvance',
          '',
        );
        if (isMonthlyAdvance === 'YES') {
          setShowAdvanceAmount(true);
          setValue(
            'advanceAmount',
            get(getSaleAPI, 'data.data.totalAmount', ''),
          );
        } else {
          setValue('isMonthlyAdvance', 'NO');
        }
      }
    }
  }, [getSaleAPI.data]);

  // useEffect(() => {
  //   fetch(`${settings.apiUrl}/api/v1/stockmain`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setProductData(data.data.items);
  //     })
  //     .catch((error) => console.error(error));
  // }, []);


  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await SalesAPI.getStockdetails();
        const errorMessage = getErrorMessage(response);
        if (errorMessage) {
          toast.error(errorMessage, {
            theme: "colored",
          });
        } else {
          setProductData(get(response, "data.data.items", [])); 
        }
      } catch (error) {
        toast.error("An unexpected error occurred", {
          theme: "colored",
        });
      }
    };
    fetchStockDetails();
  }, []);

  return (
    <Card as={Form} className="theme-wizard mb-5">
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">{headerTitle}</h5>
        </div>
      </Card.Header>

      <Card.Body className="fw-normal px-md-6 py-4">
        <Row className="g-2 mb-3">
          <Col span={3}>
            <Title level={5}>Date (DD/MM/YYYY)</Title>
            <Input
              name="date"
              size="large"
              type="date"
              value={date}
              errors
              onChange={(e) => setDate(e.target.value)}
            />
          </Col>
          <Col md={6}>
            <Title level={5}>Unit Code</Title>
            <Select
              defaultValue={currentSiteId}
              value={currentSiteId}
              showSearch
              placeholder="Select a Unit code"
              optionFilterProp="children"
              onChange={handleChangeSiteId}
              // onSearch={onSearch}
              filterOption={filterOption}
              options={siteIdsOpt}
              size="large"
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col span={6}>
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
          <Col span={8} offset={1}>
            <Title level={5}>Employee Name</Title>
            <Input
              name="employeeName"
              defaultValue={employeeName}
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
        </Row>
        <Row className="g-2 mb-3">
          <Col span={6}>
            <Title level={5}>Designation</Title>
            <Input
              name="designation"
              size="large"
              defaultValue={designation}
              prefix={<HistoryOutlined />}
              value={designation}
              onChange={handleDesignationChange}
              readOnly
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('designation'),
              }}
            />
          </Col>
          <Col md={6}>
            <Title level={5}>Deduction duration</Title>
            <Select
              size="large"
              mode="multiple"
              name="deductionDuration"
              allowClear
              style={{
                width: '100%',
              }}
              placeholder="Please select"
              defaultValue={[]}
              value={Duration}
              onChange={setDuration}
              options={MonthTypes}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('deductionDuration'),
              }}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-5">
          <WizardInput
            label="Is Monthly Advances"
            name="isMonthlyAdvance"
            type="select"
            options={['YES', 'NO']}
            errors
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('isMonthlyAdvance'),
              onChange: handleMonthlyAdvanceChanges,
            }}
          />
          {showAdvanceAmount && (
            <WizardInput
              label="Monthly Advance Amount"
              placeholder="Please Enter a Advance Amount"
              name="advanceAmount"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('advanceAmount'),
                onChange: handleAdvanceAmountChanges,
              }}
            />
          )}
        </Row>
        {!showAdvanceAmount && (
          <ProductTable
            rows={tableData}
            setRows={setTableData}
            productData={productData}
          />
        )}
      </Card.Body>
      <Card.Footer>
        <Row className="g-2 mb-3">
          <Col md={4}></Col>
          <Col md={4}>
            <Button
              onClick={onSubmitData}
              color="primary"
              className="mt-3 w-100"
            >
              {addSalesAPI.loading && (
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

export default Sale;
