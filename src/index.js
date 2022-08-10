const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const app = express()
const port = process.env.PORT || 3000 

app.use(express.json())


app.post('/users', (req,res) => {
console.log(req.body)
    const user = new User(req.body)
    user.save().then((user) => {
        res.status(201)
        res.send(user)
    }).catch((error) => {
        res.status(400)
        res.send(error)
    })
})


app.get('/users', (req,res) => {

})

app.get('/users/:id', (req,res) => {

})

app.get('/tasks', (req,res) => {

})

app.post('/tasks', (req,res) => {

})

app.patch('/users/:uuid', (req,res) => {

})

app.patch('/users/:id', (req,res) => {

})

app.listen(port, ()=> {

    console.log("Listening on port" + port)
})