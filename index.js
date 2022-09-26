const express=require('express')
require('./db/mongose')
const app=express()
const port =3000
const adminsRouter=require('./routers/admin')
const tasksRouter=require('./routers/task')
app.use(express.json())
app.use(adminsRouter)
app.use(tasksRouter)
app.listen(port,()=>
{
    console.log("Server Is Runing")
})
