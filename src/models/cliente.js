const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cliente = sequelize.define('Cliente', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    identificacion: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    direccion: {
      type: DataTypes.STRING,
    },
    referenciaPersonal: {
      type: DataTypes.STRING,
    },
  });

  return Cliente;
};
