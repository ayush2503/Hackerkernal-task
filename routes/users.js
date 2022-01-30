const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost/hk")
const createUserSchema=mongoose.Schema({
  name:String,
  email:{type:String,unique:true},
  mobile:String,
  tasks:[{type:mongoose.Schema.Types.ObjectId,ref:'task'}]
})

module.exports=mongoose.model('createUser',createUserSchema)
