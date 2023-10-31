const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pago = sequelize.define('Pago', {
    monto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    fechaPago: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    prestamoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Pago;
};
