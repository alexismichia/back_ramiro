const {Pago} = require('../db.js');
const {Prestamo, Amortizacion}= require('../db.js')
const { Op } = require('sequelize');
// Obtener todos los pagos
exports.getPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pagos' });
  }
};

// Registrar un nuevo pago
// Registrar un nuevo pago
exports.registrarPago = async (req, res) => {
  const { prestamoId, fechaPago } = req.body;

  try {
    // Buscar el préstamo por ID
    const prestamo = await Prestamo.findByPk(prestamoId);

    if (!prestamo) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }

    // Verificar si hay cuotas pendientes
    if (prestamo.numeroCuotas === prestamo.cuotasPagadas) {
      return res.status(400).json({ error: 'El préstamo ya ha sido completamente pagado' });
    }

    // Calcular el monto de la cuota del préstamo
    const montoCuota = prestamo.valorCuota;

    // Crear el pago con el monto de la cuota y la fecha proporcionada
    const nuevoPago = await Pago.create({
      monto: montoCuota,
      fechaPago,
      prestamoId,
    });

    // Actualizar el préstamo restando una cuota y el monto del pago al saldo
    
    prestamo.montoRestante -= montoCuota;
    prestamo.cuotasPagadas += 1;

    // Verificar si el préstamo se ha pagado completamente
    

    // Guardar los cambios en el préstamo
    await prestamo.save();
    const cuotasPendientes = await Amortizacion.findAll({
      where: {
        PrestamoID: prestamoId,
        estadoPago: 'Por Cobrar',
        fechaPago: { [Op.lte]: fechaPago },
      },
    });

    // Actualiza el estado y fecha de pago de las cuotas pendientes
    for (const cuota of cuotasPendientes) {
      cuota.estadoPago = 'Pagado';
      cuota.fechaPago = fechaPago;
      await cuota.save();
    }

    res.json(nuevoPago);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al registrar el pago' });
  }
};
