const express = require('express');
const router = express.Router();
const {  getAmortizacionPorPrestamoId } = require('../controllers/amortizacioncontroller');




router.get('/:id', getAmortizacionPorPrestamoId)

module.exports = router;