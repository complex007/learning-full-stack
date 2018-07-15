var express = require('express');
var router = express.Router();
var passport = require('passport');
const validator = require('validator');

function validatePasswordAndEmail(payload){
    console.log("auth");
    console.log(payload);
    const errors = {};
    let isFormValid = false;
    let message = '';
    if(payload){
        let email = payload.email;
        let password = payload.password;
        if( email && password && typeof email == "string" && typeof password == "string" 
            && validator.isEmail(payload.email) && password.length >= 8){
                isFormValid = true;
        }
        else{
            errors.summary = 'Please provide correct email and password.';
        }

    }
    else{
        errors.summary = 'Please provide correct email and password.';
    }
    if (!isFormValid) {
        message = 'Check the form for errors.';
    }

    return {
        errors,
        message,
        success: isFormValid
    }
   

}

/* GET home page. */
router.post('/login', function(req, res, next) {

    let payload = req.body;
    let validateResult = validatePasswordAndEmail(payload);
    if (!validateResult.success) {
        return res.status(400).json({
            success: false,
            message: validateResult.message,
            errors: validateResult.errors
        });
    }
    
    return passport.authenticate('local-login',(error,token, userData)=>{
        if(error){

            if( error.name == 'IncorrectCredentialsError'){
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Could not process the form: ' + error.message
            });

        }
        else{
            return res.status(200).json({
                success: true,
                message: 'You have successfully logged in!',
                token,
                user: userData
            })

        }
    })(req, res, next);
});
router.post('/signup', function(req, res,next) {
    let payload = req.body;
    let validateResult = validatePasswordAndEmail(payload);
    if (!validateResult.success) {
        return res.status(400).json({
            success: false,
            message: validateResult.message,
            errors: validateResult.errors
        });
    }
    console.dir("pass");
    return passport.authenticate('local-signup', (err) => {
        if (err) {
          console.log(err);
          if (err.name === 'MongoError' && err.code === 11000) {
            // the 11000 Mongo code is for a duplication email error
            // the 409 HTTP status code is for conflict error
            return res.status(409).json({
              success: false,
              message: 'Check the form for errors.',
              errors: {
                email: 'This email is already taken.'
              }
            });
          }
    
          return res.status(400).json({
            success: false,
            message: 'Could not process the form.'
          });
        }
    
        return res.status(200).json({
          success: true,
          message: 'You have successfully signed up! Now you should be able to log in.'
        });
      })(req, res, next);
    // });
    // console.dir(passport)
    // return passport.authenticate('local-signup',( error )=>{
    //     console.dir(err);
    //     if(error){
    //         if( error.name == 'UserExistsError'){
    //             return res.status(400).json({
    //                 success: false,
    //                 message: err.message
    //             });
    //         }
    //         return res.status(400).json({
    //             success: false,
    //             message: 'Could not process the form: ' + err.message
    //         });

    //     }
    //     else{
    //         return res.status(200).json({
    //             success: true,
    //             message: 'You have successfully signed up! Now you should be able to log in.'
    //         });
    //     }

    // });
});

module.exports = router;