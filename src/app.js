const express = require('express')
require('./db/mongoose')
const UserRoutes = require('./routers/user')
const TaskRoutes = require('./routers/task')

const app = express()


app.use(express.json())
app.use(UserRoutes)
app.use(TaskRoutes)


module.exports =app