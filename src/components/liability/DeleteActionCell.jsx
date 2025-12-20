import React, { useState } from 'react';
import { Card, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import resume from '../../api/resume';
import CardDropdown from 'components/common/CardDropdown';
import { getErrorMessage } from '../../helpers/utils';
import { toast } from 'react-toastify'; // Ensure this is imported

export const DeleteActionCell = ({ row }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const id = get(row.values, 'id', '');

  const handleDeleteClick = () => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {

    console.log(`Deleting liability with ID: ${deleteId}`);
    
    try {
      const data = await resume.deleteLiability(deleteId).then((res) => res.data);
      if (data.success === false) {
        toast.error(data.message, { theme: 'colored' });
      } else {
        setShowConfirm(false);
        toast.success("Deleted successfully", { theme: 'colored' });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage, { theme: 'colored' });
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  return (
    <>
      <CardDropdown iconClassName="fs--1" drop="start">
        <div className="py-2">
          <Dropdown.Item
            as={Link}
            onClick={handleDeleteClick}
            className="text-warning"
          >
            Delete
          </Dropdown.Item>
        </div>
      </CardDropdown>

      {showConfirm && (
        <Card
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1050,
            width: '300px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            backgroundColor: '#fff',
          }}
          className="p-3"
        >
          <div className="mb-2 fw-bold text-center">
            Are you sure you want to delete?
          </div>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Yes
            </Button>
            <Button variant="secondary" size="sm" onClick={cancelDelete}>
              No
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};
