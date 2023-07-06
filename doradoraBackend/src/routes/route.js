const express= require('express')
const router= express.Router()
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer= require('nodemailer')
const {v4: uuidv4} =require('uuid') // create unique string

let userModel= require('../models/userModel')
let userVerificationModel= require('../models/userVerificationModel')
let forgotPasswordModel= require('../models/forgotPasswordModel')
let messageModel =require('../models/messageModel')
let liveUserModel = require('../models/liveUserModel')

const {Hashing} = require('../verification/hashing')
const {sendVerificationEmail}  = require('../verification/emailVerification')
const {forgotPasswordEamil}= require('../verification/forgotPassword')



router.post('/signUp',async function(req,res){
    let {userName, email, password}= req.body
    
    if(!userName|| !email || !password ){
        return res.json({status:false,message:"Empty input fields"})
    }
    userName=userName.trim()
    email =email.trim()
    password= password.trim()
    
    if(userName=="" || email=="" || password=="" ){
        return res.json({status:false,message:"Empty input fields"})
    }
    email=email.toLowerCase()
    userName=userName.toLowerCase()

    if (!validator.isEmail(email)) {
        return res.json({ status: false, message: "please enter valid email address!" })

    }

    if(password.length<8){
        return res.json({status:false,message:"password is too short"})
    }

    if(await userModel.findOne({email:email})){
        return res.json({status:false,message:"email already exist"})
    }
    if(await userModel.findOne({userName:userName})){
        return res.json({status:false,message:"userName already exist"})
    }

    // encrypt the password
    password= await Hashing(password)

    const saveData=await userModel.create({userName,email,password})
    
    if(sendVerificationEmail(saveData,res))return res.json({status:true,message:"Verification email sent", data:saveData})
    else {
        await userModel.deleteMany({_id:saveData._id})
        await userVerificationModel.deleteMany({userId:saveData._id})
        res.json({status:false,message:"please try to register again"})
    }


})

router.post('/login',async function(req,res){
    let {email,password}=req.body
    if(!email) return res.json({status:false,message:"email is required"})
    if(!password) return res.json({status:false,message:"password is required"})
    email=email.trim()
    if(!email) return res.json({status:false,message:"email is required"})
    email=email.toLowerCase()
    

    let findUser= await userModel.findOne({email:email})
    if(!findUser) return res.json({status:false,message:"email or password is not correct "})

    bcrypt.compare(password, findUser.password, async function (err, result) {  // Compare
        // if passwords match
        if (result) {
            if(!findUser.verified){
                sendVerificationEmail(saveData,res)
                return res.json({status:false,message:"you need to verify your email"})
            }
            else{
                let token = jwt.sign({ userId: findUser._id }, "Secret-key")
                return res.json({ status: true, message: "User loginned successfully", data: { userName:findUser.userName,userId: findUser._id, token:token } })
            }
            
        
        }
        // if passwords do not match
        else {
          return res.json({ status: false, message: "user credential is wrong" })
        }
    })

    


})

router.get("/user/verify/:userId/:uniqueString",async function(req,res){
    
    let {userId,uniqueString}=req.params
    const user =await userVerificationModel.findOne({userId:userId})
    if(!user){
        return res.json({status:false,message:"An error occurred while checking for existing user verification record"})
    }
    bcrypt.compare(uniqueString, user.uniqueString, async function (err, result) {  // Compare
        // if passwords match
        if (result) {
          if(user.expiresAt<Date.now()){
            return res.json({status:false,message:"varification link expired"})
          }
          await userModel.findOneAndUpdate({_id:userId},{verified:true})
          return res.render('verified')
        
        }
        // if passwords do not match
        else {
          return res.json({ status: false, message: "verification failed" })
        }
    })
})


router.get("/user/passwordchange/:userId/:uniqueString",async function(req,res){
    
    let {userId,uniqueString}=req.params
    const user =await forgotPasswordModel.findOne({userId:userId})
    if(!user){
        return res.json({status:false,message:"An error occurred while checking for existing user verification record"})
    }
    bcrypt.compare(uniqueString, user.uniqueString, async function (err, result) {  // Compare
        // if passwords match
        if (result) {
          if(user.expiresAt<Date.now()){
            return res.json({status:false,message:"change password link expired"})
          }
          
          return res.render('changePassword',{userId})
        }
        // if passwords do not match
        else {
          return res.json({ status: false, message: "verification failed" })
        }
      })
})


router.post('/forgotPassword',async function(req,res){
    let {email} =req.body
    
    if (!validator.isEmail(email)) {
        return res.json({ status: false, message: "please enter valid email address!" })

    }
    let findUser= await userModel.findOne({email:email})
    if(!findUser) return res.json({status:false,message:"Email not Registered"})

    if(findUser.verified==false){
        sendVerificationEmail(findUser,res)
        return res.json({status:false,message:"your email is not verified, first verified your email"})
    }

    if(forgotPasswordEamil(findUser,res)){
        res.json({status:true,message:"forgot password email sent"})
    }
    else{
        await forgotPasswordModel.deleteMany({userId:findUser._id})
        res.json({status:false,messaage:"forgot password email failed try again"})

    }



})

router.post('/:userId/changePassword',async function(req,res){
    let {newPassword,confirmPassword}=req.body
    if(newPassword!=confirmPassword) return res.json({message:"password not matching"})
    let userId= req.params.userId
    // encrypt the password
    newPassword= await Hashing(newPassword)
    await userModel.findOneAndUpdate({_id:userId},{password:newPassword})
    await forgotPasswordModel.deleteMany({userId:userId})
    res.json({message:"password changed successfully"})
})


router.get('/dataInHighSecurity',async function (req,res){
    const data =await messageModel.find().sort({dateTime:1})
    res.json({status:true,data:data})

})


router.get('/getAllLiveUsers',async function(req,res){
    const allLiveUsers= await liveUserModel.find()
    res.json({status:true,data:allLiveUsers})

})



module.exports=router