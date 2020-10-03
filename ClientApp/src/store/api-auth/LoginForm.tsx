import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';
import * as React from 'react';

export interface LoginFormState {
    isLoading: JSX.Element;
    status: string;
    relocate: boolean
}

export interface Form {
    Email: string,
    Password: string,
    RememberMe: boolean
}

interface Request {
    type: 'REQUEST';
}

interface Receive {
    type: 'RECEIVE';
    receive: string;
    relocate: boolean
}

type KnownAction = Request | Receive;

export const actionCreators = {
    request: (Email: string, Password: string, RememberMe: boolean, Controller: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState()
        const formData = new FormData()
        formData.append('Input.Email', Email)
        formData.append('Input.Password', Password)
        formData.append('Input.RememberMe', RememberMe.toString())
        if (appState && appState.loginForm) {
            dispatch({ type: 'REQUEST' })
            fetch(Controller, {
                method: 'POST',
                body: formData
            })
                .then(async data => {
                    if (data.ok) {
                        dispatch({ type: 'RECEIVE', receive: 'You successfully logged in', relocate: true });
                        const returnUrl = window.location.protocol + window.location.host
                        await authService.signIn({ returnUrl })
                        window.location.replace('');
                    }
                    else {
                        dispatch({ type: 'RECEIVE', receive: "Oops, that's not a match. Try again?", relocate: false });
                    }
                })
                .catch(data => console.log(data))
        }
    }
};

const unloadedState: LoginFormState = { isLoading: <div></div>, status: '', relocate: false };

export const reducer: Reducer<LoginFormState> = (state: LoginFormState | undefined, incomingAction: Action): LoginFormState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST':
            return {
                status: '',
                isLoading: <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>,
                relocate: false
            };
        case 'RECEIVE':
            return {
                status: action.receive,
                isLoading: <div></div>,
                relocate: action.relocate
            }
        default:
            return state
    }
}