const express = require('express')
require('./db/mongoose')
const UserRoutes = require('./routers/user')
const TaskRoutes = require('./routers/task')

const app = express()
const port = process.env.PORT


app.use(express.json())
app.use(UserRoutes)
app.use(TaskRoutes)


app.listen(port, ()=> {
})

