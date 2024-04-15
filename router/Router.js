const express = require('express')
const CustomerService = require('../service/customerService')
const usersService = require('../service/userService')

const Router = express.Router()
//usersRouter.param('id', usersService.checkID)
Router.route('/customer/').get(usersService.verifyToken, usersService.verifyPermissionRead, CustomerService.getAllCustomers).post(usersService.verifyToken, usersService.verifyPermissionRead, CustomerService.createCustomer)
Router.route('/customer/:id').get(usersService.verifyToken, usersService.verifyPermissionRead, CustomerService.getCustomerById).patch(usersService.verifyToken, usersService.verifyPermissionRead, CustomerService.updateCustomer).delete(usersService.verifyToken, usersService.verifyPermissionWrite, CustomerService.deleteCustomerBYId)

Router.route('/users/').post(usersService.signUp)
    .patch(usersService.verifyToken, usersService.updateUser)
    .delete(usersService.verifyToken, usersService.deleteUser)
Router.route('/users/login').post(usersService.signIn)


module.exports = Router