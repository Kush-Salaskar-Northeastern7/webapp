const express = require('express')
const basicAuth = require('../middlewares/auth')
const controller = require('../controllers/userController')
const { body } = require('express-validator')

const router = express.Router()


//POST Route
router.route('/')
   .post(
        body('first_name').trim().not().isEmpty().withMessage('First name is required'),
        body('last_name').trim().not().isEmpty().withMessage('Last name is required'),
        body('username').isEmail().withMessage('Email is not valid'),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'), 
        controller.signUp
   )

module.exports = router