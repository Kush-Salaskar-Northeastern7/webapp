const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const db  = require('../db_config/db_config')
const routes = require('./routes/index')

const app = express()

db.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.");
});

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

routes(app)

module.exports = app

