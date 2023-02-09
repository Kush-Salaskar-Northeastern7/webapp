const express = require('express')
const basicAuth = require('../middlewares/auth')
const controller = require('../controllers/productController.js')
const { body } = require('express-validator')

const router = express.Router()


//POST Route
router.route('/')
   .post(
        basicAuth,
        body('name').trim().not().isEmpty().withMessage('Name is required'),
        body('description').trim().not().isEmpty().withMessage('Description is required'),
        body('sku').trim().not().isEmpty().withMessage('SKU is required'),
        body('manufacturer').trim().not().isEmpty().withMessage('Manufacturer is required'),
        body('quantity').trim().not().isEmpty().withMessage('Quantity is required'),
        controller.addProduct
   )

router.route('/:id')
    .get(
        controller.getProduct
    )
    .put(
        basicAuth,
        body('name').trim().not().isEmpty().withMessage('Name is required'),
        body('description').trim().not().isEmpty().withMessage('Description is required'),
        body('sku').trim().not().isEmpty().withMessage('SKU is required'),
        body('manufacturer').trim().not().isEmpty().withMessage('Manufacturer is required'),
        body('quantity').trim().not().isEmpty().withMessage('Quantity is required'),
        controller.updateProduct 
     )
     .patch(
         basicAuth,
         controller.updateProductPatch
     )
     .delete(
        basicAuth,
        controller.deleteProduct
     )

module.exports = router