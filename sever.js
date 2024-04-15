
const express = require('express')
const morgan = require('morgan')
//const usersRouter = require('./router/userRouter')
const dotenv = require('dotenv')
const errors = require('./utils/error')
const Router = require('./router/Router')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')

const app = express()
dotenv.config({ path: './config.env' })

const port = process.env.PORT || 8080
app.use(express.json({ limit: "100kb" }))
app.use(morgan('dev'))
app.use(helmet())
app.use(hpp())
//กำหนดสิทธิในการเข้าถึงไฟล์ใน public
app.use(express.static('./public'))


const limiter = rateLimit({
    max: 10,
    windowMs: 15 * 60 * 1000,
    message: "too many"
})

app.use('/api/v1', Router)
//route error handling
app.all("*", (req, res) => {
    //res.status(404).json({ status: "fail", data: `path ${req.originalUrl} not found in the sever` })
    err.status = "fail"
    err.statusCode = 404
    next(err)
})

app.use(errors.ApiError)





app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})