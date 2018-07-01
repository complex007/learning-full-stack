import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import registerServiceWorker from './registerServiceWorker';
import SignUpPage from './SignUp/SignUpPage';

ReactDOM.render(<SignUpPage />, document.getElementById('root'));
registerServiceWorker();
