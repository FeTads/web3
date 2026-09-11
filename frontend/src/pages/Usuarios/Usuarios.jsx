import { useState, useEffect } from 'react';
import { Plus, Search, X, Pencil, Trash2 } from 'lucide-react';
import { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../../services/usuarioService';
import UsuarioFormModal from '../../components/UsuarioFormModal/UsuarioFormModal';

function Usuarios() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [idBusca, setIdBusca] = useState('');
    const [buscaAtiva, setBuscaAtiva] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);

    const fetchUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const dados = await getUsuarios();
            setUsers(dados.data || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.err || err.message || 'Erro ao buscar usuários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleBuscarPorId = async () => {
        if (!idBusca.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const usuario = await getUsuario(idBusca.trim());
            setUsers([usuario]);
        } catch (err) {
            console.error(err);
            setUsers([]);
            setError(err.response?.data?.err || 'Usuário não encontrado');
        } finally {
            setBuscaAtiva(true);
            setLoading(false);
        }
    };

    const handleLimparBusca = () => {
        setIdBusca('');
        setBuscaAtiva(false);
        fetchUsuarios();
    };

    const handleNovoUsuario = () => {
        setUsuarioEmEdicao(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setUsuarioEmEdicao(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUsuarioEmEdicao(null);
    };

    const handleSalvar = async (dadosForm) => {
        if (usuarioEmEdicao) {
            await updateUsuario(usuarioEmEdicao.id, dadosForm);
        } else {
            await createUsuario(dadosForm);
        }

        setIsModalOpen(false);
        setUsuarioEmEdicao(null);

        if (buscaAtiva) {
            await handleBuscarPorId();
        } else {
            await fetchUsuarios();
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Tem certeza que deseja excluir este usuário?');
        if (!confirmDelete) return;

        try {
            await deleteUsuario(id);
            setUsers(users.filter((user) => user.id !== id));
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.err || err.message || 'Erro ao deletar usuário');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header-row">
                <h1>Lista de Usuários</h1>
                <button className="btn-primary" onClick={handleNovoUsuario}>
                    <Plus size={18} /> Novo Usuário
                </button>
            </div>

            <div className="busca-row">
                <input
                    type="number"
                    className="busca-input"
                    placeholder="Buscar por ID..."
                    value={idBusca}
                    onChange={(e) => setIdBusca(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleBuscarPorId()}
                />
                <button className="btn-secondary" onClick={handleBuscarPorId}>
                    <Search size={16} /> Buscar
                </button>
                {buscaAtiva && (
                    <button className="btn-secondary" onClick={handleLimparBusca}>
                        <X size={16} /> Ver todos
                    </button>
                )}
            </div>

            {loading && <div style={styles.message}>Carregando usuários...</div>}

            {error && <div style={styles.message}>Ops! {error}</div>}

            {!loading && !error && users.length === 0 && (
                <div style={styles.message}>Nenhum usuário encontrado no momento.</div>
            )}

            {!loading && !error && users.length > 0 && (
                <ul style={styles.userList}>
                    {users.map(user => (
                        <li key={user.id} style={styles.userCard}>
                            <div style={styles.userInfo}>
                                <span style={styles.userName}>{user.nome}</span>
                                <span style={styles.userEmail}>{user.email}</span>
                            </div>

                            <div style={styles.statusBadge}>
                                ID #{user.id}
                            </div>
                            <div style={styles.userActions}>
                                <button style={styles.editButton} onClick={() => handleEdit(user)}>
                                    <Pencil size={14} /> Editar
                                </button>
                                <button style={styles.deleteButton} onClick={() => handleDelete(user.id)}>
                                    <Trash2 size={14} /> Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <UsuarioFormModal
                isOpen={isModalOpen}
                usuario={usuarioEmEdicao}
                onClose={handleCloseModal}
                onSave={handleSalvar}
            />
        </div>
    );
}

const styles = {
    userList: {
        listStyleType: 'none',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
    },
    userCard: {
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBotton: '4px',
    },
    userEmail: {
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
    },
    statusBadge: {
        background: 'var(--badge-bg)',
        color: 'var(--primary-color)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    message: {
        textAlign: 'center',
        color: 'var(--text-secondary)',
        margin: '2rem 0',
        fontSize: '1.2rem',
    },
    userActions: {
        display: 'flex',
        gap: '8px',
    },
    editButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    deleteButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
}

export default Usuarios;
