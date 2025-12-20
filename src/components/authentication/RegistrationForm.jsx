/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

const RegistrationForm = ({
  hasLabel,
  handleData,
  handleClose,
  editform,
  actiontype,
}) => {
  // State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    relation: '',
    dob: '',
    occupation: '',
    aadharNumber: '',
    isAccepted: true,
  });

  const [editid, setId] = useState(null);

  useEffect(() => {
    if (actiontype === 'edit') {
      setFormData({
        id: editform.id,
        name: editform.name,
        relation: editform.relation,
        dob: editform.dob,
        occupation: editform.occupation,
        aadharNumber: editform.aadharNumber,
        status: 'Update',
      });
      setId(editform.id);
    } else {
      setFormData({
        id: '',
        name: '',
        dob: '',
        relation: '',
        occupation: '',
        aadharNumber: '',
        status: 'Add',
      });
      setId(null);
    }
  }, [actiontype]);
  // Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const statusvalue = editid ? 'Update' : 'Add';
    const addFamilyData = {
      id: editid ? editid : Math.random().toString(16).slice(2),
      name: formData.name,
      relation: formData.relation,
      dob: formData.dob,
      occupation: formData.occupation,
      aadharNumber: formData.aadharNumber,
      status: statusvalue,
    };

    handleData(addFamilyData, editid);
    handleClose();
  };

  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Name</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Name' : ''}
          value={formData.name}
          name="name"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Relation</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Realtion' : ''}
          value={formData.relation}
          name="relation"
          onChange={handleFieldChange}
          type="text"
          pattern="[a-zA-Z]"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Date of birth (DD/MM/YYYY)</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'DOB' : ''}
          value={formData.dob}
          name="dob"
          onChange={handleFieldChange}
          type="text"
          pattern="([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Occupation</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Occupation' : ''}
          value={formData.occupation}
          name="occupation"
          onChange={handleFieldChange}
          type="text"
          pattern="[a-zA-Z]"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Aadhar Number</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'aadharNumber' : ''}
          value={formData.aadharNumber}
          name="aadharNumber"
          onChange={handleFieldChange}
          maxLength={12}
          minLength={12}
          pattern="[0-9]{12}"
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

RegistrationForm.propTypes = {
  hasLabel: PropTypes.bool,
};

export default RegistrationForm;
