import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';

export interface NotificationsState {
    isLoading: boolean
    notifications: Notification[]
}

interface Notification {
    id: string
    text: string
    link: string
    userId: string
    isViewed: boolean
    createDate: Date
    image: string
}
interface REQUEST_NOTIFICATIONS {
    type: 'REQUEST_NOTIFICATIONS'
}
interface RECEIVE_NOTIFICATIONS {
    type: 'RECEIVE_NOTIFICATIONS'
    notifications: Notification[]
}
interface NOTIFICATION_RECIEVED {
    type: 'NOTIFICATION_RECIEVED'
    notification: Notification
}
interface REMOVE_NOTIFICATIONS {
    type: 'REMOVE_NOTIFICATIONS'
    ids: string[]
}

type KnownAction = REQUEST_NOTIFICATIONS | RECEIVE_NOTIFICATIONS | NOTIFICATION_RECIEVED | REMOVE_NOTIFICATIONS

export const actionCreators = {
    request: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken();
        fetch(`api/getNotifications`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                return response.ok
                    ? response.json()
                    : []
            })
            .then(data => {
                dispatch({ type: 'RECEIVE_NOTIFICATIONS', notifications: data });
            });

        dispatch({ type: 'REQUEST_NOTIFICATIONS' });
    },
    removeNotifications: (ids: string[]): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        if (ids != []) dispatch({ type: 'REMOVE_NOTIFICATIONS', ids: ids })
    }
};

const unloadedState: NotificationsState = { isLoading: false, notifications: [] };

export const reducer: Reducer<NotificationsState> = (state: NotificationsState | undefined, incomingAction: Action): NotificationsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_NOTIFICATIONS':
            return {
                isLoading: true,
                notifications: state.notifications
            };
        case 'RECEIVE_NOTIFICATIONS':
            return {
                isLoading: false,
                notifications: action.notifications
            };
        case 'NOTIFICATION_RECIEVED':
            return {
                ...state,
                notifications: [action.notification, ...state.notifications]
            }
            break;
    }
    return state;
};
