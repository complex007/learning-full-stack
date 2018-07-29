const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../config/config.json');
// middleware
// check if the token is valid,
// if valid, call "next" to send the news
// otherwise, return error
module.exports= (req,res) => {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }
    let jwtToken = req.headers.authorization.split(" ")[1];
    return jwt.verify(jwtToken,config.jwtSecret)
    .then( (decoded) => {
        let id = decoded.sub;
        return User.findById(id) 
    })
    .then( (user) => {
        if(user){
            return res.json('ok');
        }
        else{
            return res.status(401).end(); 
        }
    })
    .catch((err)=>{
        console.error("verify fail");

    })
    



}