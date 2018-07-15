

const db = require('mongoose');
const User = db.model("User");
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy(
    {
        // email and password should match the login form sent from client
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // default value
    },
    ( req,email, password, done ) => {
        const userData = {
            email: email.trim(),
            password: password
        }
        return User.findOne({email : userData.email})
        .then( (user) => {
            if(!user){
                const newUser = new User(userData)
                console.dir(newUser);
                return newUser.save();
            }
            else{
                let error = new Error('User Exists');
                error.name = 'UserExistsError';
                return done(error);
            }
        } )
        .then( () => {
            return done(null);
        } )
        .catch((err)=>{
            console.error(err);
            let error = new Error('SignupError');
            error.name = 'SignupError';
            return done(error);
        })
    }
)
