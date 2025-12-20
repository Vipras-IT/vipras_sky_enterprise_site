/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, Form } from 'react-bootstrap';

const PreEmpForm = ({
  hasLabel,
  handleData,
  handleClose,
  editform,
  actiontype,
}) => {
  // State
  const [formData, setFormData] = useState({
    id: '',
    preEmployer: '',
    refWhom: '',
    duration: '',
    reasForLeave: '',
    status: 'Success',
  });

  // Handler
  const [editid, setId] = useState(null);

  // Handler
  useEffect(() => {
    if (actiontype === 'edit') {
      setFormData({
        id: editform.id,
        preEmployer: editform.preEmployer,
        refWhom: editform.refWhom,
        duration: editform.duration,
        reasForLeave: editform.reasForLeave,
        status: 'Update',
      });
      setId(editform.id);
    } else {
      setFormData({
        id: '',
        preEmployer: '',
        refWhom: '',
        duration: '',
        reasForLeave: '',
        status: 'Add',
      });
      setId(null);
    }
  }, [actiontype]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const statusvalue = editid ? 'Update' : 'Add';

    const addPreviousEmpData = {
      id: editid ? editid : Math.random().toString(16).slice(2),
      preEmployer: formData.preEmployer,
      refWhom: formData.refWhom,
      duration: formData.duration,
      reasForLeave: formData.reasForLeave,
      status: statusvalue,
    };
    handleData(addPreviousEmpData, editid);
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
        {hasLabel && <Form.Label>Previous Employer</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'PreEmployer' : ''}
          value={formData.preEmployer}
          name="preEmployer"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Ref Whom</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'RefWhom' : ''}
          value={formData.refWhom}
          name="refWhom"
          onChange={handleFieldChange}
          type="text"
          pattern="[a-zA-Z]"
        />
      </Form.Group>

      <Row className="g-2 mb-3">
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Duration</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'Duration' : ''}
            value={formData.duration}
            name="duration"
            onChange={handleFieldChange}
            type="number"
          />
        </Form.Group>
        <Form.Group as={Col} sm={6}>
          {hasLabel && <Form.Label>Reason For Leaving</Form.Label>}
          <Form.Control
            placeholder={!hasLabel ? 'reasForLeave' : ''}
            value={formData.reasForLeave}
            name="reasForLeave"
            onChange={handleFieldChange}
            type="text"
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

PreEmpForm.propTypes = {
  hasLabel: PropTypes.bool,
};

export default PreEmpForm;
