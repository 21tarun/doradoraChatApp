import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./Chat.css"
import io from "socket.io-client";
import axios from "axios";


const socket = io.connect("http://localhost:4000");




function Chat() {
    const [message, setMessage] = React.useState("");
    const [history, setHistory] = React.useState([]);
    const [userName,setUserName]=React.useState("")
    const [liveUsers,setLiveUsers]=React.useState([])
    const navigate =useNavigate()


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          if (message.trim() !== '') {
            sendMessage(message);
          }
        }
      };

    React.useEffect(() => {
        if (!localStorage.getItem("doradoralogin")) {
            return navigate("/login");
          } else {
            setUserName( JSON.parse(localStorage.getItem("doradoralogin")).userName);
            
          }
    },[]);

    

    React.useEffect(() => {
        if (userName) socket.emit('user', userName);
    }, [userName]);

    React.useEffect(() => {
        const messageArea = document.querySelector('.message__area');
        messageArea.scrollTop = messageArea.scrollHeight;
    }, [history]);

    React.useEffect(()=>{
        async function getLiveUsers(){
            const { data } = await axios.get("http://localhost:4000"+"/getAllLiveUsers");
        
            if (data.status == false) {
              alert("we are not able to fetch privious chat")
            }
            if (data.status == true) {
                setLiveUsers(data.data)
    
            }
        }
        getLiveUsers()

    },[])


    
    function appendJoinedMessage(info,type){
        
        if(!info)return
        let mainDiv =document.createElement('div')
        let className=type
        mainDiv.classList.add(className,'message')
        let markup=`
            <p>${info} has joined the chat</p>
        `
        mainDiv.innerHTML=markup
        const messageArea = document.querySelector('.message__area');

        messageArea.appendChild(mainDiv)
        messageArea.scrollTop=messageArea.scrollHeight
    }

    React.useEffect(()=>{
        socket.on('user',async function(name){
    
            let liveUsers=document.querySelector('.live')
            liveUsers.innerHTML = '';
            
            const { data } = await axios.get("http://localhost:4000"+"/getAllLiveUsers");
        
            if (data.status == false) {
              alert("we are not able to fetch privious chat")
            }
            if (data.status == true) {
                setLiveUsers(data.data)
                appendJoinedMessage(name,'joinner')

            }
        
            
        })
    },[socket])

    function appendRemovedMessage(info,type){
    
        if(!info)return
        let mainDiv =document.createElement('div')
        let className=type
        mainDiv.classList.add(className,'message')
        let markup=`
            <p>${info} has removed the chat</p>
        `
        mainDiv.innerHTML=markup
        const messageArea = document.querySelector('.message__area');

        messageArea.appendChild(mainDiv)
        messageArea.scrollTop=messageArea.scrollHeight
    
    }
    React.useEffect(()=>{
        socket.on('disName',async function(name2){

            let liveUsers=document.querySelector('.live')
            liveUsers.innerHTML = '';

            const { data } = await axios.get("http://localhost:4000"+"/getAllLiveUsers");
        
            if (data.status == false) {
              alert("we are not able to fetch privious chat")
            }
            if (data.status == true) {
                setLiveUsers(data.data)
                appendRemovedMessage(name2,'joinner')

            }
        
        
            
        })
    },[socket])

    React.useEffect(()=>{
        for(let i=0;i<liveUsers.length;i++){
            appendLiveUser(liveUsers[i]['userName'])
        }
    },[liveUsers])

    const sendMessage = () => {
        let dummy=message
        if(dummy=="")return
        dummy=dummy.trim()
        if(dummy=="")return
        console.log(dummy)
        socket.emit("message", { "message":dummy, "user":userName });

        let copy_msg={message:dummy}
        let mainDiv =document.createElement('div')
        copy_msg.user='You'
        let className='outgoing'
        mainDiv.classList.add(className,'message')
        let markup=`
            <h4>${copy_msg.user}</h4>
            <p>${copy_msg.message}</p>
            <h6>${dateTime}</h6>
        `
        mainDiv.innerHTML=markup
        
        const messageArea = document.querySelector('.message__area');
        if (messageArea) {
          messageArea.appendChild(mainDiv);
          messageArea.scrollTop=messageArea.scrollHeight
        }
        setMessage("")
    
    };






    
    React.useEffect(()=>{
        socket.on("message", (msg) => {
            if(msg.message){
                let copy_msg={...msg}
                let mainDiv =document.createElement('div')
        
                let className='incoming'
                mainDiv.classList.add(className,'message')
                let markup=`
                    <h4>${copy_msg.user}</h4>
                    <p>${copy_msg.message}</p>
                    <h6>${dateTime}</h6>
                `
                mainDiv.innerHTML=markup

                const messageArea = document.querySelector('.message__area');
                if (messageArea) {
                  messageArea.appendChild(mainDiv);
                  messageArea.scrollTop=messageArea.scrollHeight
                }
                
                
            }
    
        });
    },[socket])

    function appendLiveUser(name){
        if(!name)return
        let mainDiv=document.createElement('div')
        mainDiv.classList.add('user')
        let markup=`
            <li>${name}</li>
        `
        mainDiv.innerHTML=markup
        let liveUsers=document.querySelector('.live')
        
        liveUsers.appendChild(mainDiv)
        
    }

    let dateTime = new Date();
    const formattedDate = dateTime.toLocaleDateString('en-IN');
    const formattedTime = dateTime.toLocaleTimeString('en-IN');
    dateTime=formattedDate +" "+formattedTime

    React.useEffect(()=>{
        async function getchatdata(){
            const { data } = await axios.get("http://localhost:4000"+"/dataInHighSecurity");
        
            if (data.status == false) {
              alert("we are not able to fetch privious chat")
            }
            if (data.status == true) {
                setHistory(data.data)
    
            }
        }
        getchatdata()
    },[])

    
  return (
    <div className='chatArea'>
        <section class="user__section">
            <div class="brand">
                
                <h5>Chat Anonymously</h5>
            </div>
            <div class="liveusers">
                <div class="head">
                    <h4>people online</h4>
                </div>
                <div class="live">


                    
                </div>
            </div>

        </section>
        <section class="chat__section">
            <div class="brand2">
                <h1>{userName} say, dora dora</h1>
                <button type="button" class="btn btn-danger logoutbtn" onClick={()=>{localStorage.removeItem('doradoralogin');window.location.reload()}}>Logout</button>
            </div>
            <div class="message__area" >
            {history.map((c,i)=>
                c.name == userName ?
                <div className='outgoing message'>
                        <h4>You</h4>
                        <p>{c.message}</p>
                        <h6>{c.dateTime}</h6>
   
                </div>:
                <div className='incoming message'>
                        <h4>{c.name}</h4>
                        <p>{c.message}</p>
                        <h6>{c.dateTime}</h6>


                </div>

                
            )}

            </div>

            <div class="txtarea">
                <textarea type="text" id="textarea" cols="30" rows="1" value={message} placeholder="write a message.." onChange={(e)=>setMessage(e.target.value)} onKeyDownCapture={handleKeyPress}/>
                <button type="button" name="button" id="button" cols="30" rows="1" onClick={()=>sendMessage()} >send</button>
            </div>
            
        </section>
    </div>
  )
}

export default Chat