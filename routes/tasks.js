const mongoose=require('mongoose')
const taskSchema=mongoose.Schema({
    taskname:String,
    tasktype:String,
    users:[{type:mongoose.Schema.Types.ObjectId,ref:'createUser'}],
    userss:[]
})

module.exports=mongoose.model('task',taskSchema)