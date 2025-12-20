/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getErrorMessage } from 'helpers/utils';
import FileUpload from 'components/upload/FileUpload';
import WizardInput from '../wizard/WizardInput';
import resume from '../../api/resume';
const AddResume = ({ validation }) => {

  const [loading, setLoading] = useState(false);
  const [rentalDocuments, setRentalDocuments] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onError = () => {
    if (!validation) {
      clearErrors();
    }
  };

  const onSubmitData = async (data) => {
    const postData = {
      name: String(data.name),
      fatherName: String(data.fatherName),
      contactNo: String(data.contactNo),
      emailId: String(data.emailId),
      dob: String(data.dob),
      qualification: String(data.qualification),
      location: String(data.location),
      maritalStatus: String(data.maritalStatus),
      postedFor: String(data.postedFor),
      experiences: String(data.experiences),
      currentSalary: Number(data.currentSalary),
      expectedSalary: Number(data.expectedSalary),
      referredBy: String(data.referredBy),
      document: rentalDocuments,
    };
    setLoading(true);
    const response = await resume.addResume(
      postData
    );
    const errorMessage = getErrorMessage(response);
    setLoading(false);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      toast.success('Resume added successfully', {
        theme: 'colored',
      });
    }
  };

  const handleChangeQuets = (key, value) => {
    rentalDocuments.push(value);
    setRentalDocuments(rentalDocuments);
  };

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData, onError)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add Resume</h5>
          </div>
        </Card.Header>

        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <WizardInput
              label="Name"
              placeholder="Please Enter The Name"
              name="name"
              type="String"
              readOnly
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('name'),
              }}
            />
            <WizardInput
              label="Father Name"
              placeholder="Please Enter The Father Name"
              name="fatherName"
              type="String"
              readOnly
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('fatherName'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Contact No"
              placeholder="Please Enter The Contact No"
              name="contactNo"
              type="Number"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('contactNo', {
                  pattern: {
                    value: /^\d{10}$/,
                    message: 'Please enter a 10-digit contact number',
                  },
                }),
              }}
            />
            <WizardInput
              label="emailId"
              placeholder="Please Enter The Email Id"
              name="emailId"
              type="string"
              readOnly
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('emailId'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Date of Birth as per Certificate (DD/MM/YYYY)"
              name="dob"
              errors={errors}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('dob', {
                  pattern: {
                    value:
                      /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/i,
                    message: 'DOB must be valid',
                  },
                }),
              }}
            />

            <WizardInput
              label="Qualification"
              placeholder="Please Enter The Qualification"
              name="qualification"
              type="string"
              readOnly
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('qualification'),
              }}
            />

          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Location"
              placeholder="Please Enter The Location"
              name="location"
              type="string"
              readOnly
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('location'),
              }}
            />
            <WizardInput
              label="Marital Status"
              name="maritalStatus"
              type="select"
              options={['Yes', 'No']}
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('maritalStatus'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Posted For"
              name="postedFor"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('postedFor'),
              }}
            />
            <WizardInput
              label="Experiences"
              placeholder="Please Enter Experiences"
              name="experiences"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('experiences'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Current Salary"
              placeholder="Please Enter Current Salary"
              name="currentSalary"
              type="number"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('currentSalary'),
              }}
            />
            <WizardInput
              label="Expected Salary"
              placeholder="Please Enter The Expected Salary"
              name="expectedSalary"
              type="number"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('expectedSalary'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Referred By"
              placeholder="Please Enter The Referred By"
              name="referredBy"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('referredBy'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <Col md={12}>
              <FileUpload
                setValue={handleChangeQuets}
                documentName="quote1"
                label="Uploade Images"
                documents={rentalDocuments}
                multiple={true}
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                <span className="ps-2">Add</span>
              </Button>
            </Col>
            <Col md={4}></Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

export default AddResume;
