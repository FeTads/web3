const usuarioService = require('../services/usuarioService');

const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obterTodosUsuarios();
        res.status(200).json(usuarios);
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao buscar usuarios' });
    }
};

const buscarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await usuarioService.obterUsuarioPorId(id);
        if (!usuario) {
            return res.status(404).json({ err: 'Usuario não encontrado' });
        }
        res.status(200).json(usuario);
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao buscar usuario' });
    }
}

const criarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const novoUsuario = await usuarioService.criarUsuario({ nome, email, senha });
        res.status(201).json(novoUsuario);
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao criar usuario' });
    }
};

const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    try {
        const usuarioAtualizado = await usuarioService.atualizarUsuario(id, { nome, email });
        if (!usuarioAtualizado) {
            return res.status(404).json({ err: 'Usuario não encontrado' });
        }
        res.status(200).json(usuarioAtualizado);
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao atualizar usuario' });
    }
};

const deletarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioDeletado = await usuarioService.deletarUsuario(id);
        if (!usuarioDeletado) {
            return res.status(404).json({ err: 'Usuario não encontrado' });
        }
        res.status(200).json({ message: 'Usuario deletado com sucesso' });
    } catch(err) {
        res.status(500).json({ err: 'Erro interno ao deletar usuario' });
    }
};

module.exports = {
    buscarUsuarios,
    buscarUsuario,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
};