
const express = require('express');
const router = express.Router();
const problemService = require('../services/problemService');
const jsonParser = require('body-parser').json(); // pre-process 
const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();
const EXECUTOR_SERVER_URL = 'http://executor/build_and_run';
restClient.registerMethod('build_and_run',EXECUTOR_SERVER_URL,'POST');


router.get('/problems', ( req, res ) => {
    problemService.getProblems()   // return promise
    .then(data => {res.json(data)});// return data as json in res
})     // router.get apply to this router;  app.get apply to whole app


router.get('/problems/:id', ( req, res ) => {
    const id = req.params.id
    problemService.getProblem( +id )    
    .then(data => {res.json(data)}); 
})   

router.post('/problems', jsonParser, ( req, res ) => {
    problemService.addProblem( req.body )    
    .then( data => {res.json(data)}, // reture whole problem with generated id
    (error)=>{
        res.status(400).send("Problem name already exists")
    }); 
}) 

router.put('/problems', jsonParser, ( req, res ) => {
    const name = req.body.name;
    if( !req.body.name || (req.body.name && req.body.name == name)){
        problemService.updateProblem( name, req.body )    
        .then( data => {res.json(data)}, // reture whole problem with generated id
        (error)=>{
            res.status(400).send("Problem name not exists")
        }); 
    }
    else{
        res.status(400).send("Problem name error")
    }
   
}) 

router.post('/build_and_run',jsonParser, ( req, res) => {
    let code = req.body.code;
    let lang = req.body.lang;
    restClient.methods.build_and_run(
        {
            data:{ code : code, lang : lang },
            headers:{ 'Content-Type' : 'application/json' }
        },
        ( data, response ) => {
            console.log(data);
            const text = `Build output: ${data['build']}, execute output: ${data['run']}, error: ${data['error']}`
            res.json(text);
        }
    )
    // problemService.build_and_run(code,lang)
    // .then(data=>{res.json(data)}),
    // (error)=>{
    //     res.status(400).send("Problem name not exists")
    // } 
})


module.exports = router;