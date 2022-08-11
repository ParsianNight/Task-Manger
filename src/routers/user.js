const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users', async (req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    } catch (e){
        res.status(500).send(e)
    }
})


router.get('/users', async (req,res) => {
    try{
        const users = await User.find({})
        if(!users)
        return res.status(404).send()
        res.send(users)
    } catch (e){
        res.status(500).send(e)
    }
})

router.get('/users/:id',async  (req,res) => {
    _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user)
        return res.status(404).send()
        res.send(user)
    } catch (e){
        res.status(500).send(e)
    }
})

router.patch('/users/:id', async (req,res) => {
    var _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
    if(!isValidOperation)
    return res.status(400).send('Err: invalid updating operation')

    try { 
        const UpdatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators: true})
        if(!UpdatedUser)
        return res.status(404).send()
        res.send(UpdatedUser)
    } catch(e) {
        res.status(500).send(e)
    }

})

router.delete('/users/:id', async (req,res) => {
    var _id = req.params.id
    try{
        const DeletedUser = await User.findByIdAndRemove(_id)
        if(!DeletedUser)
        return res.status(404).send()
        res.send(DeletedUser)
    } catch (e){
        res.status(500).send(e)
    }
})

module.exports = router