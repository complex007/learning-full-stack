class Auth{
    static authenticateUser(token,email){
        localStorage.setItem("token",token);
        localStorage.setItem("email",email);
    }
    static isUserAuthenticated(){
        return !!localStorage.getItem("token");
    }
    static getToken(){
        return localStorage.getItem('token');
    }
    static getEmail(){
        return localStorage.getItem('email');
    }
    static deauthenticateUser(){
        localStorage.removeItem("email");
        localStorage.removeItem("token");
    }
}
export default Auth