const express = require('express')
const router = express.Router()
const Admin = require('../models/Admin')
const multer = require('multer')
const auth = require('../middelware/auth')
///////////////////////////////////////////////
const upload = multer({

    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif|gif)$/)){
            return cb(new Error("Please upload  Images only "), null)
        }
        cb(null, true)
    }
})
/////////////////////////////////////////////////

router.post('/signup', (req, res) => {
    const admin = new Admin(req.body)
    admin.save()
    .then(() => 
    {
        const token = admin.generateToken()
        res.send({ admin, token })
    })
    .catch((e) =>{
         res.send(e.message)
        })

})
////////////////////////////////////////////////////
router.post('/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.mail, req.body.password)

        const token = admin.generateToken()
        res.send({ admin, token })
    } 
    catch (error) {
        res.send(error.message)
    }
})
//////////////////////////////////////////////////////'
router.post('/uploadImage', auth, upload.single('images'), (req, res) => {
    req.user.image = req.file.buffer
    req.user.save()
    .then(data => res.send("Done  Successfully"))
    .catch( e => res.send(e.message))
})

//////////////////////////////////////////////////////////
router.get('/showAdmin/:id', auth, (req, res) => {
    const _id = req.params.id
    Admin.findById(_id)
    .then((info) => {
        if (!info) {
            return res.send('No Id Matches')
        }
        res.send(info)
    }).catch((error) =>
    { res.send(error.message)}
    )
})
///////////////////////////////////////////////////
router.get('/showAdmins', auth, (req, res) => {
    Admin.find({})
    .then((info) => {
        res.send(info)
    }).catch((error) =>
     {
        res.send(error.message)
    })
})
//////////////////////////////////////////////////

router.patch('/admin/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const update = Object.keys(req.body)
        const admin = await Admin.findById(_id)
        if (!admin) {
            return res.send("Please Enter Valid Data")
        }
        update.for(elm => admin[elm] = req.body[elm])
        await admin.save()
        res.send(admin)
    } catch (error) {
        res.send(error.message)
    }
})
//////////////////////////////////////////////////////

router.delete('/removeAdmin/:id', auth, async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id)
        if (!admin) 
        {
            return res.send("Id Not Matches")
       
         }
      res.send(admin)
    } catch (error) {
        res.send(error.message)
    }
})
//////////////////////////////////////////////////////
router.get('/profile', auth, (req, res) => {
    res.send(req.admin)
})


module.exports = router

