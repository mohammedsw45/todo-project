import React from 'react';
import './ConfirmationDialog.css'; 

const ConfirmationDialog = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="confirmation-dialog">
      <div className="dialog-content">
        <h2>Are you sure you want to delete this user?</h2>
        <div className="dialog-buttons">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
