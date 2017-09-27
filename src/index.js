import React from 'react';
import {render} from 'react-dom';
import App from './pages/App';
import registerServiceWorker from './js/registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';

render(
    <App/>, document.getElementById('root'));
registerServiceWorker();
