const  Admin=require('../models/Admin')

const jwt=require('jsonwebtoken')
const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ', '')

        const decod=jwt.verify(token,'TasksApi')
    
        const admin = await Admin.findById({_id:decod._id})
        req.admin=admin
        next()
    }catch(error)
    {
        res.send({error:'Authorization Faild'})
    }
}
module.exports=auth