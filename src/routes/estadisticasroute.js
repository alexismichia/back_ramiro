const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticas');

// Rutas para estadísticas generales
router.get('', estadisticasController.getEstadisticasGenerales);
router.post('', estadisticasController.crearEstadisticasGenerales);



module.exports = router;
