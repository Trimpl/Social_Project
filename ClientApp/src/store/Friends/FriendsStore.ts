import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';
import { UserModel } from '../Profile/ProfileStore';

export interface Friend extends UserModel {
    id: string
}

export interface FriendsState {
    isLoading: boolean;
    listOfFriends: Friend[];
    listOfNotFriends: Friend[];
}
const unloadedState: FriendsState = { isLoading: false, listOfFriends: [], listOfNotFriends: [] };
interface Request {
    type: 'REQUEST';
}
interface ReceiveFriends {
    type: 'RECEIVE_LIST_OF_FRIENDS';
    listOfFriends: Friend[]
}
interface ReceiveNotFriends {
    type: 'RECEIVE_LIST_OF_NOT_FRIENDS';
    listOfNotFriends: Friend[]
}

type KnownAction = Request | ReceiveNotFriends | ReceiveFriends;

export const actionCreators = {
    requestFriends: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: 'REQUEST' });
        const token = await authService.getAccessToken();
        fetch(`api/friends`, {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) {
                    return []
                } else {
                    return response.json()
                }
            })
            .then(data => {
                dispatch({ type: 'RECEIVE_LIST_OF_FRIENDS', listOfFriends: data });
            });
    },
    requestNotFriends: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: 'REQUEST' });
        const token = await authService.getAccessToken();
        fetch(`api/friends/notFriends`, {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) {
                    return []
                } else {
                    return response.json()
                }
            })
            .then(data => {
                dispatch({ type: 'RECEIVE_LIST_OF_NOT_FRIENDS', listOfNotFriends: data });
            });
    },
};

export const reducer: Reducer<FriendsState> = (state: FriendsState | undefined, incomingAction: Action): FriendsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST':
            return {
                isLoading: true,
                listOfNotFriends: state.listOfNotFriends,
                listOfFriends: state.listOfFriends
            };
        case 'RECEIVE_LIST_OF_NOT_FRIENDS':
            return {
                isLoading: false,
                listOfNotFriends: action.listOfNotFriends,
                listOfFriends: state.listOfFriends
            };
        case 'RECEIVE_LIST_OF_FRIENDS':
            return {
                isLoading: false,
                listOfNotFriends: state.listOfNotFriends,
                listOfFriends: action.listOfFriends
            };
        default:
            return state;
    }
};
