const Sequelize = require('sequelize')
const db = require('../../db_config/db_config')

const Product = db.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    sku: {
        type: Sequelize.STRING
    },
    manufacturer: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max:100
        }
    },
    date_added: {
        type: Sequelize.DATE
    },
    date_last_updated: {
        type: Sequelize.DATE
    },
    owner_user_id: {
        type: Sequelize.INTEGER
    },
    }, {
    createdAt: 'date_added',
    updatedAt: 'date_last_updated',
})

module.exports = Product