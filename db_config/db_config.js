const Sequelize = require('sequelize')

//connect to postgres server
const db = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER_NAME}`, `${process.env.DB_PASSWORD}`, {
    host:  `${process.env.DB_ADDRESS}` || 'localhost',
    dialect: 'postgres',
    logging: false,
    operatorsAlias: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

module.exports = db