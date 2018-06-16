const express = require('express')
const app = express()
const restRouter =  require('./routes/rest')
const path = require('path')
const http = require('http')
const socketIo = require('socket.io')
const io = socketIo();
const collaborationService = require('./services/editorSocketService')(io);


//set router
app.use('/api/v1/', restRouter)
app.use(express.static(path.join(__dirname,'../public')))
app.use((req,res)=>{
    res.sendFile('index.html',{root:path.join(__dirname,'../public')})
})



// connect mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://user:123456wyq@ds251240.mlab.com:51240/oj-forerror')
    .catch(info => {
        console.log('mongodb connect fail')
    });


// app.listen(3000, () => console.log('Example app listening on port 3000!'))

const server = http.createServer(app);
io.attach(server);
server.listen(3000);
server.on('listening', onListening)

function onListening(){
    console.log('Example app listening on port 3000!')
}