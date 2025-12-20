/* eslint-disable react/prop-types */

import { CloseButton, Modal } from 'react-bootstrap';
import TenantEmployeeForm from './TenantEmployeeForm';

const ModelTenantEmployee = ({
  open,
  handleClose,
  handleData,
  moveRecord,
  typeofaction,
}) => {
  return (
    <Modal show={open} onHide={handleClose} className="mt-4">
      <Modal.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h4 className="mb-0 text-white" id="authentication-modal-label">
            Tenant Employee Details
          </h4>
        </div>
        <CloseButton
          variant="white"
          className="position-absolute end-0 me-2 mt-2 top-0"
          onClick={handleClose}
        />
      </Modal.Header>
      <Modal.Body className="p-4">
        <TenantEmployeeForm
          layout="split"
          handleData={handleData}
          handleClose={handleClose}
          editform={moveRecord}
          actiontype={typeofaction}
          hasLabel
        />
      </Modal.Body>
    </Modal>
  );
};

export default ModelTenantEmployee;
