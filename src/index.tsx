import React from 'react';
import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom';
import App from './components/App';
// @ts-ignore
import {createRoot} from "react-dom/client";
import store from "./app/configureStore";

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>
);
