const { validationResult } = require('express-validator')
const { signUpUser, checkExistingUser } = require('../utils/userUtils')
const bcrypt = require('bcryptjs')

//Method to handle errors
const errorHandler = (message, res, errCode=500) => {
    res.status(errCode);
    res.json({error:message});
}

//method to execute when exec is successfull
const setSuccessResponse = (data, res, successCode=200) => {
    res.status(successCode);
    res.json(data);
}

const signUp = async (req, res) => {
    try {
        // express validator to check if errors
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return errorHandler(validationErrors.array(), res, 400)
        }
        // give bad request if the following fields are found
        if (req.body.account_created || req.body.account_updated || req.body.createdAt|| req.body.updatedAt || req.body.id) 
            return errorHandler(`Fields id, account_created, account_updated, updatedAt and createdAt are not accepted`, res, 400)

        // check if user exists
        const existingUser = await checkExistingUser(req.body.username)
        if (typeof existingUser === 'object' && existingUser !== null) 
            return errorHandler(`User already exists`, res, 400)

        const user = {...req.body, password: bcrypt.hashSync(req.body.password, 8)}
        const newUser = await signUpUser(user)

        // convert to json and return response without password
        const userData = newUser.toJSON()
        let {password, ...newUserData} = {...userData}
        setSuccessResponse(newUserData, res, 201)
    } catch (e) {
        errorHandler(e.message, res)
    }
}

module.exports = { signUp }