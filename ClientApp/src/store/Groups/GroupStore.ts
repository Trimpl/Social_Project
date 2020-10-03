import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';
import { User } from '../Profile/ProfileStore';

export interface GroupState {
    isLoading: boolean
    isAuthor: boolean
    isAdmin: boolean
    group: Group
    users: User[]
    admins: User[]
}
export interface Group {
    id: string
    userId: string
    name: string
    description: string
    avatarLink: string
}

interface REQUEST {
    type: 'REQUEST'
}
interface RECEIVE {
    type: 'RECEIVE'
}
interface GET_GROUP {
    type: 'GET_GROUP'
    group: Group
    isAuthor: boolean
    isAdmin: boolean
}
interface GET_LIST_OF_SUBSCRIBERS {
    type: 'GET_LIST_OF_SUBSCRIBERS'
    users: any
    admins: any
}
interface SMTH_WENT_WRONG {
    type: 'SMTH_WENT_WRONG'
}
export interface createGroup {
    avatarLink: string,
    name: string,
    description: string
}
export interface editGroup {
    id: string,
    avatarLink: string,
    name: string,
    description: string
}
export interface deleteGroup {
    id: string
}
export interface ChangeGroupAdmin {
    groupId: string,
    userId: string
}
type KnownObject = createGroup | editGroup | deleteGroup | ChangeGroupAdmin
type KnownAction = SMTH_WENT_WRONG | RECEIVE | REQUEST | GET_GROUP | GET_LIST_OF_SUBSCRIBERS

export const actionCreators = {
    request: (object: KnownObject, method: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken();
        fetch(`api/${method}`, {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },
            body: JSON.stringify(object)
        })
            .then(response => {
                response.ok ? dispatch({ type: 'RECEIVE' }) : dispatch({ type: 'SMTH_WENT_WRONG' })
            })

        dispatch({ type: 'REQUEST' });
    },
    getGroup: (id: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken();
        fetch(`api/groupInfo?id=${id}`, {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                return (
                    response.json()
                )
            })
            .then(data => {
                dispatch({ type: 'GET_GROUP', group: data.group, isAuthor: data.isAuthor, isAdmin: data.isAdmin })
            })

        dispatch({ type: 'REQUEST' });
    },
    getListOfSubscribers: (id: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState()
        if (appState && appState.group && appState.group.group) {
            fetch(`api/getListOfSubscribers?groupId=${appState.group.group.id}`, {
                method: 'GET'
            })
                .then(response => {
                    return (
                        response.json()
                    )
                })
                .then(data => {
                    dispatch({ type: 'GET_LIST_OF_SUBSCRIBERS', users: data.users, admins: data.admins })
                })

            dispatch({ type: 'REQUEST' });
        }
    },
};

const unloadedState: GroupState = {
    isLoading: false, group: {
        id: '', userId: '', name: '', description: '', avatarLink: ''
    }, isAuthor: false, isAdmin: false, users: [], admins: []
};

export const reducer: Reducer<GroupState> = (state: GroupState | undefined, incomingAction: Action): GroupState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'GET_GROUP':
            return {
                ...state,
                isAuthor: action.isAuthor,
                group: action.group,
                isLoading: false,
                isAdmin: action.isAdmin
            };
        case 'GET_LIST_OF_SUBSCRIBERS':
            return {
                ...state,
                admins: action.admins,
                users: action.users
            };
        case 'SMTH_WENT_WRONG':
            return {
                ...state,
                isLoading: false
            };
        case 'REQUEST':
            return {
                ...state,
                isLoading: true
            };
        case 'RECEIVE':
            return {
                ...state,
                isLoading: false
            };
            break;
    }
    return state;
};
