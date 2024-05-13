import React from "react";
import Modal from "react-modal";
import "./App.css";

const ErrorModal = ({ isOpen, onClose, message }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Error Message">
      <h2>Error</h2>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default ErrorModal;
