const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagoController');

// Obtener todos los pagos
router.get('', pagosController.getPagos);

// Crear un nuevo pago
router.post('/', pagosController.registrarPago);

module.exports = router;
