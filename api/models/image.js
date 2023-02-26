const Sequelize = require('sequelize')
const db = require('../../db_config/db_config')

const Image = db.define('images', {
    image_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    file_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    s3_bucket_path: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date_created: {
        type: Sequelize.DATE
    },
    }, {
    createdAt: 'date_created',
})

module.exports = Image