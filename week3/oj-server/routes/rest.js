
const express = require('express')
const router = express.Router()
const problemService = require('../services/problemService')
const jsonParser = require('body-parser').json(); // pre-process 


router.get('/problems',function( req, res ){
    problemService.getProblems()   // return promise
    .then(data => {res.json(data)});// return data as json in res
})     // router.get apply to this router;  app.get apply to whole app


router.get('/problems/:id',function( req, res ){
    const id = req.params.id
    problemService.getProblem( +id )    
    .then(data => {res.json(data)}); 
})   

router.post('/problems', jsonParser, function( req, res ){
    problemService.addProblem( req.body )    
    .then( data => {res.json(data)}, // reture whole problem with generated id
    (error)=>{
        res.status(400).send("Problem name already exists")
    }); 
}) 

router.put('/problems/:name', jsonParser, function( req, res ){
    const name = req.params.name;
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

router.post('/build_and_run',jsonParser,function(req,res){
    let code = req.body.code;
    problemService.build_and_run(code)
    .then(data=>{res.json(data)}),
    (error)=>{
        res.status(400).send("Problem name not exists")
    } 
})


module.exports = router;