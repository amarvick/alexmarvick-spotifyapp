import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.min.css'

import App from './App';
import store from './js/store';
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root')

ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>, root
);
registerServiceWorker();