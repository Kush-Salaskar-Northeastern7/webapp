const userRouter = require('./userRoutes')
const productRouter = require('./productRoutes')

module.exports = (app) => {
    app.get('/healthz', (req, res) => {
        res.json()
    })
    app.use('/v1/user', userRouter)
    app.use('/v1/product', productRouter)
}