
module.exports = (sequelize, DataTypes) => {

    const Dog = sequelize.define('Dog', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        ownerId:{
            type: DataTypes.UUID,
            allowNull: false,
            reference:{
                model: 'users',// Name of the table to reference
                key: 'id', // Column in User table to reference
            },
            onDelete: 'CASCADE' // If a user is deleted, delete their dogs 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.STRING,
            allowNull: true
        },
        introduction: {
            type: DataTypes.STRING,
            allowNull: true
        },
        size: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'dogs',
        modelName: 'Dog',
        timestamps: true,
    }); 

    return Dog
}