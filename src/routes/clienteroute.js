const express = require('express');
const router = express.Router();

// Importa el controlador de clientes
const clienteController = require('../controllers/clienteController');

// Rutas para los clientes
router.get('', clienteController.getClientes);
router.get('/:id', clienteController.getClienteById);
router.post('', clienteController.crearCliente);
router.get('/buscar/:nombre', clienteController.buscarClientePorNombre);
router.delete('/eliminar/:id', clienteController.eliminarClientePorId);
module.exports = router;
