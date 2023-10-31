

// Función para calcular y crear registros de amortización
const { Amortizacion, Prestamo } = require('../db.js');
const { addDays } = require('date-fns'); // Asegúrate de importar la librería de fechas que estés utilizando
const { Op } = require('sequelize');
const schedule = require('node-schedule');

// Controlador para crear registros de amortización al crear un préstamo
// Controlador para crear registros de amortización al crear un préstamo
exports.crearAmortizacion = async (prestamo, fechainicio) => {
    try {
      const amortizacion = [];
      let fechaActual = new Date(fechainicio);
  
      for (let cuota = 1; cuota <= prestamo.numeroCuotas; cuota++) {
        // Calcula la fecha de vencimiento
        const fechaVencimiento = addDays(fechaActual, prestamo.frecuenciaPago);
  
        // Determina el estado de la cuota (por defecto es "por cobrar")
        let estadoPago;
        if (cuota <= prestamo.cuotasPagadas) {
            estadoPago = 'Pagado';
        } else if (fechaActual > fechaVencimiento) {
           
            estadoPago = 'Vencido';
        } else {
            estadoPago = 'Por Cobrar';
            console.log("VENCI",fechaVencimiento)
           console.log("ACTUAL",fechaActual)
        }
  
        const cuotaAmortizacion = {
            PrestamoID: prestamo.id, // Relacionar con el préstamo
            numeroCuota: cuota,
            fechaPago: fechaVencimiento, // Establece la fecha de pago como la fecha de vencimiento
            fechaVencimiento,
            valorCuota: prestamo.valorCuota,
            estadoPago,
          };
          
  
        amortizacion.push(cuotaAmortizacion);
  
        // Avanzar la fecha para la siguiente cuota
        fechaActual = fechaVencimiento;
      }
  
      // Crea todos los registros de amortización
      await Amortizacion.bulkCreate(amortizacion);
  

      const job = schedule.scheduleJob('0 0 * * *', async function() {
        // Coloca aquí la lógica para comprobar y actualizar las cuotas vencidas
        // Puedes consultar la base de datos y actualizar el estado de las cuotas vencidas
        // Por ejemplo, puedes buscar cuotas con estado "Por Cobrar" y fecha de vencimiento menor o igual a la fecha actual
        // Luego, actualiza su estado a "Vencido"
        const vencidas = await Amortizacion.findAll({
          where: {
            estadoPago: 'Por Cobrar',
            fechaVencimiento: {
              [Op.lte]: new Date(),
            },
          },
        });
  
        // Actualiza el estado de las cuotas vencidas a "Vencido"
        for (const cuota of vencidas) {
          await cuota.update({ estadoPago: 'Vencido' });
        }
      });


      return amortizacion; // Devuelve los datos de amortización en lugar de enviar una respuesta
    } catch (error) {
      console.error(error);
      throw new Error('Error al crear los registros de amortización');
    }
  };
  



// Controlador para obtener registros de amortización por ID de préstamo
exports.getAmortizacionPorPrestamoId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const amortizacion = await Amortizacion.findAll({
        where: { PrestamoID: id },
        // Ordenar por número de cuota
      });
  
      if (!amortizacion) {
        return res.status(404).json({ error: 'Amortización no encontrada' });
      }
  
      res.json(amortizacion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la amortización' });
    }
  };
  