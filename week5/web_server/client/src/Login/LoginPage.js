// including logic
import LoginForm from './LoginForm';
import React from 'react';
import Auth from '../Auth/Auth';
class LoginPage extends React.Component{
    constructor(){
        super();

        this.state = {
            errors: {
                summary:"summary",
                email:'email',
                password:'password'
            },
            user: {
                email:'',
                password:''
            }
        }
    }
    // check 
    processForm(event){
        event.preventDefault(); // post or get request will be made by default
        const email = this.state.user.email;
        const password = this.state.user.password;
        // console.log("email: ", email);
        // console.log("password: ", password);
        // TODO: post target data 
        let url = 'http://'+window.location.hostname+":3000/auth/login";
        let request = new Request(
            url,
            {
                method:"POST",
                headers:{
                   "Content-Type":"application/json",
                   "Accept":"application/json"
                },
                body:JSON.stringify({
                    email:email,
                    password:password
                })

            }
        )
        fetch(request).then(response=>{
            if (response.status === 200) {
                this.setState({ errors:{}});
                response.json().then(json => {
                    Auth.authenticateUser(json.token, email);
                    window.location.replace("/");
                });

            }
            else{
                response.json().then(json => {
                    const errors = json.errors ? json.errors : {};
                    errors.summary = json.message;
                    this.setState({errors});
                });
            }



        })
        Auth.authenticateUser(email,password)
        

    }

    changeUser(event){
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        this.setState({user});

    }

    render(){
        return(
            <LoginForm onSubmit={(e)=>this.processForm(e)}    onChange={(e)=>this.changeUser(e)}   errors={this.state.errors}>

            </LoginForm>
        );
    }
}

export default LoginPage;