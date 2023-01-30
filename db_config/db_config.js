const Sequelize = require('sequelize')

//connect to postgres server
const db = new Sequelize('postgres', 'postgres', 'password', {
    host:  '127.0.0.1' || 'localhost',
    dialect: 'postgres',
    operatorsAlias: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

module.exports = db;