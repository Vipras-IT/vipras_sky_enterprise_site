/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { getShiftOptions, Role } from 'helpers/utils';

const SiteManPowerSalaryForm = ({
  hasLabel,
  handleData,
  handleClose,
  editform,
  actiontype,
}) => {
  // State
  const [formData, setFormData] = useState({
    id: '',
    serviceName: '',
    idNo: '',
    empName: '',
    fixedSalary: '',
    shiftType: '',
    billingValue: '',
    noOfDuties: '',
    salary: '',
    status: 'Success',
  });

  const serviceTypes = Role;

  const shiftoption = getShiftOptions();

  // Handler
  const [editid, setId] = useState(null);

  // Handler
  useEffect(() => {
    if (actiontype === 'edit') {
      setFormData({
        id: editform.id,
        serviceName: editform.serviceName,
        idNo: editform.idNo,
        empName: editform.empName,
        fixedSalary: editform.fixedSalary,
        shiftType: editform.shiftType,
        billingValue: editform.billingValue,
        noOfDuties: editform.noOfDuties,
        salary: editform.salary,
        status: 'Update',
      });
      setId(editform.id);
    } else {
      setFormData({
        id: '',
        serviceName: '',
        idNo: '',
        empName: '',
        fixedSalary: '',
        shiftType: '',
        billingValue: '',
        noOfDuties: '',
        salary: '',
        status: 'Add',
      });
      setId(null);
    }
  }, [actiontype]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const statusvalue = editid ? 'Update' : 'Add';

    const addManpoerData = {
      id: editid ? editid : Math.random().toString(16).slice(2),
      serviceName: formData.serviceName,
      idNo: formData.idNo,
      empName: formData.empName,
      fixedSalary: formData.fixedSalary,
      shiftType: formData.shiftType,
      billingValue: formData.billingValue,
      noOfDuties: formData.noOfDuties,
      salary: formData.salary,
      status: statusvalue,
    };

    handleData(addManpoerData, editid);
    handleClose();
  };

  const handleFieldChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Type of Designation</Form.Label>}
        <Form.Select
          placeholder={!hasLabel ? 'ServiceName' : ''}
          value={formData.serviceName}
          name="serviceName"
          onChange={handleFieldChange}
          type="select"
        >
          <option value="">Select your designation</option>
          {serviceTypes.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={4}>
          {hasLabel && <Form.Label>Emp Id</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Emp Id' : ''}
            value={formData.idNo}
            name="idNo"
            onChange={handleFieldChange}
            type="text"
          />
        </Form.Group>

        <Form.Group as={Col} sm={8}>
          {hasLabel && <Form.Label>Emp Name</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Emp Name' : ''}
            value={formData.empName}
            name="empName"
            onChange={handleFieldChange}
            type="text"
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Type of Shift</Form.Label>}
        <Form.Select
          placeholder={!hasLabel ? 'Shift Type' : ''}
          value={formData.shiftType}
          name="shiftType"
          onChange={handleFieldChange}
          type="select"
        >
          <option value="">Select your Shift</option>
          {shiftoption.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Fixed Salary</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Fixed salary' : ''}
            value={formData.fixedSalary}
            name="fixedSalary"
            onChange={handleFieldChange}
            type="text"
          />
        </Form.Group>
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Billing Value</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Billing Value' : ''}
            value={formData.billingValue}
            name="billingValue"
            onChange={handleFieldChange}
            type="number"
          />
        </Form.Group>
      </Row>

      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>No of duties</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'No of duties' : ''}
            value={formData.noOfDuties}
            name="noOfDuties"
            onChange={handleFieldChange}
            type="number"
          />
        </Form.Group>
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Gross Salary</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Salary' : ''}
            value={formData.salary}
            name="salary"
            onChange={handleFieldChange}
            type="number"
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-4">
        <Button className="w-100" onClick={handleSubmit}>
          Save
        </Button>
      </Form.Group>
    </Form>
  );
};

SiteManPowerSalaryForm.propTypes = {
  hasLabel: PropTypes.bool,
};

export default SiteManPowerSalaryForm;
