const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

///////////////////////////////////////////////////////////

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength:6
    },
    mail: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    age: {
        type: Number,
        default: 25,
        validate(value) {
            if (value <= 0) {
                throw new Error('Age must be more than 0')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    image: {
        type: Buffer
    }
})
/////////////////////////////////////////////////////////
schema.pre('save', async function(){
    if (this.isModified('password')){
        this.password = await bcryptjs.hash(this.password, 8)
    }
})

schema.virtual('tasks',{
    foreignField:'admin',
    localField:'_id',
    ref:'Task'
})
schema.statics.findByCredentials = async (mail, password) => {
    const admin = await Admin.findOne({mail})
    if (!admin) {
        throw new Error("Wrong email or Password")
    }
    const Match = await bcryptjs.compare(password, admin.password)
    if (!Match) {
        throw new Error("Wrong email or Password")
    }
    return admin
}

schema.methods.generateToken = function(){
    const token = jwt.sign({_id: this._id.toString()}, 'TasksApi')
    return token
}
///////////////////////////////////////////////////
const Admin = mongoose.model('Admin', schema)

module.exports = Admin