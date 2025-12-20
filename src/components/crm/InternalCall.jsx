/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import WizardInput from '../wizard/WizardInput';
import { Button, Spinner } from 'react-bootstrap';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import crmAPI from 'api/crm';
import useAPI from 'hooks/useApi';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import { useParams } from 'react-router-dom';
import FileUpload from 'components/upload/FileUpload';

const InternalCall = ({ dates, escalation }) => {
  const { user } = useAuth();
  const params = useParams();
  const getAllAuthorizedOfficersAPI = useAPI(crmAPI.getByUserDropDown);
  const postCrmAPI = useAPI(crmAPI.addCrm);
  const updateCrmAPI = useAPI(crmAPI.updateCRM);
  const { register, handleSubmit } = useForm();
  const [quote1, setQuote1] = useState([]);
  const [authOfficers, setAuthOfficers] = useState([]);
  const [authOfficers1, setAuthOfficers1] = useState([]);
  const [authOfficers2, setAuthOfficers2] = useState([]);
  const [manager, setManager] = useState('');
  const [manager1, setManager1] = useState('');
  const [manager2, setManager2] = useState('');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState();
  const [assignedEmployeeRole, setAssignedEmployeeRole] = useState('');
  const [firstLevelEmployeeId, setFirstLevelEmployeeId] = useState();
  const [firstLevelEmployeeRole, setFirstLevelEmployeeRole] = useState();
  const [secondLevelEmployeeId, setSecondLevelEmployeeId] = useState();
  const [secondLevelEmployeeRole, setSecondLevelEmployeeRole] = useState();
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');

  const departmentOptions = [
    {
      value: 'Integrated Facility Management Services',
      label: 'Integrated Facility Management Services',
    },
    { value: 'Security Services', label: 'Security Services' },
    { value: 'Manpower Services', label: 'Manpower Services' },
    { value: 'House Keeping', label: 'House Keeping' },
    { value: 'Deep Cleaning', label: 'Deep Cleaning' },
    { value: 'Garbage Collection', label: 'Garbage Collection' },
    { value: 'Laundry Service', label: 'Laundry Service' },
    {
      value: 'Pest Control',
      label: 'Pest Control',
    },
    { value: 'Vipras Mart', label: 'Vipras Mart' },
    { value: 'Admin', label: 'Admin' },
  ];

  const handleChangedepartment = (value) => {
    setDepartment(value);
  };
  const [currentSiteId, setCurrentSiteId] = useState('');

  const handleChangeManager = (value) => {
    const managerinfo = authOfficers.find((item) => item.value == value);
    const splitValues = split(managerinfo.label);
    setManager(splitValues[0]);
    setAssignedEmployeeRole(splitValues[1]);
    setAssignedEmployeeId(managerinfo.value);
  };
  const handleChangeManager1 = (value) => {
    const managerinfo = authOfficers.find((item) => item.value == value);
    const splitValues = split(managerinfo.label);
    setManager1(splitValues[0]);
    setFirstLevelEmployeeRole(splitValues[1]);
    setFirstLevelEmployeeId(managerinfo.value);
  };
  const handleChangeManager2 = (value) => {
    const managerinfo = authOfficers.find((item) => item.value == value);
    const splitValues = split(managerinfo.label);
    setManager2(splitValues[0]);
    setSecondLevelEmployeeRole(splitValues[1]);
    setSecondLevelEmployeeId(managerinfo.value);
  };

  const handleChangePriority = (value, option) => {
    console.log(value);
    console.log(option);
    setPriority(value);
  };
  const split = (value) => {
    let str = value;
    return str.split('-');
  };

  useEffect(() => {
    getAllAuthorizedOfficersAPI.request(get(user, 'token'));
  }, []);
  useEffect(() => {
    if (
      get(getAllAuthorizedOfficersAPI, 'data.success') &&
      !isEmpty(get(getAllAuthorizedOfficersAPI, 'data.data'))
    ) {
      const responseData = get(getAllAuthorizedOfficersAPI, 'data.data', []);
      setAuthOfficers(responseData);
      setAuthOfficers1(responseData);
      setAuthOfficers2(responseData);
    }
  }, [getAllAuthorizedOfficersAPI.data]);
  useEffect(() => {
    if (getAllAuthorizedOfficersAPI.error) {
      toast.error('CRM updated failed', {
        theme: 'colored',
      });
    }
  }, [getAllAuthorizedOfficersAPI.error]);
  const handleChangeQuets = (key, value) => {
    quote1.push(value);
    setQuote1(quote1);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const options = [
    { label: 'HIGH', value: 'HIGH' },
    { label: 'MEDIUM', value: 'MEDIUM' },
    { label: 'LOW', value: ' LOW' },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    if (
      get(postCrmAPI, 'data.success') &&
      !isEmpty(get(postCrmAPI, 'data.data'))
    ) {
      toast.success('Internal Ticket added successfully', {
        theme: 'colored',
      });
      navigate('/internal-tickets-list');
    } else if (get(postCrmAPI, 'data.message')) {
      toast.error(`Internal Ticket failed: ${postCrmAPI.data.message}`, {
        theme: 'colored',
      });
    }
  }, [postCrmAPI.data]);

  useEffect(() => {
    if (postCrmAPI.error) {
      toast.error('Internal Ticket failed', {
        theme: 'colored',
      });
    }
  }, [postCrmAPI.error]);

  const onSubmitData = async (data) => {
    if (manager === '' || manager1 === '' || manager2 === '') {
      toast.error('Please Fill in the internal details', {
        theme: 'colored',
      });
    } else if (
      manager === manager1 ||
      manager1 === manager2 ||
      manager === manager2
    ) {
      toast.error('The same name is not allowed', {
        theme: 'colored',
      });
    } else {
      const datas = localStorage.getItem('user');
      const userData = JSON.parse(datas);
      const employeeNumber = userData.employeeId;
      const createdByName = userData.fullName;
      const postData = {
        ...data,
        date: dates,
        ticketType: escalation,
        issueDescription: String(data.issueDescription),
        ticketPriority: String(priority),
        issueDocuments: String(quote1),
        assignedEmployeeId: Number(assignedEmployeeId),
        assignedEmployeeName: String(manager),
        assignedEmployeeRole: String(assignedEmployeeRole),
        firstLevelEmployeeId: Number(firstLevelEmployeeId),
        firstLevelEmployeeName: String(manager1),
        firstLevelEmployeeRole: String(firstLevelEmployeeRole),
        secondLevelEmployeeId: Number(secondLevelEmployeeId),
        secondLevelEmployeeName: String(manager2),
        secondLevelEmployeeRole: String(secondLevelEmployeeRole),
        department: String(department),
        unitCode: String(currentSiteId),
        status: String('OPEN'),
        createdByName: String(createdByName),
        createdBy: Number(employeeNumber),
      };
      if (!isEmpty(get(params, 'id'))) {
        updateCrmAPI.request(postData, get(user, 'token'));
      } else {
        await postCrmAPI.request(postData, get(user, 'token'));
      }
    }
  };
  useEffect(() => {
    if (updateCrmAPI.data) {
      if (
        get(updateCrmAPI, 'data.success') &&
        !isEmpty(get(updateCrmAPI, 'data.data'))
      ) {
        toast.success('Internal Ticket updated successfully', {
          theme: 'colored',
        });
      } else {
        toast.error('Internal Ticket updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateCrmAPI.data]);

  const siteIdsOptions = authOfficers1.map((officer) => ({
    value: officer.value,
    label: officer.label,
  }));
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const siteId = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteId.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  const handleChangeSiteId = (value) => {
    const selectedOption = siteId.find((option) => option.value === value);
    setCurrentSiteId(get(selectedOption, 'label'));
  };
  return (
    <>
      <Row
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        <Row className="g-2 mb-3">
          <WizardInput
            label="Problem Description"
            name="issueDescription"
            type="textarea"
            errors
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('issueDescription'),
            }}
          />

          <Col md={6}>
            <label>Ticket Priority</label>
            <Select
              showSearch
              size="large"
              placeholder="Select a Lead"
              value={priority}
              optionFilterProp="children"
              required
              filterOption={filterOption}
              onChange={handleChangePriority}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps
              options={options}
              style={{
                width: '100%',
              }}
            />
            <br />
            <br />
            <FileUpload
              setValue={handleChangeQuets}
              documentName="quote1"
              label="Uploade Images"
              documents={quote1}
              multiple={true}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col span={6}>
            <label>Department</label>
            <Select
              showSearch
              optionFilterProp="label"
              size="large"
              style={{ width: '100%' }}
              onChange={handleChangedepartment}
              // defaultValue={' '}
              options={departmentOptions}
            />
          </Col>
          <Col span={6}>
            <label>Ticket Alloted To</label>
            <Select
              showSearch
              optionFilterProp="label"
              size="large"
              style={{ width: '100%' }}
              onChange={handleChangeManager}
              options={authOfficers.map((officer) => ({
                value: officer.value,
                label: officer.label,
              }))}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col span={6}>
            <label>Escalation One</label>
            <Select
              showSearch
              size="large"
              style={{ width: '100%' }}
              optionFilterProp="label"
              onSearch={onSearch}
              onChange={handleChangeManager1}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps
              options={siteIdsOptions}
            />
          </Col>
          <Col span={6}>
            <label>Escalation Two</label>
            <Select
              showSearch
              size="large"
              optionFilterProp="label"
              style={{ width: '100%' }}
              onChange={handleChangeManager2}
              filterOption={filterOption}
              options={authOfficers2.map((officer) => ({
                value: officer.value,
                label: officer.label,
              }))}
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
              filterOption={filterOption}
              options={siteId}
              size="large"
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col span={6}></Col>
        </Row>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {postCrmAPI.loading && (
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
      </Row>
    </>
  );
};

export default InternalCall;
