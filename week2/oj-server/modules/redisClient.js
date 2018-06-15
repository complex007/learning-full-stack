const redis = require('redis');
const client = redis.createClient();
function set(key,value,callback){
    client.set(key,value,(err,res)=>{
        if(err){
            console.log(err);
            return;
        }
        callback(res);

    })
}
function get(key,callback){
    client.get(key,(err,res)=>{
        if(err){
            console.log(err);
            return;
        }
        callback(res);
    })
}
function expire(key,timeInSeconds){
    client.expire(key,timeInSeconds);
}
function quit(){
    client.quit();
}
module.exports = {
    get,
    set,
    expire,
    quit,
    redisPrint:redis.print
}
//services face to outside, modules here doesn't directly expose to outside.
