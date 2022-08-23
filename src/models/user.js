const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Task = require('../models/task')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    }, email: {
        type:String,
        unique:true,
        required:true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value))
            throw new Error('Email format is not correct.')
        }
    },
    password:{
        type: String,
        requrired: true,
        trim:true,
        minlength:7,
        validate(value) {

             if (value.toLowerCase().includes('password'))
                throw new Error('Password must be not so easy.')
        }
    },
    age : {
        type: Number,
        default:0,
        validate(value) {
            if(value < 0)
            throw new Error('Age must be a positive number')
        }
    },
    tokens : [{
        token:{
            type: String,
            required: true
        } 
    }],
    avatar: {
        type: Buffer
    }
}, {timestamps:true})

userSchema.virtual('tasks',{
    ref:'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const SECRET = process.env.JWT_SECRET
    const token =  jwt.sign({_id: user._id},SECRET,{expiresIn:'1 day'})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


userSchema.methods.toJSON =  function () {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    delete userObj._id
    delete userObj.__v
    delete userObj.avatar 
    return userObj
}


userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user)
        throw new Error('Unable to login.')
    const isMatch =  bcrypt.compare(password,user.password)
    if(!isMatch)
        throw new Error('Unable to login.')

    return user


}

userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')) {
        user.password =  await bcrypt.hash(user.password,8)
    }

    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id })
    next()
})


const User = mongoose.model('User', userSchema )

module.exports = User