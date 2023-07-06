const mongoose =require('mongoose')

const liveUserSchema = new mongoose.Schema({
    userName:{
        type:String
    },


},{timestamps:true})

module.exports=mongoose.model('liveUser',liveUserSchema)