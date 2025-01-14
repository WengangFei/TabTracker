require('dotenv').config();
//connect to data base
const { Sequelize } = require('sequelize');

//database connection setup
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, 
    logging: false
});
//test connection
(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    } 
    // finally {
    //   sequelize.close();
    // }
  })()


module.exports = { sequelize, Sequelize }; // Export the sequelize; 