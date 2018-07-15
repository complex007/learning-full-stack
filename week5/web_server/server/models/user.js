const bcrypt = require('bcrypt');
const Mongodb = require('mongoose');

const UserSchema = new Mongodb.Schema({
    email: {
        type: String,
        index:{ "unique": true}
    },
    password: {
        type: String
    }
});

UserSchema.methods.comparePassword = function(password){
    // password: passed by client
    // this.password: hashed password after adding salt
    return bcrypt.compare(password,this.password);
};
UserSchema.pre('save',function(){
    const user = this;
    //new user or modified password
    if (user.isModified('password')){
        return bcrypt.genSalt((salt)=>{
            return bcrypt.hash(user.password,salt);
        })
        .then(((hash)=>{
            return Promise.resolve(user.password = hash);
        }))
    }
})
module.exports = Mongodb.model('User',UserSchema);