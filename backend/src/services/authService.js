const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const login = async (email, senha) => {
    const usuario = await Usuario.scope('comSenha').findOne({ where: { email } });
    if (!usuario || !usuario.senha) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }
    const confere = await bcrypt.compare(senha, usuario.senha);
    if (!confere) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }
    const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return { token, usuario: { id: usuario.id, nome: usuario.nome } };
};

module.exports = { login };
