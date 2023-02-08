const express = require('express')
const basicAuth = require('../middlewares/auth')
const controller = require('../controllers/productController.js')
const { body } = require('express-validator')

const router = express.Router()


//POST Route
router.route('/')
   .post(
        basicAuth,
        controller.addProduct
   )

router.route('/:id')
    .get(
        controller.getProduct
    )
    .put(
        basicAuth,
        controller.updateProduct 
     )
     .delete(
        basicAuth,
        controller.deleteProduct
     )

module.exports = router