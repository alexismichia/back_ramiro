const { Prestamo,Pago, Amortizacion } = require('../db.js');
const { crearEstadisticasGenerales } = require('./estadisticas.js'); // Asegúrate de proporcionar la ruta correcta al archivo
const {crearAmortizacion}= require("./amortizacioncontroller.js")
// Función para calcular el valor de cada cuota
function calcularValorCuota(capitalInicial, tasaInteresMensual, numeroCuotas) {
  const valorCuota = (capitalInicial + capitalInicial * tasaInteresMensual * numeroCuotas) / numeroCuotas;
  return valorCuota;
}


// Obtener todos los préstamos
exports.getPrestamos = async (req, res) => {
  try {
    const prestamos = await Prestamo.findAll();
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los préstamos' });
  }
};

// Crear un nuevo préstamo
exports.crearPrestamo = async (req, res) => {
  const { numeroCuotas, tasaInteres, mora, frecuenciaPago, capitalInicial, duracionPrestamo,fechainicio,ClienteId } = req.body;

  // Calcular el valor de cada cuota y el monto total a pagar
  const tasaInteresMensual = tasaInteres / 100; // Convertir la tasa de interés a valor decimal
  const valorCuota = calcularValorCuota(capitalInicial, tasaInteresMensual, duracionPrestamo);
  const montoTotal = valorCuota * numeroCuotas;

  // Calcular intereses
  const intereses = montoTotal - capitalInicial;

  try {
    // Crear el préstamo y asignar los intereses
    const nuevoPrestamo = await Prestamo.create({
      numeroCuotas,
      tasaInteres: parseFloat(tasaInteres), // Convertir a número
      fechainicio,
      mora,
      frecuenciaPago,
      capitalInicial,
      duracionPrestamo,
      montoTotal: parseFloat(montoTotal),
      montoRestante: parseFloat(montoTotal), // Convertir a número
      valorCuota: parseFloat(valorCuota), // Convertir a número
      Intereses: parseFloat(intereses), // Asignar los intereses
      cuotasPagadas: 0,
      ClienteId
    });


    const amortizacion = await crearAmortizacion(nuevoPrestamo, fechainicio);

    const estadisticas = await crearEstadisticasGenerales(req, res);
    res.json({ prestamo: nuevoPrestamo, estadisticas,amortizacion });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear el préstamo' });
  }
};

// Obtener un préstamo por ID
exports.getPrestamoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const prestamo = await Prestamo.findByPk(id);

    if (!prestamo) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }

    res.json(prestamo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el préstamo' });
  }
};

// Eliminar un préstamo por ID


exports.eliminarPrestamoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const prestamo = await Prestamo.findByPk(id);

    if (!prestamo) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }

    // Encuentra y elimina todos los registros de pagos relacionados con el préstamo
    await Pago.destroy({
      where: {
        prestamoId: id,
      },
    });

    // Encuentra y elimina todos los registros de amortizaciones relacionados con el préstamo
    await Amortizacion.destroy({
      where: {
        PrestamoID: id,
      },
    });

    // Elimina el préstamo
    await prestamo.destroy();

    res.json({ mensaje: 'Préstamo y sus datos asociados eliminados con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el préstamo y sus datos asociados' });
  }
};
