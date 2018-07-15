const Mongodb = require('mongoose');
module.exports = {
    connect: (uri) => {
        // connect mongodb
        Mongodb.connect(uri);

        Mongodb.connection.on('error',(err) => {
            // when user and password error
            console.error('Mongoose connection error: ${err}');
            process.exit(1);
        })
        
        // load models
        require('./user');
    }
}