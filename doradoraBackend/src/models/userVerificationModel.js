const mongoose =require('mongoose')
const userVerificationSchema = new mongoose.Schema({
    userId:String,
    uniqueString:String,
    createdAt:Date,
    expiresAt:Date
})

module.exports = mongoose.model('user2Verification',userVerificationSchema)