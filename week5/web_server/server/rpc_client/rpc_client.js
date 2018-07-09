var jayson = require('jayson');
// create a client
var client = jayson.client.http({
    port: 4040,
    hostname: 'localhost'
});
// Test RPC method
function add(a, b, callback) {
    // 'add' should mach the name that exposed by server
    // [a, b] has order
    client.request('add', [a, b], function(err, response){
        // err is the error from jayson which we cannot handle so throw err
        // error is from RPC server
        // for example, a or b is invalid number to add
        if (err) throw err;
        console.log(response.result);
        callback(response.result);
    })
}
module.exports = {
    add
}