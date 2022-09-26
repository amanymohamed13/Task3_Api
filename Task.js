const mongoose = require('mongoose')

const schema=new mongoose.Schema({
    title:{
        type:String,
        minlength:3,
        required:true
        ,trim:true
    },
    description: {
        type: String,
        minlength: 6,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    }
})
const Task=mongoose.model('Task',schema)
module.exports=Task
