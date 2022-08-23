const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const bcrypt = require('bcryptjs')
const apiKey = "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"
const emails = require('../emails/account.js')

router.post('/users', async (req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        emails.sendWelcomeMail(user.email, user.name)
        res.status(201).send({user ,token})
    } catch (e){

        res.status(500).send(e)
    }
})


router.get('/users/me', auth ,async (req,res) => {
    res.send(req.user)   
})

const upload = multer({
    limits:1000000,
    fileFilter (req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error ('Please upload an image.'))
        }
        cb(undefined,true)
    }
})



router.post('/users/avatar', auth, upload.single('avatar'), async (req,res) => {
  try{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(201).send()
  } catch (e) {
    res.status(500).send("Error Man !")
  }
}, (error,req,res,next) => {
    res.status(400).send({"Error":error.message})
})

router.delete('/users/avatar',auth, async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})



router.get('/users/:id/avatar', async (req,res) => {
    try {
    const user = await User.findById(req.params.id)
    if (!user || !req.params.id){   
        throw new Error()
    }

    res.set('Content-Type','image/png')
    res.send(user.avatar)
}  catch (e) {
    res.status(404).send("Couldn't find image")
    }
})


router.patch('/users/me', auth ,async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update) =>  allowedUpdates.includes(update))
    if(!isValidOperation)
    return res.status(400).send('Err: invalid updating operation') 

    try { 
        updates.forEach((update) =>  req.user[update] =  req.body[update])
        await req.user.save()
      //  const UpdatedUser = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators: true})
        if(!req.user)
        return res.status(404).send()
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }

})

router.delete('/users/me', auth,async (req,res) => {
    try{
        await req.user.remove()
        emails.sendByeMail(req.user.email, req.user.originalname)
        res.send(req.user)
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


router.post('/users/logout', auth, async(req,res) => {
try {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
    })
    await req.user.save()
    res.send()
} catch (e) {
    res.statu(500).send()
}

})


router.post('/users/logoutall', auth ,async (req,res) => {
  try{
    req.user.tokens = []
    await req.user.save()
    res.send()
    } catch (e) {
        res.status(500).send()
    } 
})


module.exports = router