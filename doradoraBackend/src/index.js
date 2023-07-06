const express =require('express')
const app = express()
const http =require('http')
const socket =require('socket.io')
const route =require('./routes/route')
const cors = require('cors')
const path=require('path')
// const path=require('path')
const mongoose = require('mongoose')
const messageModel =require('./models/messageModel')
const liveUsersModel=require('./models/liveUserModel')
app.use(cors())
require('dotenv').config()
app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'));


const server= http.createServer(app)


mongoose.set("strictQuery",true)

app.use(express.urlencoded());
app.use(express.json());



app.use('/',route)











mongoose.connect(process.env.MONGODB_STR,{
    useNewUrlParser:true
})
.then(function(){
    console.log("mongodb connected")
    // here socket will work on this "server" server


    const io = new socket.Server(server, {
        cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        },
    });

    io.on('connection',function(socket){
        console.log('new connection....')


        var name2
        socket.on('message',function(msg){
            console.log(msg)
            
            socket.broadcast.emit('message',msg)
            var data={}
            data.name=msg.user
            data.message=msg.message

            const dateTime = new Date();

            const formattedDate = dateTime.toLocaleDateString('en-IN');
            

            const formattedTime = dateTime.toLocaleTimeString('en-IN');
            
            data.dateTime=formattedDate +" "+formattedTime
            console.log(data)
            messageModel.create(data)
        })
        socket.on('user',async function(name){
            console.log(name)
            let findUser= await liveUsersModel.findOne({userName:name})

            if(!findUser)await liveUsersModel.create({userName:name})
            name2=name

            socket.broadcast.emit('user',name)
        })

        socket.on('disconnect', async (name) => {
            console.log('Disconnected from Socket.IO server');
            console.log(name2)
            await liveUsersModel.deleteMany({userName:name2})

            // Perform any necessary cleanup or actions here
            socket.broadcast.emit('disName',name2)

        });

    })

})
.catch((err)=>console.log(err))


server.listen(4000, function(){
    console.log("server is running ",4000)
})