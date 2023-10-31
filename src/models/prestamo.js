const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Prestamo = sequelize.define('Prestamo', {
    capitalInicial:{
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fechainicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    numeroCuotas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cuotasPagadas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tasaInteres: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mora: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    frecuenciaPago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    montoTotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    valorCuota: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    montoRestante: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    Intereses: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  });

  return Prestamo;
};
