
module.exports = (sequelize, DataTypes) => 
    sequelize.define('User', {
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
      }
    }, {
      tableName: 'users',   
      modelName: 'User',
      timestamps: true,
    });
  
