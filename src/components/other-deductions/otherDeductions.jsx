import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAPI from 'hooks/useApi';
import OtherDeductionAPI from 'api/otherDeductions';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { Typography, Input, Select } from 'antd';
import { UserOutlined, HistoryOutlined } from '@ant-design/icons';
import employeeAPI from 'api/getEmployeeDetails';
import { useParams } from 'react-router-dom';
import WizardInput from 'components/wizard/WizardInput';
const { Title } = Typography;

const OtherDeductions = () => {
  const params = useParams();

  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const siteIdsOptions = [];

  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const [currentSiteId, setCurrentSiteId] = useState(
    get(siteIdsOptions[0], 'value', ''),
  );

  const navigate = useNavigate();
  const addOtherDeductionAPI = useAPI(OtherDeductionAPI.AddOtherDeductuion);
  const updateOtherDeductionAPI = useAPI(
    OtherDeductionAPI.updateOtherDeductuiondetails,
  );
  const getOtherDeductionAPI = useAPI(
    OtherDeductionAPI.getOtherDeductuiondetails,
  );
  const getEmployeeAPI = useAPI(employeeAPI.getEmployeeByEmployeeNumber);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [date, setDate] = useState([]);
  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
  };
  const onSearch = (value) => {
    if (value) {
      getEmployeeAPI.request(value);
    }
  };
  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
  };
  const { Search } = Input;

  const { register, handleSubmit, setValue, reset } = useForm();

  const onSubmitData = (data) => {
    const splitedSiteId = currentSiteId.split('-')[0];
    const selectedOption = siteIdsOptions.find(
      (option) => option.value === splitedSiteId,
    );
    const unitCodeWithName = get(selectedOption, 'label');
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      ...data,
      date: date,
      employeeIDNumber: String(employeeId),
      employeeName: String(employeeName),
      designation: designation,
      unitCode: unitCodeWithName,
      advance: Number(data.advance),
      transport: Number(data.transport),
      fine: Number(data.fine),
      remarks: String(data.remarks),
      viprasMart: Number(data.viprasMart),
      attendanceBonus: Number(data.attendanceBonus),
      others: Number(data.others),
      viprasMartInvoiceNo: String(data.viprasMartInvoiceNo),
      additionalIdCard: Number(data.additionalIdCard),
      createdBy: Number(userData.employeeId),
    };
    if (!isEmpty(get(params, 'id'))) {
      delete postData.createdOn;
      delete postData.updatedOn;
      updateOtherDeductionAPI.request(postData);
    } else {
      addOtherDeductionAPI.request(postData);
    }
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
  }, [getEmployeeAPI.data]);
  //const handlePercentageChange = e => {};

  useEffect(() => {
    if (getEmployeeAPI.error) {
      toast.error('Something went wrong please try again', {
        theme: 'colored',
      });
    }
  }, [getEmployeeAPI.error]);

  useEffect(() => {
    if (
      get(addOtherDeductionAPI, 'data.success') &&
      !isEmpty(get(addOtherDeductionAPI, 'data.data'))
    ) {
      toast.success('other Deduction added successfully', {
        theme: 'colored',
      });
      // navigate('/other-deductions', { replace: true });
      // Todo should clear all the fields
      handleClearAllData();
    }
    if (
      !get(addOtherDeductionAPI, 'data.success') &&
      !isEmpty(get(addOtherDeductionAPI, 'data.message'))
    ) {
      toast.error(get(addOtherDeductionAPI, 'data.message'), {
        theme: 'colored',
      });
    }
  }, [addOtherDeductionAPI.data]);

  const handleClearAllData = () => {
    setValue('advance', 0);
    setValue('transport', 0);
    setValue('fine', 0);
    setValue('remarks', '');
    setValue('viprasMart', 0);
    setValue('viprasMartInvoiceNo', '');
    setValue('attendanceBonus', 0);
    setValue('others', '');
    setValue('additionalIdCard', 0);
    setEmployeeId('');
    setEmployeeName('');
    setDesignation('');
  };

  useEffect(() => {
    if (updateOtherDeductionAPI.data) {
      if (
        get(updateOtherDeductionAPI, 'data.success') &&
        !isEmpty(get(updateOtherDeductionAPI, 'data.data'))
      ) {
        toast.success('other Deduction updated successfully', {
          theme: 'colored',
        });
        navigate('/other-deductions-list', { replace: true });
      } else {
        toast.error('other Deduction updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateOtherDeductionAPI.data]);

  useEffect(() => {
    if (addOtherDeductionAPI.error) {
      toast.error('other Deduction added failed', {
        theme: 'colored',
      });
    }
  }, [addOtherDeductionAPI.error]);

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getOtherDeductionAPI.request(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if (getOtherDeductionAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        reset(getOtherDeductionAPI.data.data);
        const selecteDate = get(getOtherDeductionAPI.data.data, 'date', []);
        const inputDate = new Date(selecteDate);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();
        const formattedDateString = `${year}-${month}-${day}`;
        setDate(formattedDateString);
        setEmployeeId(
          get(getOtherDeductionAPI.data.data, 'employeeIDNumber', []),
        );
        setEmployeeName(
          get(getOtherDeductionAPI.data.data, 'employeeName', ''),
        );
        setDesignation(get(getOtherDeductionAPI.data.data, 'designation', ''));
        const unitCode = get(getOtherDeductionAPI.data.data, 'unitCode', []);
        setCurrentSiteId(unitCode);
      }
    }
  }, [getOtherDeductionAPI.data]);

  return (
    <Card
      as={Form}
      onSubmit={handleSubmit(onSubmitData)}
      className="theme-wizard mb-5"
    >
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">Other Deduction</h5>
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
              size="large"
              prefix={<UserOutlined />}
              value={employeeName}
              onChange={handleEmployeeNameChange}
              readonly
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
              prefix={<HistoryOutlined />}
              value={designation}
              onChange={handleDesignationChange}
              readonly
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('designation'),
              }}
            />
          </Col>
          <Col md={6}>
            <WizardInput
              label="Advances"
              name="advance"
              type="Number"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('advance'),
              }}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col md={6}>
            <WizardInput
              label="Transport"
              name="transport"
              type="Number"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('transport'),
              }}
            />
          </Col>
          <Col md={6}>
            <WizardInput
              label="Fine"
              name="fine"
              type="Number"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('fine'),
              }}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col md={6}>
            <WizardInput
              label="Remarks"
              name="remarks"
              type="text"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('remarks'),
              }}
            />
          </Col>
          <Col md={6}>
            <WizardInput
              label="Vipras Mart"
              name="viprasMart"
              type="Number"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('viprasMart'),
              }}
            />
          </Col>
          <Col md={6}>
            <WizardInput
              label="Vipras Mart-InvoiceNo"
              name="viprasMartInvoiceNo"
              type="String"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('viprasMartInvoiceNo'),
              }}
            />
          </Col>
          <Col md={6}>
            <WizardInput
              label="Attendance Bonus"
              name="attendanceBonus"
              type="Number"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('attendanceBonus'),
              }}
            />
          </Col>
          <Col md={6}>
            <WizardInput
              label="Additional Deduction"
              name="others"
              type="String"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('others'),
              }}
            />
          </Col>
          <Col md={6}>
            <WizardInput
              label="Additional Id Card"
              name="type"
              type="Number"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('additionalIdCard'),
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
              {addOtherDeductionAPI.loading && (
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

export default OtherDeductions;
