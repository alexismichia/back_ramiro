// Controlador para Usuario

const {Usuario} = require('../db.js');

// Obtener información de usuario
exports.getUsuario = (req, res) => {
  

  Usuario.findByPk(1)
    .then((usuario) => {
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      return res.json(usuario);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la información del usuario' });
    });
};

// Crear un nuevo usuario
exports.crearUsuario = (req, res) => {
  const { name, contrasena } = req.body;

  Usuario.create({
    name,
    contrasena,
  })
    .then((nuevoUsuario) => {
      res.json(nuevoUsuario);
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: 'Error al crear el usuario' });
    });
};
// Actualizar la contraseña del usuario único
exports.actualizarContrasenaUsuarioUnico = (req, res) => {
  const { contrasenaActual, nuevaContrasena } = req.body;

  Usuario.findByPk(1) // La ID del usuario único es 1
    .then((usuario) => {
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar si la contraseña actual coincide
      if (usuario.contrasena !== contrasenaActual) {
        return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
      }

      usuario.contrasena = nuevaContrasena; // Actualizar la contraseña del usuario

      return usuario.save()
        .then((usuarioActualizado) => {
          res.json(usuarioActualizado);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Error al actualizar la contraseña del usuario' });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error al obtener la información del usuario' });
    });
};
