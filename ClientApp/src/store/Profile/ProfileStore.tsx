import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';
import * as React from 'react';
import { Friend } from '../Friends/FriendsStore';

export interface ProfileState {
    isLoading: JSX.Element
    user: UserModel | null
    listOfFriends: Friend[]
}
export interface User {
    id: string;
    firstName: string;
    secondName: string;
    familyStatus: string;
    dateOfBirth: Date;
    country: string;
    city: string;
    languages: string;
    avatar: string
}
export interface UserModel extends User {
    isAuthor: boolean
}
interface Request {
    type: 'REQUEST';
}
interface ReceiveFriends {
    type: 'RECEIVE_LIST_OF_FRIENDS';
    listOfFriends: Friend[]
}
interface Receive {
    type: 'RECEIVE';
    user: UserModel | null
}
type KnownAction = Request | Receive | ReceiveFriends;

export const actionCreators = {
    requestProfile: (userId: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken();
        fetch(`api/Profile?userId=${userId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                return response.ok ? response.json() as Promise<UserModel> : null
            })
            .then(data => {
                dispatch({ type: 'RECEIVE', user: data })
            });
        dispatch({ type: 'REQUEST' });
    },
    requestFriends: (id: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: 'REQUEST' });
        const token = await authService.getAccessToken();
        fetch(`api/getFriends?id=${id}`, {
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
};

const unloadedState: ProfileState = { user: null, isLoading: <div></div>, listOfFriends: [] };

export const reducer: Reducer<ProfileState> = (
    state: ProfileState | undefined,
    incomingAction: Action): ProfileState => {
    if (state === undefined) {
        return unloadedState;
    }
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST':
            return {
                ...state,
                user: null,
                isLoading: <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            };
        case 'RECEIVE_LIST_OF_FRIENDS':
            return {
                ...state,
                listOfFriends: action.listOfFriends
            };
        case 'RECEIVE':
            return {
                ...state,
                user: action.user,
                isLoading: <div></div>
            };
        default:
            return state;
    }
};
