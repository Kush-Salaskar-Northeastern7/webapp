const Sequelize = require('sequelize')
const db = require('../../db_config/db_config')

const User = db.define('users', {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
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