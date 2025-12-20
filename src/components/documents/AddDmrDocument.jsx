/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import UploadService from 'api/FileUploadService';
import { toast } from 'react-toastify';
import documentAPI from 'api/document';
import { get, isEmpty } from 'lodash';
import WizardInput from 'components/wizard/WizardInput';
import { Select } from 'antd';
import FalconDropzone from 'components/common/FalconDropzone';
import Flex from 'components/common/Flex';
import cloudUpload from 'assets/cloud-upload.svg';
import { Link } from 'react-router-dom';
const AddDmrDocument = () => {
  const { user } = useAuth();
  //   const addnotificationAPI = useAPI(notificationAPI.postNotification);
  const addDmrDocumentAPI = useAPI(documentAPI.addDmrDocument);
  const { register, handleSubmit } = useForm();
  const [fileUrl, setFileUrl] = useState();
  const [dates, setDates] = useState();
  const [name, setName] = useState();
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const siteIdsOpt = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOpt.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const [currentSiteId, setCurrentSiteId] = useState();
  const handleChangeSiteId = (value) => {
    const selectedOption = siteIdsOpt.find((option) => option.value === value);
    setCurrentSiteId(get(selectedOption, 'label'));
  };
  useEffect(() => {
    if (
      get(addDmrDocumentAPI, 'data.success') &&
      !isEmpty(get(addDmrDocumentAPI, 'data.data'))
    ) {
      toast.success('Document Added successfully!', {
        theme: 'colored',
      });
    } else if (get(addDmrDocumentAPI, 'data.message')) {
      toast.error('Document Added failed', {
        theme: 'colored',
      });
    }
  }, [addDmrDocumentAPI.data]);
  const handleChangeDate = (e) => {
    setDates(e.target.value);
  };
  useEffect(() => {
    if (addDmrDocumentAPI.error) {
      toast.error('Document Added failed', {
        theme: 'colored',
      });
    }
  }, [addDmrDocumentAPI.error]);

  const uploadProfilePhoto = (selectedFiles) => {
    let currentFile = selectedFiles[0];
    const originalFileName = get(currentFile.file, 'name', '');
    const newFile = new File([currentFile.file], originalFileName, {
      type: currentFile.file.type,
    });
    setName(originalFileName);
    UploadService.upload(newFile, () => {})
      .then((response) => {
        console.log(response.data.fileUrl);
        setFileUrl(response.data.fileUrl);
        // const doc = {
        //   date: dates,
        //   employeeNumber: employeeId.toString(),
        //   employeeName: employeeName,
        //   designation: role,
        //   unitCode: unitCodes,
        //   title: 'Testing',
        //   isApproved: true,
        //   name: originalFileName,
        //   bucket: 'document',
        //   url: response.data.fileUrl,
        //   updatedBy: get(user, 'userId')
        // };
        // addDmrDocumentAPI.request(doc, get(user, 'token'));
      })
      .catch((error) => {
        console.error('File upload error:', error);
        toast.error('Could not upload the file!', {
          theme: 'colored',
        });
      });
  };

  const onSubmitData = async (data) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const employeeId = get(user, 'employeeId');
    const employeeName = get(user, 'fullName');
    const role = get(user, 'designation');
    const postData = {
      ...data,
      date: dates,
      employeeNumber: employeeId.toString(),
      employeeName: employeeName,
      designation: role,
      unitCode: currentSiteId,
      title: String(data.title),
      isApproved: true,
      name: name,
      bucket: 'document',
      url: fileUrl,
      updatedBy: get(user, 'userId'),
      createdBy: Number(userData.employeeId),
    };
    addDmrDocumentAPI.request(postData, get(user, 'token'));
  };

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add Document</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md={6}>
              <label>Date (DD/MM/YYYY)</label>
              <input
                label="Date (DD-MM-YYYY)"
                name="date"
                type="date"
                value={dates}
                onChange={handleChangeDate}
                className="form-control"
              />
              <label>Unit Code</label>
              <Select
                defaultValue={currentSiteId}
                value={currentSiteId}
                showSearch
                placeholder="Select a Unit code"
                optionFilterProp="children"
                onChange={handleChangeSiteId}
                filterOption={filterOption}
                options={siteIdsOpt}
                size="large"
                style={{ width: '100%' }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Title"
                name="title"
                type="textarea"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('title'),
                }}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={12}>
              <FalconDropzone
                files={null}
                onChange={(files) => {
                  uploadProfilePhoto(files);
                }}
                multiple={false}
                accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
                placeholder={
                  <>
                    <Flex justifyContent="center">
                      <img
                        src={cloudUpload}
                        alt=""
                        width={25}
                        className="me-2"
                      />
                      <p className="fs-0 mb-0 text-700">Add your Document</p>
                    </Flex>
                  </>
                }
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={12}>
              <Link>{fileUrl}</Link>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {addDmrDocumentAPI.loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <span className="ps-2">Save</span>
              </Button>
            </Col>
            <Col md={4}></Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

export default AddDmrDocument;
