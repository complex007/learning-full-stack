import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Base from './Base/Base'

ReactDOM.render(<Base />, document.getElementById('root'));
registerServiceWorker();
