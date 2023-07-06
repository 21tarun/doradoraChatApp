const bcrypt = require('bcrypt')

// password hashing
const Hashing =async function(str){
    return new Promise((resolve, reject) => {
        const saltRounds = 10 //default
        bcrypt.hash(str, saltRounds, function (err, hash) {
    
          if (err) return  reject(res.json({ status: false, message: "invalid password" }))
          else return resolve(hash)
            
        });
    })
}

module.exports={Hashing}
