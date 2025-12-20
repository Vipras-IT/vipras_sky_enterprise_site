/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form } from 'react-bootstrap';

const TenantEmployeeForm = ({
  hasLabel,
  handleData,
  handleClose,
  editform,
  actiontype,
}) => {
  // State
  const [formData, setFormData] = useState({
    id: '',
    date: '',
    employeeId: '',
    employeeName: '',
    remarks: '',
    status: 'Success',
  });

  // Handler
  const [editid, setId] = useState(null);

  // Handler
  useEffect(() => {
    if (actiontype === 'edit') {
      setFormData({
        id: editform.id,
        date: editform.date,
        employeeId: editform.employeeId,
        employeeName: editform.employeeName,
        remarks: editform.remarks,
        status: 'Update',
      });
      setId(editform.id);
    } else {
      setFormData({
        id: '',
        date: '',
        employeeId: '',
        employeeName: '',
        remarks: '',
        status: 'Add',
      });
      setId(null);
    }
  }, [actiontype]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const statusvalue = editid ? 'Update' : 'Add';

    const addTenantEmployee = {
      id: editid ? editid : Math.random().toString(16).slice(2),
      date: formData.date,
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      remarks: formData.remarks,
      status: statusvalue,
    };
    handleData(addTenantEmployee, editid);
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
      <Form.Group className="mb-3" as={Col} sm={12}>
        {hasLabel && <Form.Label>Date</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Date' : ''}
          value={formData.date}
          name="date"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3" as={Col} sm={12}>
        {hasLabel && <Form.Label>Employee Id</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'EmployeeId' : ''}
          value={formData.employeeId}
          name="employeeId"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3" as={Col} sm={12}>
        {hasLabel && <Form.Label>Employee Name</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'EmployeeName' : ''}
          value={formData.employeeName}
          name="employeeName"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-4" as={Col} sm={12}>
        {hasLabel && <Form.Label>Remarks</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Remarks' : ''}
          value={formData.remarks}
          name="remarks"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Button className="w-100" onClick={handleSubmit}>
          Save
        </Button>
      </Form.Group>
    </Form>
  );
};

TenantEmployeeForm.propTypes = {
  hasLabel: PropTypes.bool,
};

export default TenantEmployeeForm;
