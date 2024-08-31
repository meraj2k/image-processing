const { DataTypes,Model } = require('sequelize');
const sequelize = require('../utils/db');
const Request = require('./request');

class Product extends Model { };
Product.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    request_id: {
        type: DataTypes.UUID,
        references: {
            model: Request,
            key: 'id',
        },
    },
    serial_number: DataTypes.INTEGER,
    product_name: DataTypes.STRING,
    input_image_urls: DataTypes.TEXT,
    output_image_urls: DataTypes.TEXT,
    status: {
        type: DataTypes.ENUM('Pending', 'Processing', 'Completed', 'Failed'),
        defaultValue: 'Pending',
    },
}, {
    sequelize,
    timestamps: true,
    tableName: 'products',
    indexes: [
        {
            name: 'idx_status',
            fields: ['status']
        },
        {
            name: 'idx_request_id_status',
            fields: ['request_id', 'status']
        }
    ]
});

Request.hasMany(Product, { foreignKey: 'request_id' });
Product.belongsTo(Request, { foreignKey: 'request_id' });

module.exports = Product;
