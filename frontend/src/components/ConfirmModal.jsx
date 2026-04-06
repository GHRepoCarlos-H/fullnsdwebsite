import { Modal, Button } from "react-bootstrap";

function ConfirmModal({ show, onConfirm, onCancel, message }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;