const pool = require('../db/pool')
const errors = require('../utils/error')

exports.getAllCustomers = async (req, res, next) => {
    try {
        let sql = 'select * from public.customer'
        let response = await pool.query(sql)
        console.log(response)
        if (response.rowCount > 0) {
            res.status(200).json({ status: "success", data: response.rows })
        } else {
            res.status(400).json({ status: "fail", data: "data not found" })
        }
    } catch (error) {
        console.log(error.message)
        let err = errors.mapError(500, "internal sever error")
        next(err)

    }


}
exports.createCustomer = async (req, res, next) => {
    try {
        let body = req.body
        console.log(body)
        let sql = `INSERT INTO public.customer
( firstname, lastname, email, city, job)
VALUES( '${body.firstname}', '${body.lastname}', '${body.email}', '${body.city}', '${body.job}');`
        console.log(sql)
        let response = await pool.query(sql)
        console.log(response)
        if (response.rowCount > 0) {
            res.status(200).json({ status: "success", data: "insert data success" })
        } else {
            res.status(400).json({ status: "fail", data: "insert data fail" })
        }
    } catch (error) {
        console.log(error.message)
        let err = errors.mapError(500, "internal sever error")
        next(err)
    }


}
exports.getCustomerById = async (req, res, next) => {
    try {
        let sql = 'select * from customer where customerid = $1'
        let { id } = req.params
        id = Number(id)
        if (Number.isNaN(id)) {
            let err = errors.mapError(400, "request param invalid type")
            return next(err)
        }
        let response = await pool.query(sql, [id])
        console.log(response)
        if (response.rowCount > 0) {
            res.status(200).json({ status: "success", data: response.rows })
        } else {
            let err = errors.mapError(404, "find data not found",)
            return next(err)

        }
    } catch (error) {
        console.log(error.message)
        let err = errors.mapError(500, "internal sever error")
        next(err)
    }


}
exports.updateCustomer = async (req, res, next) => {
    try {
        let { id } = req.params
        id = Number(id)
        if (Number.isNaN(id)) {
            let err = errors.mapError(400, "request param invalid type")
            return next(err)
        }
        let body = req.body
        let sql = `update customer
    set firstname = $2,lastname = $3,email = $4,city=$5,job=$6
    where customerid = $1 `
        console.log(sql)
        let response = await pool.query(sql, [id, body.firstname, body.lastname, body.email, body.city, body.job])
        console.log(response)
        if (response.rowCount > 0) {
            res.status(200).json({ status: "success", data: 'update data success' })
        } else {
            let err = errors.mapError(404, "find data not found",)
            return next(err)
        }
    } catch (error) {
        console.log(error.message)
        let err = errors.mapError(500, "internal sever error")
        next(err)
    }


}
exports.deleteCustomerBYId = async (req, res, next) => {
    try {
        let { id } = req.params
        id = Number(id)
        if (Number.isNaN(id)) {
            let err = errors.mapError(400, "request param invalid type")
            next(err)
        }
        let sql = `delete from customer where customerid = $1`
        let response = await pool.query(sql, [id])
        if (response.rowCount > 0) {
            res.status(200).json({ status: "success", data: "delete success" })
        } else {
            let err = errors.mapError(404, "find data not found",)
            return next(err)
        }
    } catch (error) {
        console.log(error.message)
        let err = errors.mapError(500, "internal sever error")
        next(err)
    }


}
exports.checkID = (req, res, next, val) => {
    if (Number(val) <= 0) {
        res.status(400).json({ status: "success", data: "bad request" })
    } else {
        next()
    }
}
exports.checkID2 = (req, res, next) => {
    console.log(req.params.id)
    if (Number(req.params.id) <= 0) {
        res.status(400).json({ status: "success", data: "bad request" })
    } else {
        next()
    }
}