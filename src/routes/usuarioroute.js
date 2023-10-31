const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarioController');

// Obtener todos los usuarios
router.get('', usuariosController.getUsuario);

// Crear un nuevo usuario
router.post('', usuariosController.crearUsuario);
router.patch('', usuariosController.actualizarContrasenaUsuarioUnico);
module.exports = router;
