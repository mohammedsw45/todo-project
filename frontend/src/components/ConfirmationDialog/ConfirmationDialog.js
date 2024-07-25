import React from 'react';
import './ConfirmationDialog.css'; 

const ConfirmationDialog = (props) => {
  if (!props.show) return null;

  return (
    <div className="confirmation-dialog">
      <div className="dialog-content">
        <h2>{props.message}</h2>
        <div className="dialog-buttons">
          <button onClick={props.onConfirm}>Yes</button>
          <button onClick={props.onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
