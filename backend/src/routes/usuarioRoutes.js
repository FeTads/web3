const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/', autenticar, usuarioController.buscarUsuarios);
router.get('/:id', autenticar, usuarioController.buscarUsuario);
router.post('/', usuarioController.criarUsuario);
router.put('/:id', autenticar, usuarioController.atualizarUsuario);
router.delete('/:id', autenticar, usuarioController.deletarUsuario);

module.exports = router;