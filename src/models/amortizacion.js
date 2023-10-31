const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Amortizacion = sequelize.define('Amortizacion', {
    fechaPago: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    valorCuota: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    estadoPago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Amortizacion;
};
