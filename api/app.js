const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const db  = require('../db_config/db')
const routes = require('./routes/index')

const app = express()

db.connectToDB()
db.syncDB()


app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

routes(app)

module.exports = app

