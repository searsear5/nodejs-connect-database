const bcrypt = require('bcrypt')
const errors = require('../utils/error')
var jwt = require('jsonwebtoken')

exports.hashPassword = async (plaintextPassword, next) => {
    if (plaintextPassword) {
        try {
            const hash = await bcrypt.hash(plaintextPassword, 10)
            return hash
        } catch (error) {
            console.log(error.message)
            errors.mapError(500, "internal sever error",)
            next()
        }
    }
    return null


}

exports.generateJWT = async (data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
    return token
}


exports.comparePassword = async (plaintextPassword, hash) => {
    const result = await bcrypt.compare(plaintextPassword, hash)
    return result
}

exports.verifyToken = async (token) => {
    const result = jwt.verify(token, process.env.JWT_SECRET)
    return result
}
