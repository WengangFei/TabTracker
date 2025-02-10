const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    confirmPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat:{
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lng:{
      type: DataTypes.FLOAT,
      allowNull: false
    },
    actualAddress: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, 
  {
    tableName: 'users',   
    modelName: 'User',
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['password', 'confirmPassword'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password', 'confirmPassword'] },
      },
    },
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, 10);
        user.confirmPassword = bcrypt.hashSync(user.confirmPassword, 10);
      },
      beforeUpdate: (user) => {
        user.password = bcrypt.hashSync(user.password, 10);
        user.confirmPassword = bcrypt.hashSync(user.confirmPassword, 10);
      },
    },
  });

  // User.prototype.printEmail = function () {
  //   console.log('Registered Email =>',this.email);
  // };

  return User;
}
    