import type { ReactNode } from 'react';

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

const Modal = ({ children, onClose }: ModalProps) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close dialog">
        ×
      </button>
      {children}
    </div>
  </div>
);

export default Modal;

