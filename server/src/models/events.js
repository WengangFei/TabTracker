module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        ownerId: {
            type: DataTypes.UUID,
            allowNull: false,
            reference: {
                model: 'users',
                key: 'id',
                onDelete: 'CASCADE'
            }
        },
        eventName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creator: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false
        },
        agreeTerms: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },{
        tableName: 'events',
        timestamps: true,
        modelName: 'Event'
    });
    return Event;
}