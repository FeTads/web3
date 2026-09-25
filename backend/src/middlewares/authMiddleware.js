const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ err: 'Token não enviado' });
    }
    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch(err) {
        return res.status(401).json({ err: 'Token inválido ou expirado' });
    }
};

module.exports = { autenticar };
