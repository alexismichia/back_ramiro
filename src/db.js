require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DATABASE_URL
} = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false,
  },
  dialectOptions: {
    ssl: {
      require: true, // Obliga el uso de SSL
      rejectUnauthorized: false, // Ajusta esto según tus necesidades
    },
  },
});

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, 'models'))
  .filter((file) => file.slice(-3) === '.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, 'models', file));
    modelDefiners.push(model(sequelize));
  });

// Define las relaciones entre modelos aquí
const { Cliente, Prestamo, Pago, Estadisticas, Usuario,Amortizacion } = sequelize.models;

Cliente.hasMany(Prestamo);
Prestamo.belongsTo(Cliente);
Prestamo.hasMany(Pago);
Pago.belongsTo(Prestamo);
Amortizacion.belongsTo(Prestamo, { foreignKey: 'PrestamoID' });
module.exports = {
  conn: sequelize,
  Cliente,
  Prestamo,
  Pago,
  Estadisticas,
  Usuario,
  Amortizacion
};
