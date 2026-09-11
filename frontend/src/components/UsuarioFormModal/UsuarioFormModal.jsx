import { useState } from 'react';
import Modal from '../Modal/Modal';
import './UsuarioFormModal.css';

function UsuarioFormModal({ usuario, onClose, onSave }) {
    const [nome, setNome] = useState(usuario?.nome || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [erro, setErro] = useState(null);
    const [salvando, setSalvando] = useState(false);

    const isEdicao = Boolean(usuario);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome.trim() || !email.trim()) {
            setErro('Preencha nome e email.');
            return;
        }

        setSalvando(true);
        setErro(null);
        try {
            await onSave({ nome: nome.trim(), email: email.trim() });
        } catch (err) {
            console.error(err);
            setErro(err.response?.data?.err || 'Erro ao salvar usuário');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Modal isOpen onClose={onClose} title={isEdicao ? 'Editar Usuário' : 'Novo Usuário'}>
            <form onSubmit={handleSubmit} className="usuario-form">
                <label className="form-field">
                    <span>Nome</span>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome completo"
                        autoFocus
                    />
                </label>

                <label className="form-field">
                    <span>Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@exemplo.com"
                    />
                </label>

                {erro && <div className="form-erro">{erro}</div>}

                <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={onClose} disabled={salvando}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={salvando}>
                        {salvando ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default UsuarioFormModal;
