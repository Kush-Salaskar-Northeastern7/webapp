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

const updateUserById = async (id, existingUser) => {

    return await User.update({
        account_updated: new Date(),
        first_name: existingUser.first_name,
        last_name: existingUser.last_name,
        password: existingUser.password
      }, {
        where: {
          id: id
        }
      })
}

module.exports = { signUpUser, checkExistingUser, getUserById, updateUserById }