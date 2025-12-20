/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { get } from 'lodash';
import moment from 'moment';

const CustomDateInput = forwardRef(
  (
    { value, onClick, isInvalid, isValid, formControlProps, errorMessage },
    ref,
  ) => {
    return (
      <>
        <Form.Control
          ref={ref}
          isInvalid={isInvalid}
          isValid={isValid}
          value={value}
          onClick={onClick}
          {...formControlProps}
        />
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </>
    );
  },
);
CustomDateInput.displayName = 'CustomDateInput';

const WizardInput = ({
  label,
  name,
  errors,
  type = 'text',
  options = [],
  placeholder,
  formControlProps,
  formGroupProps,
  setValue,
  datepickerProps,
}) => {
  const [date, setDate] = useState(null);
  const [select, setSelect] = useState(null);

  const handleFieldChange = (e) => {
    // var abc = e.target.value;
    // selectedCountryvalue(abc);
  };

  const today = moment();

  const disableFutureDt = (current) => {
    return current.isBefore(today);
  };

  if (type === 'date') {
    return (
      <Form.Group {...formGroupProps}>
        {!!label && <Form.Label>{label}</Form.Label>}

        <DatePicker
          selected={date}
          onChange={(date) => {
            setDate(date);
            setValue(name, date);
          }}
          customInput={
            <CustomDateInput
              formControlProps={formControlProps}
              errorMessage={errors[name]?.message}
              isInvalid={errors[name]}
              isValid={Object.keys(errors).length > 0 && !errors[name]}
            />
          }
          {...datepickerProps}
        />
      </Form.Group>
    );
  }

  if (type === 'checkbox' || type === 'switch' || type === 'radio') {
    return (
      <Form.Check type={type} id={name + Math.floor(Math.random() * 100)}>
        <Form.Check.Input
          type={type}
          {...formControlProps}
          isInvalid={errors[name]}
          isValid={Object.keys(errors).length > 0 && !errors[name]}
        />
        <Form.Check.Label className="ms-2">{label}</Form.Check.Label>
        <Form.Control.Feedback type="invalid" className="mt-0">
          {errors[name]?.message}
        </Form.Control.Feedback>
      </Form.Check>
    );
  }
    if (type === 'select') {
    return (
      <Form.Group {...formGroupProps}>
        <Form.Label>{label}</Form.Label>
        <Form.Select
          type={type}
          {...formControlProps}
          isInvalid={errors[name]}
          isValid={Object.keys(errors).length > 0 && !errors[name]}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option
              key={index}
              value={typeof option === 'object' ? option.value : option}
            >
              {typeof option === 'object' ? option.label : option}
            </option>
          ))}
        </Form.Select>
        
        <Form.Control.Feedback type="invalid">
          {errors[name]?.message}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }
  if (type === 'textarea') {
    return (
      <Form.Group {...formGroupProps}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          as="textarea"
          placeholder={placeholder}
          {...formControlProps}
          isValid={Object.keys(errors).length > 0 && !errors[name]}
          isInvalid={errors[name]}
          rows={4}
        />
        <Form.Control.Feedback type="invalid">
          {errors[name]?.message}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  if (type === 'multiselect') {
    return (
      <Form.Group {...formGroupProps}>
        <Form.Label>{label}</Form.Label>
        <Select
          closeMenuOnSelect={false}
          options={options}
          placeholder="Select your deployment..."
          isMulti
          classNamePrefix="react-select"
          value={select}
          onChange={(value) => {
            setValue(name, value);
            setSelect(value);
          }}
        />
        <Form.Control.Feedback type="invalid">
          {errors[name]?.message}
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  return (
    <Form.Group {...formGroupProps}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        {...formControlProps}
        isInvalid={get(errors, name)}
        isValid={Object.keys(errors).length > 0 && !get(errors, name)}
      />
      <Form.Control.Feedback type="invalid">
        {get(errors, name)?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

CustomDateInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  isInvalid: PropTypes.bool,
  isValid: PropTypes.bool,
  formControlProps: PropTypes.object,
  errorMessage: PropTypes.string,
};

WizardInput.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  errors: PropTypes.object,
  type: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  formControlProps: PropTypes.object,
  formGroupProps: PropTypes.object,
  setValue: PropTypes.func,
  datepickerProps: PropTypes.object,
};

WizardInput.defaultProps = { required: false };

export default WizardInput;
