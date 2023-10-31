const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Estadisticas = sequelize.define('Estadisticas', {
    totalPrestado: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    interesesTotales: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    cobradoTotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    pendienteCobro: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
   
  });

  return Estadisticas;
};
