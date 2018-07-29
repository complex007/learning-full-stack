const jwt = require('jsonwebtoken');
const db = require('mongoose');
const User = db.model("User");
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config/config.json');

module.exports = new PassportLocalStrategy(
    {
        // email and password should match the login form sent from client
        usernameField: 'email',
        passwordField: 'password',
        session: false, // default value
        passReqToCallback: true // default value
    },
    ( req, email, password, done ) => {
        const userData = {
            email: email.trim(),
            password: password
        }
        return User.findOne({email : userData.email})
        .then( (user) => {
            if(user){
                return user.comparePassword(userData.password,user.password)
                .then( (isMatched) => {
                    if (!isMatched) {
                        // when password not match, set error message
                        let error = new Error('Incorrect email or password');
                        error.name = 'IncorrectCredentialsError';
                        return done(error);
                    }
                    const payload = {
                        sub: user._id // mongodb internal id
                    };
                    // create a token string
                    const token = jwt.sign(payload, config.jwtSecret);
                    return done(null, token, null);
                } )
            }
            else{
                let error = new Error('Incorrect email or password');
                error.name = 'IncorrectCredentialsError';
                return done(error);
            }
        } )
        .catch((err)=>{
            console.error(err);
            let error = new Error('LoginError');
            error.name = 'LoginError';
            return done(error);
        })
    }
)
