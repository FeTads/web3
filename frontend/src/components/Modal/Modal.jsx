import { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

function Modal({ isOpen, title, onClose, children }) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-box" role="dialog" aria-modal="true" aria-label={title}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Fechar">
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
