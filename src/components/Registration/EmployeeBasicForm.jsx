/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import WizardInput from '../wizard/WizardInput';
import { Col, Row } from 'react-bootstrap';
import { toLower, get } from 'lodash';
import { Select, Typography } from 'antd';
import notificationapi from 'api/notificationapi';
import siteAPI from 'api/siteCreation';
import { toast } from 'react-toastify';
import { getErrorMessage } from 'helpers/utils';
const { Title } = Typography;

// import { fetchEmployeeDetailsDataWithField } from 'api/getEmployeeData';

const EmployeeBasicForm = ({
  register,
  errors,
  watch,
  languageKnown,
  setLanguageKnown,
  siteCodeWithName,
  setSiteCodeWithName
}) => {
  const maritalStatus = watch('maritalStatus');

  const maritalStatusLabel =
    maritalStatus === 'Married' ? 'Spouse' : 'Guardian';

  const languageTypes = [
    { value: 'Tamil', label: 'Tamil' },
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Malayalam', label: 'Malayalam' },
    { value: 'Telugu', label: 'Telugu' },
  ];

  const siteIdsString = window.localStorage.getItem('siteIds');
  let siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const datas = localStorage.getItem('user');
  const userData = JSON.parse(datas);
  let userSiteIds = get(userData, 'unitCodes');
  if (userSiteIds && userSiteIds.length > 0 && userSiteIds[0] !== 'ALL') {
    siteIds = siteIds.filter((item) =>
      userSiteIds.includes(item.split('-')[0]),
    );
  }
  siteIds.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });
  const siteIdsOptions = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      label: item,
      value: item,
    });
  });


  // const siteId = window.localStorage.getItem('siteIds');
  // const siteIdObject = siteId ? JSON.parse(siteId) : [];
  // const siteIdsOptions = [];
  // siteIdObject.map((item) => {
  //   const siteIdArray = item.split('-');
  //   siteIdsOptions.push({
  //     value: siteIdArray[0],
  //     label: item,
  //   }).sort((a, b) => {
  //   const numA = parseInt(a.value.replace(/\D/g, ''), 10);
  //   const numB = parseInt(b.value.replace(/\D/g, ''), 10);
  //   return numA - numB; 
  // });
  // });

  // const [employeeNumberValid, setEmployeeNumberValid] = useState(false);
  // const [aadharNumberValid, setAadharNumberValid] = useState(false);

  const [assignedForOptions, setAssignedForOptions] = useState([]);

  // useEffect(() => {
  //   const showUpdateEmployee = async () => {
  //     try {
  //       const response = await notificationapi.getRole();
  //       const errorMessage = getErrorMessage(response);
  //       if (errorMessage) {
  //         toast.error(errorMessage, {
  //           theme: 'colored'
  //         });
  //         return;
  //       }
  //       const roles = get(response, 'data.data', []);
  //       console.log(roles);
  //       setAssignedForOptions(roles);
  //     } catch (error) {
  //       toast.error('An error occurred while fetching roles.', {
  //         theme: 'colored'
  //       });
  //       console.error(error);
  //     }
  //   };
  //   showUpdateEmployee();
  // }, []);

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const [currentSiteId, setCurrentSiteId] = useState([]);
  const [DepartmentStatus, setDepartmentStatus] = useState('');

  // const handleUnitDeployedChanges = (option, value) => {
  //   setCurrentSiteId(value);
  //   setDepartmentStatus(option);
  //   showUpdateEmployee(option);
  // };

  const handleUnitDeployedChanges = (value) => {
    setSiteCodeWithName(value);
    setDepartmentStatus(value.split('-')[0]);
    showUpdateEmployee(value.split('-')[0]);
  };

  const showUpdateEmployee = async (siteID) => {
    const response = await siteAPI.getSitedetailsBySiteCode(siteID);
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      const design = get(response, 'data.data.siteAgreedManPower', {});
      const options = Array.isArray(design)
        ? design.map((item) => item.name)
        : [];
      if (role) {
        let existingRoleIndex = options.findIndex(opt => opt === role)
        options.splice(existingRoleIndex, 1);
      }
      setAssignedForOptions(options);
    }
  };


  const role = watch('role');
  const hasTriggeredAPI = useRef(false);

  useEffect(() => {
    // Trigger API only once when siteCodeWithName gets a value
    if (siteCodeWithName && !hasTriggeredAPI.current) {
      hasTriggeredAPI.current = true; // Mark API as triggered
      setDepartmentStatus(siteCodeWithName.split('-')[0]);
      showUpdateEmployee(siteCodeWithName.split('-')[0]);
    }
  }, [siteCodeWithName]); // Run effect when siteCodeWithName changes

  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Employee Number"
          name="employeeNumber"
          errors={errors}
          type="number"
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('employeeNumber'),
            disabled: true,
          }}
        />
        <WizardInput
          label="Employee Name"
          name="employeeName"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('employeeName', {
              required: 'Employee Name field is required',
              minLength: {
                value: 3,
                message: 'Employee name must have at least 3 characters',
              },
            }),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Employee Name (as per Aadhar)"
          name="employeeNameAsPerAadhar"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('employeeNameAsPerAadhar'),
          }}
        />
        <WizardInput
          label="Emp DOB as per Certificate (DD/MM/YYYY)"
          name="employeeDOB"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('employeeDOB', {
              pattern: {
                value:
                  /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/i,
                message: 'DOB must be valid',
              },
            }),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Father's Name"
          name="fatherName"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('fatherName'),
          }}
        />
        <WizardInput
          label="Mother's Name"
          name="motherName"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('motherName'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Education Qualification"
          name="qualification"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('qualification'),
          }}
        />
        <WizardInput
          label="Technical Qualification"
          name="technicalQualification"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('technicalQualification'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          type="select"
          placeholder="Select your blood group..."
          label="Blood Group"
          name="bloodGroup"
          errors={errors}
          options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('bloodGroup'),
          }}
        />
        <WizardInput
          type="select"
          label="Marital Status"
          name="maritalStatus"
          placeholder="Select your martial status..."
          errors={errors}
          options={['Single', 'Married', 'Widowed', 'Divorced', 'Separated']}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('maritalStatus'),
          }}
        />
      </Row>
      {maritalStatus && (
        <Row className="g-2 mb-3">
          <WizardInput
            label={`${maritalStatusLabel} Name`}
            name=""
            errors={errors}
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('guardianName'),
            }}
          />

          <WizardInput
            label={`${maritalStatusLabel} Contact Number`}
            name="guardianContactNumber"
            errors={errors}
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('guardianContactNumber', {
                minLength: {
                  value: 10,
                  message: 'Contact number should be 10 char only',
                },
                maxLength: {
                  value: 10,
                  message: 'Contact number should be 10 char only',
                },
              }),
            }}
          />
        </Row>
      )}
      <Row className="g-2 mb-3">
        <Col md={6}>
          <Title level={5}>Language Known</Title>
          <Select
            size="large"
            mode="multiple"
            name="languageKnown"
            allowClear
            style={{
              width: '100%',
            }}
            placeholder="Please select"
            defaultValue={[]}
            value={languageKnown}
            onChange={setLanguageKnown}
            options={languageTypes}
          />
        </Col>
        <Col md={6}>
          <WizardInput
            type="select"
            label="Gender"
            name="gender"
            placeholder="Select your Gender"
            errors={errors}
            options={['Male', 'Female', 'Others']}
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('gender'),
            }}
          />
        </Col>
      </Row>

      <Row className="g-2 mb-3">
        {
          <Col md={6}>
            <div style={{ marginBottom: '0.6rem', fontSize: '16px' }}>Unit Deployed</div>
            <Select
              size="large"
              showSearch name="siteCodeWithName"
              allowClear
              style={{
                width: '100%',
              }}
              placeholder="Please select"
              defaultValue={''}
              value={siteCodeWithName}
              // onChange={(value, option) => {
              //   handleUnitDeployedChanges(value);
              //   someOtherHandler(value, option);
              // }}

              onChange={handleUnitDeployedChanges}
              options={siteIdsOptions}
            />


          </Col>
        }

        {/* <Col md={6}>
          <label>Unit Deployed</label>
          <Select
            defaultValue={currentSiteId}
            value={currentSiteId}
            showSearch
            placeholder="Select a Unit code"
            optionFilterProp="children"
            errors={errors}
            onChange={handleUnitDeployedChanges}
            // onSearch={onSearch}
            filterOption={filterOption}
            options={siteIdsOptions}
            size="large"
            // formGroupProps={{ as: Col, sm: 6 }}
            style={{ width: '100%' }}
            formControlProps={{
              ...register('siteCodeWithName'),
            }}
          />
        </Col> */}
        {DepartmentStatus === 'UC001' && (
          <WizardInput
            type="select"
            label="Department"
            name="department"
            placeholder="Select your department..."
            errors={errors}
            options={[
              'Integrated Facility Management Services',
              'Security Services',
              'Manpower Services',
              'House Keeping',
              'Deep Cleaning',
              'Garbage Collection',
              'Laundry Service',
              'Pest Control',
              'Vipras Mart',
              'Admin',
            ]}
            formGroupProps={{ as: Col, sm: 6 }}
            formControlProps={{
              ...register('department'),
            }}
          />
        )}
        <WizardInput
          errors={errors}
          label="Aadhar No *"
          name="aadharNumber"
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('aadharNumber', {
              required:
                toLower(role) === 'cl' ? false : 'Aadhar No field is required',
              pattern: {
                value: /[0-9]{12}/,
                message: 'Aadhar No must be valid',
              },
              minLength: {
                value: 12,
                message: 'Aadhar No must be valid',
              },
              maxLength: {
                value: 12,
                message: 'Aadhar No must be valid',
              },
            }),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          type="select"
          label="Designation"
          placeholder={role || "Designation"}
          name="role"
          options={assignedForOptions}
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('role'),
          }}
        />
        <WizardInput
          label="Identification Mark 1"
          name="identificationMark1"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('identificationMark1'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Identification Mark 2"
          name="identificationMark2"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('identificationMark2'),
          }}
        />
        <WizardInput
          label="Height"
          name="height"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('height'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Weight"
          name="weight"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('weight'),
          }}
        />
        <WizardInput
          label="Latitude"
          name="latitude"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            step: "any",
            ...register("latitude", {
              valueAsNumber: true,
            }),
          }}
        />
      </Row>

      <Row className="g-2 mb-3">
        <WizardInput
          label="Longitude"
          name="longitude"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            step: "any",
            ...register("longitude", {
              valueAsNumber: true,
            }),
          }}
        />
        <WizardInput
          label="Coverage Area"
          name="coverageArea"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register("coverageArea", {
              valueAsNumber: true,
            }),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Start Time"
          name="startTime"
          type="time"
          // type='date'
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('startTime'),
          }}
        />


        {/* <WizardInput
          label="End Time"
          name="endTime"
          type="time"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('endTime'),
          }}
        /> */}

      </Row>
    </>
  );
};

EmployeeBasicForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  setValue: PropTypes.func.isRequired,
};

export default EmployeeBasicForm;
