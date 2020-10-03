import 'bootstrap/dist/css/bootstrap.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';
import App from './App';
import authService from './components/api-authorization/AuthorizeService';
import { signalRRegisterCommands } from './store/signalr/signal';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href') as string;
const history = createBrowserHistory({ basename: baseUrl });

async function auth() {
    const isAuthenticated = await authService.isAuthenticated()
    const user = await authService.getUser()
    if (isAuthenticated.valueOf()) signalRRegisterCommands(store)
    if (isAuthenticated.valueOf()) {
        store.dispatch({ type: 'GET_NUMBER_OF_UNREAD_DIALOGS', id: user.sub })
    }
}
const store = configureStore(history);
auth()

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root'))
