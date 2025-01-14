const fs = require('fs');
const path = require('path');
const { sequelize, Sequelize } = require('../db/dbConfig');

const db = {};

fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js')) // Exclude index.js and non-JS files
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      // Add model to db object using its name
      if (model && model.name) {
        db[model.name] = model;
        console.log(`Loaded model { ${model.name} } from file ${file}`);
      } else {
        console.warn(`File ${file} did not export a valid model.`);
      }
    } catch (error) {
      console.error(`Error loading model from file ${file}:`, error);
    }
  });



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

