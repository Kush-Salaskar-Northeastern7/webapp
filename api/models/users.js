const Sequelize = require('sequelize')
const db = require('../../db_config/db_config')

const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    },
    first_name: {
        type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    account_created: {
        type: Sequelize.DATE
    },
    account_updated: {
        type: Sequelize.DATE
    }
    }, {
    createdAt: 'account_created',
    updatedAt: 'account_updated',
})

module.exports = User