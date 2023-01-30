const db = require('./db_config')

async function connectToDB() {
    try {
      await db.authenticate()
      if (!process.env.JEST_WORKER_ID) {
        console.log('Connection has been established successfully.')
      }
    } catch (error) {
        if (!process.env.JEST_WORKER_ID) console.error('Unable to connect to the database:', error)
    }
  }
  
  async function syncDB() {
    try {
      await db.sync({ force: false })
      if (!process.env.JEST_WORKER_ID) {
        console.log("Drop and re-sync db.")
      }
    } catch (error) {
        if (!process.env.JEST_WORKER_ID) console.error(error)
    }
  }
  
  
  module.exports = {
    connectToDB,
    syncDB
  }
  