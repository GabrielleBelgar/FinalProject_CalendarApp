import React from "react";
import Modal from "react-modal";
import "./App.css";

const SuccessModal = ({ isOpen, onClose, message }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Success Message">
      <h2>Success</h2>
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default SuccessModal;
