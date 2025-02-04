const fs = require('fs');
const path = require('path');
const { sequelize, Sequelize } = require('../db/dbConfig');

const db = {};
//use fs and path util tool to create table of all models by using file name
fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js')) // Exclude index.js and non-JS files
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      // Add each model instance to db object by its file name
      //all model names are capitalized
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

// Set the associate models between table dogs and table users
if(db.User && db.Dog) {
  db.Dog.belongsTo(db.User, { foreignKey: 'ownerId' });
  db.User.hasMany(db.Dog, { foreignKey: 'ownerId' });
}


module.exports = db;

