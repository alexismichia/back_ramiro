const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamoController');


// Obtener todos los préstamos
router.get('', prestamosController.getPrestamos);

// Crear un nuevo préstamo
router.post('', prestamosController.crearPrestamo);

router.get('/:id', prestamosController.getPrestamoPorId);
router.delete('/eliminar/:id', prestamosController.eliminarPrestamoPorId)

module.exports = router;
