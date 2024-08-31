const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Database connection established successfully'))
    .catch(err => console.error('Unable to connect to the database:', err));

sequelize.sync({force:false})
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error synchronizing database:', err));

module.exports = sequelize;
