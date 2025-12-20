/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { get, set, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import Employment from './previous-employment/Employment';
import ModelAuthFamily from './ModalAuthFamily';
import { RegistrationContext } from 'context/Context';
import ModalDialogForm from './ModalDialog';

const PreviousEmployment = ({ register, errors, watch }) => {
  const [show, setShow] = useState(false);
  const [dialog, setdialog] = useState(false);
  const [ids, setId] = useState(0);
  const { employee, setEmployee } = useContext(RegistrationContext);
  const [griddata, setEditdata] = useState([]);
  const [action, setAction] = useState('');

  const previousEmployeement = get(employee, 'previousEmployerDetails', []);

  const [dataValue, setDataValue] = useState(previousEmployeement);

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
            preEmployer: enterData.preEmployer,
            refWhom: enterData.refWhom,
            duration: enterData.duration,
            reasForLeave: enterData.reasForLeave,
          };
        }

        return obj;
      });

      setDataValue(newState);
      set(employee, 'previousEmployerDetails', newState);
    } else {
      dataValue.push(enterData);
      setDataValue(dataValue);
      set(employee, 'previousEmployerDetails', dataValue);
    }

    /* if (isEmpty(previousEmployeement)) {
      set(employee, 'previousEmployerDetails', [enterData]);
    } else {
      set(employee, 'previousEmployerDetails', [enterData]);
      employee.previousEmployerDetails.concat(enterData);
    } */
    setEmployee(employee);
  };
  let dataVAlueTemp = [];
  if (!isEmpty(dataValue)) {
    dataVAlueTemp = dataValue.map((item, index) => {
      return {
        sno: index + 1,
        ...item,
      };
    });
  }

  return (
    <>
      <Row>
        <Employment
          handleData={dataVAlueTemp}
          handleModel={handleModel}
          updateRecord={editRecord}
          selectRowId={deleteRecords}
        />
      </Row>
      <Row>
        <ModelAuthFamily
          typeofaction={action}
          moveRecord={griddata}
          open={show}
          handleData={loadData}
          handleClose={handleClose}
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

PreviousEmployment.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default PreviousEmployment;
