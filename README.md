# doradoraChatApp


## Overview
- In this Chat Application any authenticated and verified user can chat in a single room or can know who's online right now. And any other authenticated and verified user also can see the chat of other person.
- If a person forgot the password then he/she can able to change the password with same authenticated and verified email id.
  
  
# Backend

### Key points
- This project is divided into 3 features namely User, Messages and live users.
- I used MongoDb as a Database.



## FEATURE I - User
### Models
- User Model

```yaml
{
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

}
```

- User verification model
```yml
{
    userId:String,
    uniqueString:String,
    createdAt:Date,
    expiresAt:Date
}
```

- password change request verification model
```yml
{
    userId:String,
    uniqueString:String,
    createdAt:Date,
    expiresAt:Date
}
```

## User APIs 
- POST /signup
- POST /login
- GET /user/verify/:userId/:uniqueString     (verifiying the user through email id verification with User verification model)
- POST /forgotPassword                        (For which email user want to change password)
- GET /user/passwordchange/:userId/:uniqueString  ( this for verifying the user befor password change with password change request verification model)
- POST /:userId/changePassword              ( get new password from user to change it)


- Message Model

```yml
{
    name:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    dateTime:{
        type:String
    }

}
```

# Frontend

- For FrontEnd i used React.js

## Components that i have used to buld frontend for Dora Dora Chat Application
- Start ( If user is not Logged In then he/she will get SignIn Component)
- SignUp 
- Chat ( here i append privious chat and broadcasting messages also i can append my messages along with we will emit outgoing messages to socket.io server so, socket.io can broadcast outgoing messages to other users also)








