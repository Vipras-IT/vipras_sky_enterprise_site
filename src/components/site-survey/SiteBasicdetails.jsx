import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import WizardInput from 'components/wizard/WizardInput';
import FileUpload from 'components/upload/FileUpload';

const SiteBasicdetails = ({ register, errors, setValue }) => {
  return (
    <>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Site Survey No"
          name="sitesurveyno"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('sitesurveyno'),
          }}
        />
        <WizardInput
          label="Site Name"
          name="sitename"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('sitename'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Location"
          name="location"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('location'),
          }}
        />
        <WizardInput
          label="Nature of Industry"
          name="natureofindustry"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('natureofindustry'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="Builder Name"
          name="buildername"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('buildername'),
          }}
        />
        <WizardInput
          label="Type of Building"
          name="typeofbuilding"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('typeofbuilding'),
          }}
        />
      </Row>

      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Tower/Block"
          name="nooftowerblock"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('buildername'),
          }}
        />
        <WizardInput
          label="No of Floor"
          type="number"
          name="nooffloor"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('nooffloor'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No of Basement"
          name="noofbasement"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofbasement'),
          }}
        />
        <WizardInput
          label="No of Flat"
          name="noofflat"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofflat'),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          label="No Of Flat Each Floor"
          name="noofflatechfloor"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofflatechfloor'),
          }}
        />
        <WizardInput
          label="No Of Stair Case"
          name="noofstaircase"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('noofstaircase'),
          }}
        />
      </Row>

      <Row className="g-2 mb-3">
        <WizardInput
          label="Floor Type"
          type="floortype"
          name="floortype"
          placeholder="Select your floor type."
          options={['Tiles', 'Granite']}
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('floortype'),
          }}
        />
        <WizardInput
          label="Client Name"
          name="clientname"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('clientname'),
          }}
        />
      </Row>
      <Row className="mb-3">
        <WizardInput
          label="Client Designation"
          name="clientdesignation"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('clientdesignation'),
          }}
        />
        <WizardInput
          label="Contact Number"
          name="contactnumber"
          type="number"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('contactnumber'),
          }}
        />
      </Row>
      <Row className="mb-3 align-center">
        <Col md={6}>
          <WizardInput
            label="Email Id"
            name="emailid"
            errors={errors}
            formGroupProps={{ as: Col, sm: 12 }}
            formControlProps={{
              ...register('emailid'),
            }}
          />
        </Col>
        <Col md={6}>
          <FileUpload
            employeeNumber={'1234'}
            setValue={setValue}
            documentName="site_image"
            label="Upload your Site Image"
          />
        </Col>
      </Row>
    </>
  );
};

SiteBasicdetails.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
  setValue: PropTypes.func,
};

export default SiteBasicdetails;
