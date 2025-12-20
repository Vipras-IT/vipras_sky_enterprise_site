/* eslint-disable react/prop-types */

import { Modal, Button } from 'react-bootstrap';

export default function ModalDialogForm({ open, handleClose, selectRowId }) {
  let title = 'Are you sure, you want to delete this record?';

  return (
    <Modal show={open} onHide={handleClose} className="mt-4">
      <Modal.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h4 className="mb-0 text-white" id="authentication-modal-label">
            Confirmation
          </h4>
        </div>
      </Modal.Header>
      <Modal.Body className="p-4">{title}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button onClick={selectRowId} variant="primary">
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
