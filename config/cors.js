
const { WHITELIST_DOMAINS } = require('../utils/constants')
const { StatusCodes } = require('http-status-codes')
const ApiError = require('../utils/ApiError')

 const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.BUILD_MODE === 'dev') {
      return callback(null, true)
    }

    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    return callback(null, true)


  },

  optionsSuccessStatus: 200,

  credentials: true
}

module.exports ={corsOptions}