const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/db');

class Request extends Model { };

Request.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Processing', 'Completed', 'Failed'),
        defaultValue: 'Pending',
    },
    is_webhook_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    timestamps: true,
    tableName: 'requests',
});

module.exports = Request;
