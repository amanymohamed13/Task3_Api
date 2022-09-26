const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const auth = require('../middelware/auth')
/////////////////////////////////////////////////
router.post('/addnew', auth, (req, res) => {
    const task = new Task({ ...req.body, admin: req.admin._id })
    task.save() .then(() => 
    { res.send(task)})

    .catch((error) =>{
         res.send(error)
        })

})
/////////////////////////////////////////////////

router.get('/showTasks',auth,(req,res)=>{
    req.admin.populate('tasks')
    .then((info)=>{
        if(!info)
        {
            return res.send("no tasks founded")
        }
        res.send(info.tasks)
    }).catch((error)=>{
        res.send(error)
    })

})
///////////////////////////////////////////////
router.get('/aTask/:id', auth, (req, res) => {
    Task.findOne({ _id: req.params.id, admin: req.admin._id })
        .then((admin) => {
            if (!admin) 
            {
                return res.send('There is no tasks with this id')
             }
        res.send(admin)
        }).catch((e) =>
        
         {
            res.send(e)
        })
})
/////////////////////////////////////////////////////////
router.delete('/task/:id', auth, (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id, admin: req.admin._id })
        .then(admin => {
            if (!admin)
             {
                return res.send("There is no tasks with this id")
             }
                res.send(admin)
        }).catch(e => res.send(e))
})
/////////////////////////////////////////////////////////
router.patch('/task/:id', auth, (req, res) => {
    const admin = Task.findOneAndUpdate({ _id: req.params.id, admin: req.admin._id }, req.body,
         {
        new: true,
        runValidators: true
    })
        .then((data) => {
            if (!data) {
                return res.send('No Task has this ID')
            }

            res.send(data)
        })
        .catch(e => res.send(e))
})

module.exports = router