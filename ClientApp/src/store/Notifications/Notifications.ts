import { request } from 'http';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';
import { Post } from '../Posts/PostsStore';

export interface NotificationsState {
    isLoading: boolean
    notifications: Notification[]
    post: Post | undefined
}

interface Notification {
    id: string
    text: string
    link: string
    userId: string
    isViewed: boolean
    createDate: Date
    image: string
    postId: string
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
interface RENDER_VIEW_POST {
    type: 'RENDER_VIEW_POST'
    post: Post
}
interface DELETE_VIEW_POST {
    type: 'DELETE_VIEW_POST'
}
interface SEND_COMMENT {
    type: 'SEND_COMMENT'
    userId: string
    postId: string
    text: string
}
interface SEND_LIKE {
    type: 'SEND_LIKE'
    userId: string
    postId: string
}

type KnownAction = SEND_LIKE | SEND_COMMENT | DELETE_VIEW_POST | RENDER_VIEW_POST | REQUEST_NOTIFICATIONS | RECEIVE_NOTIFICATIONS | NOTIFICATION_RECIEVED | REMOVE_NOTIFICATIONS

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
    },
    renderViewPost: (id: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken()
        fetch(`api/getViewPost?postId=${id}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                return response.ok
                    ? response.json()
                    : []
            })
            .then(data => {
                console.log(data)
                dispatch({ type: 'RENDER_VIEW_POST', post: data })
            });
    },
    deleteViewPost: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: 'DELETE_VIEW_POST'})
    },
    sendComment: (postId: string, text: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        let user = await authService.getUser()
        dispatch({ type: 'SEND_COMMENT', userId: user.sub, postId: postId, text: text })
    },
    sendLike: (postId: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        let user = await authService.getUser()
        dispatch({ type: 'SEND_LIKE', userId: user.sub, postId: postId })
    },
};

const unloadedState: NotificationsState = { isLoading: false, notifications: [], post: undefined };

export const reducer: Reducer<NotificationsState> = (state: NotificationsState | undefined, incomingAction: Action): NotificationsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_NOTIFICATIONS':
            return {
                ...state,
                isLoading: true,
                notifications: state.notifications
            };
        case 'DELETE_VIEW_POST':
            return {
                ...state,
                post: undefined
            }
        case 'RENDER_VIEW_POST':
            return {
                ...state,
                post: action.post
            };
        case 'REMOVE_NOTIFICATIONS':
            return {
                ...state,
                notifications: state.notifications.filter(function (data) {
                    return !action.ids.includes(data.id)
                })
            }
        case 'RECEIVE_NOTIFICATIONS':
            return {
                ...state,
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
