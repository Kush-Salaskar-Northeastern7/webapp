const User = require('../models/users')


//Creating a new user
const signUpUser = async (user) => {
    return await User.create(user)
}

//Check for existing user
const checkExistingUser = async (username) => {
    return await User.findOne({ where: { username: username } })
}

const getUserById = async (id) => {
    try {
        const user = await User.findOne({
            where: {
              id: id
            }
          })
        return user
    } catch (error) {
        return null
    }
}

module.exports = { signUpUser, checkExistingUser, getUserById }