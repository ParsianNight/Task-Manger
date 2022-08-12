const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e){
        res.status(500).send(e)
    }
})


router.get('/users/me', auth ,async (req,res) => {
     res.send(req.user)
})

router.get('/users/:id',auth,async  (req,res) => {
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

router.patch('/users/:id', auth ,async (req,res) => {
    var _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
    if(!isValidOperation)
    return res.status(400).send('Err: invalid updating operation')

    try { 
        const updatedUser = await User.findById(req.params.id)
        updates.forEach((update) =>  updatedUser[update] =  req.body[update])
        await updatedUser.save()
      //  const UpdatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators: true})
        if(!updatedUser)
        return res.status(404).send()
        res.send(updatedUser)
    } catch(e) {
        res.status(500).send(e)
    }

})

router.delete('/users/:id', auth,async (req,res) => {
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


router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user , token})
    } catch (e) {
        res.status(500).send('ERROR!')
    }
})

module.exports = router