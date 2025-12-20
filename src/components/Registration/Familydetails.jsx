/* eslint-disable react/prop-types */
import { useState, useContext } from 'react';
import { get, set } from 'lodash';
import PropTypes from 'prop-types';
import Flex from 'components/common/Flex';
import FalconDropzone from 'components/common/FalconDropzone';
import { isIterableArray } from 'helpers/utils';
import avatarImg from 'assets/avatar.png';
import Avatar from 'components/common/Avatar';
import cloudUpload from 'assets/cloud-upload.svg';
import { RegistrationContext } from 'context/Context';
import { Col, Row } from 'react-bootstrap';
import UploadService from 'api/FileUploadService';
import RecentPurchases from './family-details/RecentPurchases';
import { toast } from 'react-toastify';
import ModalAuth from './ModalAuth';
import ModalDialogForm from './ModalDialog';

const Familydetails = ({ setValue, empDocuments }) => {
  const { employee, setEmployee } = useContext(RegistrationContext);
  const familyvalue = get(employee, 'familyDetails', []);
  const familyPhotoUrl =
    get(empDocuments, 'family_photo', undefined) || avatarImg;
  const familyPhotoOtherUrl =
    get(empDocuments, 'family_photo_other', undefined) || avatarImg;
  const [familyPhoto, setFamilyPhoto] = useState([{ src: familyPhotoUrl }]);
  const [familyPhotoOther, setFamilyPhotoOther] = useState([
    { src: familyPhotoOtherUrl },
  ]);

  const [show, setShow] = useState(false);
  const [dialog, setdialog] = useState(false);
  const [dataValue, setDataValue] = useState(familyvalue);
  const [ids, setId] = useState(0);
  const [action, setAction] = useState('');
  const [griddata, setEditdata] = useState([]);

  const handleModel = () => {
    setAction('add');
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setdialog(false);
  };

  const deleteConfirm = () => {
    setDataValue(dataValue.filter((data) => data.id !== ids));
    setdialog(false);
  };

  const deleteRecords = (id) => {
    setdialog(true);
    setId(id);
  };

  const editRecord = (rec) => {
    setAction('edit');
    setEditdata(rec);
    setShow(true);
  };

  const loadData = (enterData, id) => {
    if (id != null) {
      const newState = dataValue.map((obj) => {
        if (obj.id === id) {
          return {
            id: id,
            name: enterData.name,
            relation: enterData.relation,
            dob: enterData.dob,
            occupation: enterData.occupation,
            aadharNumber: enterData.aadharNumber,
          };
        }

        return obj;
      });
      setDataValue(newState);
      set(employee, 'familyDetails', newState);
    } else {
      dataValue.push(enterData);
      setDataValue(dataValue);
      set(employee, 'familyDetails', dataValue);
    }
    setEmployee(employee);
  };

  const uploadProfilePhoto = (selectedFiles, documentName) => {
    let currentFile = selectedFiles[0];
    const originalFileName = get(currentFile.file, 'name', '');
    const newFile = new File([currentFile.file], originalFileName, {
      type: currentFile.file.type,
    });
    UploadService.upload(newFile, () => {})
      .then((response) => {
        setValue(`documents.${documentName}`, response.data.fileUrl);
      })
      .catch(() => {
        toast.error('Could not upload the file!', {
          theme: 'colored',
        });
      });
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={6} className="text-center">
          <div style={{ width: '200px', height: '150px', display: 'flex' }}>
            <Avatar
              size="4x1"
              src={
                isIterableArray(familyPhoto)
                  ? familyPhoto[0]?.base64 || familyPhoto[0]?.src
                  : ''
              }
              rounded="false"
            />
          </div>
        </Col>
        <Col md={6}>
          <FalconDropzone
            files={familyPhoto}
            onChange={(files) => {
              setFamilyPhoto(files);
              uploadProfilePhoto(files, 'family_photo');
            }}
            multiple={false}
            accept="image/*"
            placeholder={
              <>
                <Flex justifyContent="center">
                  <img src={cloudUpload} alt="" width={25} className="me-2" />
                  <p className="fs-0 mb-0 text-700">Upload your family photo</p>
                </Flex>
              </>
            }
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6} className="text-center">
          <div style={{ width: '200px', height: '150px', display: 'flex' }}>
            <Avatar
              size="4x1"
              src={
                isIterableArray(familyPhotoOther)
                  ? familyPhotoOther[0]?.base64 || familyPhotoOther[0]?.src
                  : ''
              }
              rounded="false"
            />
          </div>
        </Col>
        <Col md={6}>
          <FalconDropzone
            files={familyPhotoOther}
            onChange={(files) => {
              setFamilyPhotoOther(files);
              uploadProfilePhoto(files, 'family_photo_other');
            }}
            multiple={false}
            accept="image/*"
            placeholder={
              <>
                <Flex justifyContent="center">
                  <img src={cloudUpload} alt="" width={25} className="me-2" />
                  <p className="fs-0 mb-0 text-700">
                    Upload your other family photo
                  </p>
                </Flex>
              </>
            }
          />
        </Col>
      </Row>
      <Row>
        <RecentPurchases
          handleValue={dataValue}
          handleModel={handleModel}
          updateRecord={editRecord}
          selectRowId={deleteRecords}
        ></RecentPurchases>
      </Row>
      <Row>
        <ModalAuth
          open={show}
          handleData={loadData}
          handleClose={handleClose}
          typeofaction={action}
          moveRecord={griddata}
        />
      </Row>
      <Row>
        <ModalDialogForm
          open={dialog}
          handleClose={handleClose}
          selectRowId={deleteConfirm}
        />
      </Row>
    </>
  );
};

Familydetails.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default Familydetails;
