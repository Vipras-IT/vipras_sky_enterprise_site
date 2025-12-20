/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, Form } from 'react-bootstrap';

const SiteOtherExpensiveForm = ({
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
    rate: '',
    billingcycle: '',
    status: 'Success',
  });

  const OtherServices = [
    'Pest Control',
    'Horticulture',
    'Tank Cleaning',
    'House Keeping Cosumable',
    'Swimming Pool Chemicals',
    'STP / WTP Plant Chemicals',
    'CAMC-Comprehensive Annual Maintance Charges',
    'AMC-Annual Maintance Charges',
    'Chlorine',
    'Salt Purchase',
    'Tools, Tackles & Testing Kits',
    'Machinery Rental',
    'Staircase / Facade Cleaning',
    'Garbage Disposal',
    'Service Charges',
    'Stationary Products',
    'Facade/ Clubhouse Cleaning',
    'Others',
  ];

  const Billingcycle = [
    'Monthly',
    'Once in a Two Month',
    'Quarterly',
    'Half Yearly',
    'Yearly',
    'One Time only',
  ];

  // Handler
  const [editid, setId] = useState(null);

  // Handler
  useEffect(() => {
    if (actiontype === 'edit') {
      setFormData({
        id: editform.id,
        serviceName: editform.serviceName,
        rate: editform.rate,
        billingcycle: editform.billingcycle,
        status: 'Update',
      });
      setId(editform.id);
    } else {
      setFormData({
        id: '',
        serviceName: '',
        rate: '',
        billingcycle: '',
        status: 'Add',
      });
      setId(null);
    }
  }, [actiontype]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const statusvalue = editid ? 'Update' : 'Add';

    const addotherExpensive = {
      id: editid ? editid : Math.random().toString(16).slice(2),
      serviceName: formData.serviceName,
      rate: formData.rate,
      billingcycle: formData.billingcycle,
      status: statusvalue,
    };
    handleData(addotherExpensive, editid);
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
        {hasLabel && <Form.Label>Service Name</Form.Label>}
        <Form.Select
          placeholder={!hasLabel ? 'ServiceName' : ''}
          value={formData.serviceName}
          name="serviceName"
          onChange={handleFieldChange}
          type="select"
        >
          <option value="">Select your service Type</option>
          {OtherServices.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Rate</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Rate' : ''}
          value={formData.rate}
          name="rate"
          onChange={handleFieldChange}
          type="number"
        />
      </Form.Group>

      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={12}>
          {hasLabel && <Form.Label>Billing Cycle</Form.Label>}
          <Form.Select
            placeholder={!hasLabel ? 'Billing Cycle' : ''}
            value={formData.billingcycle}
            name="billingcycle"
            onChange={handleFieldChange}
            type="select"
          >
            <option value="">Select your billing cycle</option>
            {Billingcycle.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </Form.Select>
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

SiteOtherExpensiveForm.propTypes = {
  hasLabel: PropTypes.bool,
};

export default SiteOtherExpensiveForm;
