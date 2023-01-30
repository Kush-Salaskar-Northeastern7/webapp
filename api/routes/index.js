const userRouter = require('./userRoutes')

module.exports = (app) => {
    app.get('/healthz', (req, res) => {
        res.json()
    })
    app.use('/v1/user', userRouter)
}