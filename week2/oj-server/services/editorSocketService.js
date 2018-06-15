
const redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;


module.exports=function(io){
    

    // const collaborations = {};
    
    // io.on('connection', (socket) => {

	// 	var sessionId = socket.handshake.query['sessionId'];

    //     if( sessionId ){
    //         if( collaborations[sessionId] ){
    //             collaborations[sessionId].participants.push(socket.id);
    //         }
    //         else{
    //             collaborations[sessionId] = { participants:[socket.id]}
    //         }
    //         for ( let sId = 0; sId < collaborations[sessionId].participants.length; sId++){
    //             io.to(collaborations[sessionId].participants[sId]).emit('collaboration-info', collaborations[sessionId].participants );             
    //         }
    //     }
        
    //     io.to(socket.id).emit('message', 'hehe from server');

    //     socket.on("disconnect",()=>{
    //         if( collaborations[sessionId] && collaborations[sessionId].participants ){
    //             let index = collaborations[sessionId].participants.indexOf(socket.id);
    //             collaborations[sessionId].participants.splice(index,1);
    //             for ( let sId = 0; sId < collaborations[sessionId].participants.length; sId++){
    //                 io.to(collaborations[sessionId].participants[sId]).emit('collaboration-info', collaborations[sessionId].participants );             
    //             } 
    //         }
    //     })
   
    // });
    
   
    const collaborations = {};
    const socketIdToSessionId = {};

    const sessionPath = '/editorSocket/';


    io.on('connection',socket=>{
        const sessionId = socket.handshake.query("sessionId");
        console.log('connection' );
        // console.log(collaborations);
        socketIdToSessionId[socket.id] = sessionId;
        if( sessionId in collaborations){
            collaborations[sessionId].participants.push(socket.id);                 
        }
        else{
            redisClient.get(sessionPath+sessionId,function(data){
                if(data){
                    console.log('session terminated perviously, pulling back from redis');
                    collaborations[sessionId] = {
                        'cachedInstruction':JSON.parse(data),
                        'participants':[]
                    }
                }
                else{
                    console.log('new session');
                    collaborations[sessionId] = {
                        'cachedInstruction':[],
                        'participants':[]
                    }
                }
                collaborations[sessionId].participants.push(socket.id);
            })
        }
        for ( let sId = 0; sId < collaborations[sessionId].participants.length; sId++){
            console.dir(sId);
            io.to(collaborations[sessionId].participants[sId]).emit('connect',collaborations[sessionId]);             
        }
       
        socket.on("disconnect",()=>{
            if( collaborations[sessionId] && collaborations[sessionId].participants ){
                let index = collaborations[sessionId].participants.indexOf(socket.id);
                collaborations[sessionId].participants.splice(index,1);
                for ( let sId = 0; sId < collaborations[sessionId].participants.length; sId++){
                    io.to(collaborations[sessionId].participants[sId]).emit('collaboration-info', collaborations[sessionId].participants );             
                } 
            }
        })
        socket.on('change',delta=>{
            console.log('change'+socketIdToSessionId[socket.id] + ' '+delta);
            let sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations){
                let participants = collaborations[sessionId]['participants'];
                collaborations[sessionId]['cachedInstruction'].push(
                    ['change',delta,Date.now()]);// record info of all changes
                for( let i = 0; i< participants.length;i++){
                    if(socket.id != participants[i]){
                        io.to(participants[i]).emit('change',delta);
                    }
                }
            }
            else{
                console.log("warning: can't find");
            }
        })
        socket.on('restoreBuffer',()=>{
            let sessionId = socketIdToSessionId[socket.id];
            console.log("restore buffer for session "+sessionId+" for socket "+socket.id);
            if(sessionId in collaborations){
                let instructions = collaborations[sessionId]['cachedInstruction'];
                for( let i = 0; i< instructions.length;i++ ){
                 socket.emit(instructions[i][0],instructions[i][1]);//send all changes
                }
            }
            else{
                console.log('warning: could not find socket id in collaborations');
            }
        })
        socket.on('disconnect',()=>{
         let sessionId = socketIdToSessionId[socket.id];
         console.log('disconnect '+socket.id +" from session "+sessionId);
         let foundAndRemoved = false;
         if ( sessionId in collaborations){
             let participants = collaborations[sessionId]['participants'];
             let index = participants.indexOf(socket.id);
             if (index>=0){
                 participants.splice(index,1);
                 foundAndRemoved = true;
                 if(participants.length == 0){
                     console.log(`last participant in collaborations, 
                     committing to redis and remove from memory`);
                     let key = sessionPath+sessionId;
                     let value = JSON.stringify(collaborations[sessionId]['cachedInstruction']);
                     redisClient.set(key,value,redisClient.print);
                     redisClient.expire(key,TIMEOUT_IN_SECONDS);
                     delete collaborations[sessionId]
                 }
             }
     
         }
         if(!foundAndRemoved){
             console.log("can't find session "+sessionId+" in collabotations");
     
         }
     
        })
    })
  

}

// store data about session and who is working on the problem

// map socket id to session id