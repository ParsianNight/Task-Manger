const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/tasks', auth, async (req,res) => {
    try{
       // alternative down const tasks = await Task.find({owner: req._id})
        const match = {}
        if (req.query.completed){
            match.completed = req.query.completed === 'true'
        }
        const sort = {} 
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split('_')
            sort[parts[0]] = parts[1] ==='desc' ? -1 : 1
        }

       await req.user.populate({
        path: 'tasks',
        match,
        options:{
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
       })

        res.send(req.user.tasks)
    } catch (e){
        res.status(500).send(e)
    }
})

router.post('/tasks',auth, async (req,res) => {
    //const task = new Task(req.body)
    // es6 feature!
    const task = new Task ({
        ...req.body,
        owner: req._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    } catch (e){
        res.status(500).send(e)
    }



})

router.get('/tasks/:id',auth, async (req,res) => {
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req._id})
        if(!task)
        return res.status(404).send()
        res.status(201).send(task)
    } catch (e){
        res.status(500).send(e)
    }
})


router.patch('/tasks/:id',auth, async  (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
    if(!isValidOperation)
    return res.status(400).send('Err: invalid updating operation')
    
    try { 
        const updatedTask = await Task.findOne({_id: req.params.id, owner: req._id})
        if(!updatedTask)
        return res.status(404).send()

        updates.forEach((update) => {
            updatedTask[update] = req.body[update]
        })
        await updatedTask.save()
        
        res.send(updatedTask)
    } catch(e) {
        res.status(500).send(e)
    }

})



router.delete('/tasks/:id', auth, async (req,res) => {

    

try{
        const DeletedTask = await Task.findOneAndDelete({_id: req.params.id, owner: req._id})
        if(!DeletedTask)
        return res.status(404).send()
        res.send(DeletedTask)
    } catch (e){
        res.status(500).send(e)
    }
})

module.exports =  router