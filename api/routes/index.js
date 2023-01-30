const userRouter = require('./userRoutes')

module.exports = (app) => {
    app.use('/v1/user', userRouter)
}