const { json } = require('body-parser')
const express = require('express')
const morgan = require('morgan')

const app = express()

const port = 8080

const fs = require('fs')

app.use(express.json())


//เข้า middleware
/*
app.use((req, res, next) => {
    console.log("hello from middleware")
    next()
})
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})
*/

app.use(morgan('dev'))
let data = JSON.parse(fs.readFileSync('./student.txt', 'utf-8'))


/*const getStudent = (req, res) => {
    res.status(200).json({ status: "success", requsetedAt: req.requestTime, data: data })
}*/
//app.get('/student', getStudent)



/*const getStudentWithParams = (req, res) => {
    let id = req.params.id
    let response = data.find((e) => e.ID == id)
    if (response) {
        res.status(200).json(response)
    } else {
        res.status(404).json({ status: "fail", message: "data not found" })
    }
}*/
//app.get('/student/:id', getStudentWithParams)




//filter value is object
/*const filterStudent = (req, res) => {
    let body = req.body
    console.log(body)
    let response = data.filter((e) => e.Name == body.name)
    res.status(200).json(response)
}*/
//app.post('/student', filterStudent)



/*const updateStudent = (req, res) => {
    if (!req.params.id) {
        res.status(404).json({ status: "fail", message: "data not found" })
    } else {
        res.status(200).json({ status: "success", data: "update successfully" })
    }
}*/
//app.patch('/student/:id', updateStudent)




/*const deleteStudent = (req, res) => {
    res.status(200).json({ status: "success", data: "delete successfully" })
}*/
//app.delete('/student/:id', deleteStudent)

//app.get('/student', getStudent)
//app.post('/student', filterStudent)
//app.get('/student/:id', getStudentWithParams)
//app.patch('/student/:id', updateStudent)
//app.delete('/student/:id', deleteStudent)

app.route('/student').get(getStudent).post(filterStudent)
app.route('/student/:id').get(getStudentWithParams).patch(updateStudent).delete(deleteStudent)

app.listen(port, () => {
    console.log("app is running on port 8080")
})