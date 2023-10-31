const express = require('express');
const router = express.Router();
const clienteRoutes = require('./clienteroute');
const prestamoRoutes = require('./prestamosroute');
const pagoRoutes = require('./pagoroute');
const estadisticasRoutes = require('./estadisticasroute');
const usuarioRoutes = require('./usuarioroute');
const amortizacionroute =require('./amortizacionroute')
router.use('/clientes', clienteRoutes);
router.use('/prestamos', prestamoRoutes);
router.use('/pagos', pagoRoutes);
router.use('/estadisticas', estadisticasRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/amortizacion', amortizacionroute);
module.exports = router;
