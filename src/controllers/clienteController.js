const { Cliente, Prestamo, Pago, Amortizacion, sequelize, Sequelize } = require('../db.js');
const { Op } = require('sequelize');

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
};

// Crear un nuevo cliente
exports.crearCliente = async (req, res) => {
  const { nombre, correo, identificacion, direccion, referenciaPersonal } = req.body;

  try {
    if (!nombre || !correo || !identificacion) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const nuevoCliente = await Cliente.create({
      nombre,
      correo,
      identificacion,
      direccion,
      referenciaPersonal,
    });

    res.json(nuevoCliente);
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};

// Buscar clientes por nombre
exports.buscarClientePorNombre = async (req, res) => {
  const { nombre } = req.params;

  try {
    const cliente = await Cliente.findOne({
      where: {
        nombre: {
          [Op.iLike]: `%${nombre}%` // Usar el operador Sequelize Op.iLike para búsquedas con insensibilidad a mayúsculas y minúsculas
        }
      }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al buscar el cliente por nombre' });
  }
};

// Eliminar un cliente por ID


exports.eliminarClientePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Encuentra todos los préstamos relacionados con el cliente
    const prestamos = await Prestamo.findAll({
      where: {
        ClienteId: id,
      },
    });

    // Itera sobre los préstamos y elimina sus pagos y amortizaciones
    for (const prestamo of prestamos) {
      await Pago.destroy({
        where: {
          PrestamoId: prestamo.id,
        },
      });
      await Amortizacion.destroy({
        where: {
          PrestamoID: prestamo.id,
        },
      });
    }

    // Ahora puedes eliminar los préstamos del cliente
    await Prestamo.destroy({
      where: {
        ClienteId: id,
      },
    });

    // Finalmente, elimina el cliente
    await cliente.destroy();

    res.json({ mensaje: 'Cliente y sus datos asociados eliminados con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el cliente y sus datos asociados' });
  }
};

