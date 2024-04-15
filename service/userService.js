const pool = require('../db/pool')
const errors = require('../utils/error')
const encrypt = require('../utils/encrypt')

exports.signUp = async (req, res, next) => {
    try {
        let body = req.body
        console.log(body)
        let sqlCheckDupUser = `select * from users 
        where username = $1`
        let responseCheckDupUser = await pool.query(sqlCheckDupUser, [body.username])
        if (responseCheckDupUser.rowCount > 0) {
            return res.status(400).json({ status: "fail", data: "User is duplicate" })
        }
        let sql = `INSERT INTO public.users
        ( first_name, last_name, email, username, userpassword, roles)
        VALUES($1,$2,$3,$4,$5,$6 );`
        let pwd = await encrypt.hashPassword(body.userpassword)
        console.log(sql)
        let response = await pool.query(sql, [body.firstname, body.lastname, body.email, body.username, pwd, body.roles])
        console.log(response)
        if (response.rowCount > 0) {
            const token = await encrypt.generateJWT({ username: body.username })
            return res.status(200).json({ status: "success", token: token, data: "insert data success" })
        } else {
            return res.status(400).json({ status: "fail", data: "insert data fail" })
        }
    } catch (error) {
        console.log(error.message)
        let err = errors.mapError(500, "internal sever error")
        next(err)
    }


}

exports.signIn = async (req, res, next) => {
    try {
        let body = req.body
        console.log(body)
        let sql = `select * from users 
        where username = $1`
        let response = await pool.query(sql, [body.username])
        console.log(response)
        if (response.rowCount > 0) {
            const isPwdValid = await encrypt.comparePassword(body.password, response.rows[0].userpassword)
            if (isPwdValid) {
                const token = await encrypt.generateJWT({ username: body.username, roles: response.rows[0].roles, userId: response.rows[0].id })
                return res.status(200).cookie('jwt', token, {
                    expires: new Date(Date.now() + (60 * 60 * 1000)),
                    httpOnly: true,
                    //secure: true
                }).json({ status: "success", token: token, data: "login data success" })
            } else {
                return res.status(401).json({ status: "fail", data: "password invalid" })
            }

        } else {
            return res.status(400).json({ status: "fail", data: "data not found" })
        }
    } catch (error) {
        console.log(error.message)
        let err = errors.mapError(500, "internal sever error")
        next(err)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        let body = req.body
        console.log(body)
        let sql = `update public.users
        set first_name=$1,last_name=$2,email=$3, username=$4, userpassword=$5, roles=$6
        where id=$7`
        let pwd = await encrypt.hashPassword(body.userpassword)
        let response = await pool.query(sql, [body.firstname, body.lastname, body.email, body.username, pwd, body.roles, req.user.userId])
        console.log(response)
        if (response.rowCount > 0) {

            return res.status(200).json({ status: "success", data: "Update data success" })

        } else {
            return res.status(400).json({ status: "fail", data: "data not found" })
        }
    } catch (error) {
        console.log(error.message)
        let err = errors.mapError(500, "internal sever error")
        next(err)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        let body = req.body
        console.log(body)
        let sql = `delete from users
        where id=$1`

        let response = await pool.query(sql, [req.user.userId])
        console.log(response)
        if (response.rowCount > 0) {

            return res.status(200).json({ status: "success", data: "delete data success" })

        } else {
            return res.status(400).json({ status: "fail", data: "data not found" })
        }
    } catch (error) {
        console.log(error.message)
        let err = errors.mapError(500, "internal sever error")
        next(err)
    }
}

exports.verifyToken = async (req, res, next) => {
    // check token
    console.log(req.headers.authorization)
    if (req.headers.authorization == null) {
        errors.mapError(401, "Token undefine")
        next()
    }
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        errors.mapError(401, "Token undefine")
        next()
    }
    //verify token
    try {
        const data = await encrypt.verifyToken(token)
        req.user = {}
        req.user.roles = data.roles
        req.user.userId = data.userId
    } catch (error) {
        console.log(error.message)
        errors.mapError(401, "token invalid")
        next()
    }
    next()
}

exports.verifyPermissionRead = async (req, res, next) => {
    const user = req.user
    if (user.roles != "user" && user.roles != "admin") {
        errors.mapError(401, "permission invalid")
        next()
    }
    console.log(user)
    next()
}

exports.verifyPermissionWrite = async (req, res, next) => {
    const user = req.user
    if (user.roles != "admin") {
        errors.mapError(401, "permission invalid")
        next()
    }
    console.log(user)
    next()
}

