const userRouter = require('./userRoutes')
const productRouter = require('./productRoutes')
const multer = require("multer")

module.exports = (app) => {
    app.get('/healthz', (req, res) => {
        res.json()
    })
    // app.get('/healthz1', (req, res) => {
    //     res.json()
    // })
    app.use('/v1/user', userRouter)
    app.use('/v1/product', productRouter)

    app.use((error, req, res, next) => {
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                  message: "file is too large",
                });
              }
          
              if (error.code === "LIMIT_FILE_COUNT") {
                return res.status(400).json({
                  message: "File limit reached",
                });
              }
          
              if (error.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({
                  message: "File must be an image",
                });
              }
        }
        next()
      })
}
