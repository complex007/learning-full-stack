// including logic
import LoginForm from './LoginForm';
import React from 'react';
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
        console.log("email: ", email);
        console.log("password: ", password);
        // TODO: post target data 
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