import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { login } from '../../services/authService';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState(null);
    const [entrando, setEntrando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !senha) {
            setErro('Preencha email e senha.');
            return;
        }

        setEntrando(true);
        setErro(null);
        try {
            const dados = await login(email.trim(), senha);
            localStorage.setItem('token', dados.token);
            navigate('/');
        } catch (err) {
            console.error(err);
            setErro(err.response?.data?.err || 'Erro ao fazer login');
            setEntrando(false);
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit} className="login-card">
                <div className="brand login-brand">
                    <Activity size={28} color="var(--primary-color)" />
                    WEB III
                </div>

                <label className="login-field">
                    <span>Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@exemplo.com"
                        autoFocus
                    />
                </label>

                <label className="login-field">
                    <span>Senha</span>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Sua senha"
                    />
                </label>

                {erro && <div className="login-erro">{erro}</div>}

                <button type="submit" className="btn-primary" disabled={entrando}>
                    {entrando ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}

export default Login;
