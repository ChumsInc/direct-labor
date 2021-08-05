import React from 'react';
import { render } from 'react-dom';
import {Provider} from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import {BrowserRouter, Route} from 'react-router-dom';
import thunk from 'redux-thunk';
import reducer from './ducks';
import App from './components/App';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

render(
    <Provider store={store}>
        <BrowserRouter basename="/apps/direct-labor/">
            <Route component={App} />
        </BrowserRouter>
    </Provider>, document.getElementById('app')
);
