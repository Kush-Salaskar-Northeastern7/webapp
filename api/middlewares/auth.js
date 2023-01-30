const auth = require('basic-auth')

const authenticate = (req, res, next) => {
    const credentials = auth(req)
  
    if (!credentials) {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm="Access to the API"')
      res.end('Access denied')
    } else {
      next()
    }
  }

  module.exports = authenticate
  