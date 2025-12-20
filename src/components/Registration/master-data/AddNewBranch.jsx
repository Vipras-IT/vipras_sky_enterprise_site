import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { addBranch } from '../../../api/branch';

export default function AddNewBranch() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const countryOptions = [
    'Afghanistan',
    'Bangladesh',
    'Bhutan',
    'India',
    'Iran',
    'Maldives',
    'Nepal',
    'Pakistan',
    'Sri Lanka',
  ].map((c) => ({ label: c, value: c }));

  const stateOptions = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttarakhand',
    'Uttar Pradesh',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Lakshadweep',
    'Puducherry',
  ].map((c) => ({ label: c, value: c }));

  const cityOptions = [
    'Ariyalur',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kanchipuram',
    'Kanyakumari',
    'Karur',
    'Madurai',
    'Nagapattinam',
    'Nilgiris',
    'Namakkal',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Salem',
    'Sivaganga',
    'Tirupur',
    'Tiruchirappalli',
    'Theni',
    'Tirunelveli',
    'Thanjavur',
    'Thoothukudi',
    'Tiruvallur',
    'Tiruvarur',
    'Tiruvannamalai',
    'Vellore',
    'Viluppuram',
    'Virudhunagar',
  ].map((c) => ({ label: c, value: c }));
  const onSubmitData = async (data) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const payload = {
      country: data.country?.value,
      state: data.state?.value,
      city: data.city?.value,
      branchCode: data.branchName,
      createdBy: Number(userData.employeeId),
    };
    try {
      const response = await addBranch(payload);
      toast.success('Branch added successfully:');
    } catch (error) {
      toast.error('Error adding branch:');
    }
  };

  return (
    <Card
      as={Form}
      onSubmit={handleSubmit(onSubmitData)}
      className="theme-wizard mb-5"
    >
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">Add Branch</h5>
        </div>
      </Card.Header>

      <Card.Body className="fw-normal px-md-6 py-4">
        <Row className="g-2 mb-3">
          <Col md={6}>
            <label>Select Country</label>
            <Controller
              name="country"
              control={control}
              rules={{ required: 'Country is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={countryOptions}
                  isSearchable
                  placeholder="Select a country"
                />
              )}
            />
            {errors.country && (
              <p className="text-danger">{errors.country.message}</p>
            )}
          </Col>

          <Col md={6}>
            <label>Select State</label>
            <Controller
              name="state"
              control={control}
              rules={{ required: 'State is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={stateOptions}
                  isSearchable
                  placeholder="Select a state"
                />
              )}
            />
            {errors.state && (
              <p className="text-danger">{errors.state.message}</p>
            )}
          </Col>
        </Row>

        <Row className="g-2 mb-3">
          <Col md={6}>
            <label>Select City</label>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'City is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={cityOptions}
                  isSearchable
                  placeholder="Select a city"
                />
              )}
            />
            {errors.city && (
              <p className="text-danger">{errors.city.message}</p>
            )}
          </Col>

          <Col md={6}>
            <label>Branch Name</label>
            <input
              className="form-control"
              {...register('branchName', {
                required: 'Branch name is required',
              })}
              placeholder="Enter branch name"
            />
            {errors.branchName && (
              <p className="text-danger">{errors.branchName.message}</p>
            )}
          </Col>
        </Row>
      </Card.Body>

      <Card.Footer>
        <Row className="g-2 mb-3">
          <Col md={4}></Col>
          <Col md={4}>
            <Button type="submit" variant="primary" className="mt-3 w-100">
              <span className="ps-2">Save</span>
            </Button>
          </Col>
          <Col md={4}></Col>
        </Row>
      </Card.Footer>
    </Card>
  );
}
