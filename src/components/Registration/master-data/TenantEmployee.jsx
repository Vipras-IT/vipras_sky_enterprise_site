/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';

import TenantEmployeeHeader from './TenantEmployeeHeader';
import ModelTenantEmployee from './ModelTenantEmployee';

import ModalDialogForm from '../ModalDialog';

const TenantEmployee = ({ tenantEmployeeList, setTenantEmployeeList }) => {
  const [show, setShow] = useState(false);
  const [dialog, setdialog] = useState(false);
  const [ids, setId] = useState(0);
  const [griddata, setEditdata] = useState([]);
  const [action, setAction] = useState('');

  const [dataValue, setDataValue] = useState(tenantEmployeeList);

  const handleModel = () => {
    setAction('add');
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setdialog(false);
  };

  const deleteConfirm = () => {
    const newRecord = dataValue.filter((data) => data.id !== ids);
    setDataValue(newRecord);
    setTenantEmployeeList(newRecord);
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
            date: enterData.date,
            employeeId: enterData.employeeId,
            employeeName: enterData.employeeName,
            remarks: enterData.remarks,
          };
        }

        return obj;
      });

      setDataValue(newState);
      setTenantEmployeeList(newState);
    } else {
      dataValue.push(enterData);
      setDataValue(dataValue);
      setTenantEmployeeList(dataValue);
    }
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

  useEffect(() => {
    setDataValue(tenantEmployeeList);
  }, [tenantEmployeeList]);

  return (
    <>
      <Row className="g-2 mb-3">
        <TenantEmployeeHeader
          handleData={dataVAlueTemp}
          handleModel={handleModel}
          updateRecord={editRecord}
          selectRowId={deleteRecords}
          type="Tenant"
        />
      </Row>
      <Row>
        <ModelTenantEmployee
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

TenantEmployee.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
};

export default TenantEmployee;
