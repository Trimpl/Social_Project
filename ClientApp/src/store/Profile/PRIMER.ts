import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';

export interface EditProfileState {
    isLoading: boolean;
}


interface Request {
    type: 'REQUEST';
}

interface Receive {
    type: 'RECEIVE';
}

type KnownAction = Request | Receive;

export const actionCreators = {
    request: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken(); fetch(`weatherforecast`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json() as Promise<any>)
            .then(data => {
                dispatch({ type: 'RECEIVE', });
            });

        dispatch({ type: 'REQUEST', });
    }
};

const unloadedState: EditProfileState = { isLoading: false };

export const reducer: Reducer<EditProfileState> = (state: EditProfileState | undefined, incomingAction: Action): EditProfileState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST':
            return {
                isLoading: true
            };
        case 'RECEIVE':
            return {
                isLoading: false
            };
            break;
    }
    return state;
};
