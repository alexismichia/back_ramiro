const { Estadisticas, Prestamo, Pago, sequelize } = require('../db.js');

// Obtener estadísticas generales
exports.getEstadisticasGenerales = async (req, res) => {
  try {
    const estadisticas = await Estadisticas.findOne();
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las estadísticas generales' });
  }
};

// Crear estadísticas generales (solo debe crearse una vez)
exports.crearEstadisticasGenerales = async (req, res) => {
  try {
    // Calcular el total prestado sumando todos los capitales iniciales de los préstamos
    const totalPrestado = await Prestamo.sum('capitalInicial');

    // Calcular los intereses totales sumando todos los intereses de los préstamos
    const interesesTotales = await Prestamo.sum('Intereses');

    // Calcular el monto por cobrar sumando todos los montos restantes de los préstamos
    const montoPorCobrar = await Prestamo.sum('montoRestante');

    // Calcular lo cobrado sumando todos los montos de los pagos realizados
    const loCobrado = await Pago.sum('monto');
    const cobradoTotal = loCobrado === null ? 0 : loCobrado;

    // Devuelve los datos de estadísticas generales
    const estadisticas = {
      totalPrestado,
      interesesTotales,
      pendienteCobro: montoPorCobrar,
      cobradoTotal,
    };

    res.json(estadisticas);
  } catch (error) {
    console.error(error);
    throw new Error('Error al calcular las estadísticas generales');
  }
};

