module.exports = (sequelize, DataTypes) => {
    const DogEvent = sequelize.define('DogEvent', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        puppyId: {
            type: DataTypes.UUID,
            allowNull: false,
            reference: {
                model: 'dogs',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        eventId: {
            type: DataTypes.UUID,
            allowNull: false,
            reference: {
                model: 'events',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
    }, {
        tableName: 'dog_events', // Table name can not be capitalized
        timestamps: true, 
        modelName: 'DogEvent', // Specify the model name 
    });
    return DogEvent;
};