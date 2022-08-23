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


// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
//     // One Way to do it .. 
//     // const task = await Task.findById('62f832b376c36b4f6e7acf54')
//     // await task.populate('owner')
//     // console.log(task)
    // Other Way..
//     const user = await User.findById('62f8304c332fca66a8e7ccb7')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }
// main()
 

