/* eslint-disable react/prop-types */

import { CloseButton, Modal } from 'react-bootstrap';
import PreEmpForm from 'components/authentication/PreviousEmpForm';

export default function ModelAuthFamily({
  open,
  handleClose,
  handleData,
  moveRecord,
  typeofaction,
}) {
  return (
    <Modal show={open} onHide={handleClose} className="mt-4">
      <Modal.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h4 className="mb-0 text-white" id="authentication-modal-label">
            Previous Employment Details
          </h4>
        </div>
        <CloseButton
          variant="white"
          className="position-absolute end-0 me-2 mt-2 top-0"
          onClick={handleClose}
        />
      </Modal.Header>
      <Modal.Body className="p-4">
        <PreEmpForm
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
}
