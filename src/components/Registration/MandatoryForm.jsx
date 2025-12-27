/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import WizardInput from '../wizard/WizardInput';
import Flex from 'components/common/Flex';
import FalconDropzone from 'components/common/FalconDropzone';
import { isIterableArray } from 'helpers/utils';
import avatarImg from 'assets/avatar.png';
import Avatar from 'components/common/Avatar';
import cloudUpload from 'assets/cloud-upload.svg';
import { Col, Row } from 'react-bootstrap';
import FileUpload from 'components/upload/FileUpload';
import UploadService from 'api/FileUploadService';
import { get, forIn, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useAuth } from 'hooks/useAuth';
const MandatoryForm = ({ register, errors, setValue, empDocuments }) => {
  const profilePhotoUrl =
    get(empDocuments, 'profilePhotoUrl', undefined) || avatarImg;
  ``;
  const [avatar, setAvatar] = useState([{ src: profilePhotoUrl }]);
  const { user } = useAuth();

  const uploadProfilePhoto = (selectedFiles) => {
    let currentFile = selectedFiles[0];
    const originalFileName = get(currentFile.file, 'name', '');
    const newFile = new File([currentFile.file], originalFileName, {
      type: currentFile.file.type,
    });
    UploadService.upload(newFile, (event) => { })
      .then((response) => {
        setValue('documents.profilePhotoUrl', response.data.fileUrl);
      })
      .catch(() => {
        toast.error('Could not upload the file!', {
          theme: 'colored',
        });
      });
  };

  useEffect(() => {
    if (!isEmpty(empDocuments)) {
      const currentDate = new Date(get(empDocuments, 'joiningDate'));
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const year = String(currentDate.getFullYear());

      const formattedDateString = `${year}-${month}-${day}`;
      setValue('documents.joiningDate', formattedDateString);
    }
    if (isEmpty(empDocuments)) {
      const currentDate = new Date();
      // Extract day, month, and year
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
      const year = String(currentDate.getFullYear());

      const formattedDateString = `${year}-${month}-${day}`;

      setValue('documents.joiningDate', formattedDateString);
    }
  }, [empDocuments]);
  const voterIdDocs = [];
  const aadharCardDocs = [];
  const markSheetDocs = [];
  if (!isEmpty(empDocuments)) {
    forIn(empDocuments, (value, key) => {
      if (key.startsWith('voter_id')) {
        voterIdDocs.push(value);
      }
      if (key.startsWith('aadhar_card')) {
        aadharCardDocs.push(value);
      }
      if (key.startsWith('mark_sheet')) {
        markSheetDocs.push(value);
      }
    });
  }

  return (
    <>
      <Row className="mb-3">
        <Col md={6} className="text-center">
          <Avatar
            size="4xl"
            src={
              isIterableArray(avatar) ? avatar[0]?.base64 || avatar[0]?.src : ''
            }
            rounded="false"
          />
        </Col>
        <Col md={6}>
          <FalconDropzone
            files={avatar}
            onChange={(files) => {
              setAvatar(files);
              uploadProfilePhoto(files);
            }}
            multiple={false}
            accept="image/*"
            placeholder={
              <>
                <Flex justifyContent="center">
                  <img src={cloudUpload} alt="" width={25} className="me-2" />
                  <p className="fs-0 mb-0 text-700">Upload your photo</p>
                </Flex>
              </>
            }
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6} className="text-center">
          <FileUpload
            setValue={setValue}
            documentName="profile_video"
            label="Upload your video"
            documents={[get(empDocuments, 'profile_video', '')]}
          />
        </Col>
        <Col md={6}>
          <FileUpload
            setValue={setValue}
            documentName="police_verification_certificate"
            label="Police Verification Certification"
            documents={[
              get(empDocuments, 'police_verification_certificate', ''),
            ]}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6} className="text-center">
          <FileUpload
            setValue={setValue}
            documentName="right_finger_print"
            label="Upload your right finger print"
            documents={[get(empDocuments, 'right_finger_print', '')]}
          />
        </Col>
        <Col md={6}>
          <FileUpload
            setValue={setValue}
            documentName="left_finger_print"
            label="Upload your left finger print"
            documents={[get(empDocuments, 'left_finger_print', '')]}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <FileUpload
            setValue={setValue}
            documentName="voter_id"
            label="Upload your Voter Id"
            documents={voterIdDocs}
            multiple={true}
          />
        </Col>
        <Col md={6}>
          <FileUpload
            setValue={setValue}
            documentName="driving_licence"
            label="Upload your Driving Licence"
            documents={[get(empDocuments, 'driving_licence', '')]}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <FileUpload
            setValue={setValue}
            documentName="pan_card"
            label="Upload your PAN card"
            documents={[get(empDocuments, 'pan_card', '')]}
          />
        </Col>
        <Col md={6}>
          <FileUpload
            setValue={setValue}
            documentName="aadhar_card"
            label="Upload your Aadhar card"
            documents={aadharCardDocs}
            multiple={true}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <FileUpload
            setValue={setValue}
            documentName="mark_sheet"
            label="Upload your Mark Sheet"
            documents={markSheetDocs}
            multiple={true}
          />
        </Col>
        <Col md={6}>
          <FileUpload
            setValue={setValue}
            documentName="other_documents"
            label="Upload your other documents if any"
            documents={[get(empDocuments, 'other_documents', '')]}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <WizardInput
            errors={errors}
            label="Voter Id"
            name="documents.voterId"
            formGroupProps={{ as: Col, sm: 12 }}
            formControlProps={{
              ...register('documents.voterId'),
            }}
          />
        </Col>
        <Col md={6}>
          <WizardInput
            errors={errors}
            label="Driving Licence No"
            name="drivingLicenceNumber"
            formGroupProps={{ as: Col, sm: 12 }}
            formControlProps={{
              ...register('documents.drivingLicenceNumber'),
            }}
          />
        </Col>
        <Col md={6}></Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <WizardInput
            errors={errors}
            label="PAN Card number"
            name="panCardNumber"
            formGroupProps={{ as: Col, sm: 12 }}
            formControlProps={{
              ...register('documents.panCardNumber'),
            }}
          />
        </Col>
        <Col md={6}>
          <WizardInput
            errors={errors}
            label="Mark Sheet"
            name="markSheet"
            formGroupProps={{ as: Col, sm: 12 }}
            formControlProps={{
              ...register('documents.markSheet'),
            }}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <WizardInput
            errors={errors}
            label="Other documents"
            name="others"
            formGroupProps={{ as: Col, sm: 12 }}
            formControlProps={{
              ...register('documents.others'),
            }}
          />
        </Col>
        <Col md={6}>
          <WizardInput
            errors={errors}
            label="Other documents 1"
            name="others"
            formGroupProps={{ as: Col, sm: 12 }}
            formControlProps={{
              ...register('documents.others1'),
            }}
          />
        </Col>
      </Row>
      <Row className="g-2 mb-3">
        {/* <WizardInput
          label="Joining Date (DD/MM/YYYY)"
          name="documents.joiningDate"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          type="date"
          formControlProps={{
            ...register('documents.joiningDate', {
              pattern: {
                value:
                  /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/i,
                message: 'Joining Date must be valid'
              },
              disabled: isEmpty(empDocuments)
            })
          }}
        /> */}
        <Col md="6">
          <label>Date Of Join (DD-MM-YYYY)</label>
          <input
            label="Date (DD-MM-YYYY)"
            name="documents.joiningDate"
            type="date"
            className="form-control"
            {...register('documents.joiningDate')}
          />
        </Col>
        <WizardInput
          errors={errors}
          label="Basic Salary"
          formGroupProps={{ as: Col, sm: 6 }}
          name="documents.basicSalary"
          // type="number"
          formControlProps={{
            ...register('documents.basicSalary', {
            }),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          errors={errors}
          label="DA"
          formGroupProps={{ as: Col, sm: 6 }}
          name="documents.da"
          // type="number"
          formControlProps={{
            ...register('documents.da', {
            }),
          }}
        />
        <WizardInput
          errors={errors}
          label="HRA"
          formGroupProps={{ as: Col, sm: 6 }}
          name="documents.hra"
          // type="number"
          formControlProps={{
            ...register('documents.hra', {
            }),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          errors={errors}
          label="Other Allowance"
          formGroupProps={{ as: Col, sm: 6 }}
          name="documents.otherAllowance"
          // type="number"
          formControlProps={{
            ...register('documents.otherAllowance', {
            }),
          }}
        />
        <WizardInput
          label="ESI Number"
          name="documents.esiNumber"
          errors={errors}
          type="number"
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('documents.esiNumber', {
              pattern: {
                value: /[0-9]{10}/,
                message: 'ESI Number must be valid',
              },
              minLength: {
                value: 10,
                message: 'ESI No must be valid',
              },
              maxLength: {
                value: 10,
                message: 'ESI No must be valid',
              },
            }),
          }}
        />
      </Row>
      <Row className="g-2 mb-3">
        <WizardInput
          errors={errors}
          label="UAN Number"
          formGroupProps={{ as: Col, sm: 6 }}
          name="documents.pfNumber"
          type="number"
          formControlProps={{
            ...register('documents.pfNumber', {
              pattern: {
                value: /[0-9]{12}/,
                message: 'UAN Number must be valid',
              },
              minLength: {
                value: 12,
                message: 'UAN Number must be valid',
              },
              maxLength: {
                value: 12,
                message: 'UAN Number must be valid',
              },
            }),
          }}
        />
        <WizardInput
          label="Appraisal Date (DD/MM/YYYY)"
          name="documents.appraisalDate"
          errors={errors}
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('documents.appraisalDate', {
              pattern: {
                value:
                  /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/i,
                message: 'Appraisal Date must be valid',
              },
            }),
          }}
        />
      </Row>
      {/* <Row className="g-2 mb-3">
        <WizardInput
          label="PF Percentage"
          name="documents.pfPercentage"
          errors={errors}
          type="number"
          formGroupProps={{ as: Col, sm: 6 }}
          formControlProps={{
            ...register('documents.pfPercentage'),
          }}
        />
        <WizardInput
          errors={errors}
          label="ESI Percentage"
          formGroupProps={{ as: Col, sm: 6 }}
          name="documents.esiPercentage"
          type="number"
          formControlProps={{
            ...register('documents.esiPercentage'),
          }}
        />
      </Row> */}
      <Row className="g-2 mb-3">
        <WizardInput
          errors={errors}
          label="Appraisal Amount"
          type="number"
          formGroupProps={{ as: Col, sm: 6 }}
          name="documents.appraisalAmount"
          formControlProps={{
            ...register('documents.appraisalAmount', {
              pattern: {
                value: /[0-9]/,
                message: 'Appraisal Amount must be valid',
              },
            }),
          }}
        />
      </Row>
    </>
  );
};

MandatoryForm.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  setValue: PropTypes.func.isRequired,
};

export default MandatoryForm;
