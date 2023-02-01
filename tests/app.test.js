const supertest = require('supertest')
const app = require('../api/app')
const db = require('../db_config/db_config')

const api = supertest(app)

// describe('Test Database Connection', () => {
//     test('Connection should be established successfully', async () => {
//       try {
//         await db.authenticate()
//         console.log('Connection has been established successfully.')
//       } catch (error) {
//         console.error('Unable to connect to the database:', error)
//       }
//     })
    
//     test('DB should be dropped and re-synced', async () => {
//       try {
//         await db.sync({ force: false })
//         console.log("Drop and re-sync db.")
//       } catch (error) {
//         console.error(error)
//       }
//     })
//   })

describe('Checking server health', () => {
    test('HTTP Status code is 200, OK', async () => { 
        await api
        .get('/healthz')
        .expect(200)
    })
})