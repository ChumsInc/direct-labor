import {Provider} from 'react-redux';
import App from '@/app/App.tsx';
import {createRoot} from "react-dom/client";
import store from "./app/configureStore";

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);
