const {v4: uuidv4} =require('uuid') // create unique string
const {Hashing} = require('../verification/hashing')

const forgotPasswordModel =require('../models/forgotPasswordModel')
const nodemailer= require('nodemailer')
const { resolve } = require('path')
require('dotenv').config()



let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.AUTH_EMAIL,
        pass:process.env.AUTH_PASS
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("Ready for message")
        console.log(success)
    }
})


const forgotPasswordEamil =async ({_id,email},res)=>{
    return new Promise(async(resolve,reject)=>{
        const currentUrl="http://localhost:4000/"
        let uniqueString= uuidv4()+_id
    
        const mailOptions={
            from: process.env.AUTH_EMAIL,
            to:email,
            subject:"Change your Password",
            html:`<p> Change your password to  login into your account</p>
            <p>This Link <b>expires in 6 houres</b>.</p><p>Press <a href= ${currentUrl+"user/passwordchange/"+_id+"/"+uniqueString}>here</a> to proceed</p>`
        }
        // hash the uniqueString
        uniqueString = await Hashing(uniqueString)
        const userVerification ={
            userId:_id,
            uniqueString:uniqueString,
            createdAt:Date.now(),
            expiresAt:Date.now()+21600000
        }
        await forgotPasswordModel.create(userVerification)
        transporter.sendMail(mailOptions).then(()=>{
            resolve(true)
        }).catch((error)=>{
            reject(false)
        })
    })
    
}


module.exports={forgotPasswordEamil}