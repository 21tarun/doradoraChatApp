const mongoose =require('mongoose')

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        
    },
    verified:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

module.exports=mongoose.model('user',userSchema)