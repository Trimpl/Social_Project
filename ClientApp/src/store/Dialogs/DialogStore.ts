import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';

export interface DialogState {
    isLoading: boolean
    withWhomId: string
    dialog: Message[]
}
export interface Message {
    id: string
    firstUserId: string
    secondUserId: string
    message: string
    createDate: Date
    avatar: string
    firstId: string
    secondId: string
    withWhomId: string
    isViewed: boolean
}
interface Request {
    type: 'REQUEST';
}
interface AddMessageRequest {
    type: 'ADD_MESSAGE'
    user: string
    message: string
    to: string
}
interface RecieveMessage {
    type: 'MESSAGE_RECEIVED'
    message: Message
}
interface RecieveMessageView {
    type: 'MESSAGE_RECEIVED_VIEW'
    message: Message
}
interface GET_NUMBER_OF_UNREAD_DIALOGS {
    type: 'GET_NUMBER_OF_UNREAD_DIALOGS'
    id: string
}
export interface ReceiveDialog {
    type: 'RECEIVE_DIALOG'
    messages: Message[]
    withWhomId: string
}

type KnownAction = Request | ReceiveDialog | AddMessageRequest | RecieveMessage | RecieveMessageView | GET_NUMBER_OF_UNREAD_DIALOGS

export const actionCreators = {
    requestDialog: (toUserId: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken()
        const user = await authService.getUser()
        fetch(`api/Dialog?toUserId=${toUserId}`, {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                return response.ok ? response.json() as Promise<Message[]> : []
            })
            .then(data => {
                dispatch({ type: 'GET_NUMBER_OF_UNREAD_DIALOGS', id: user.sub})
                dispatch({ type: 'RECEIVE_DIALOG', messages: data, withWhomId: toUserId });
            });

        dispatch({ type: 'REQUEST', });
    },
    sendMessage: (toUserId: string, message: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const [user] = await Promise.all([authService.getUser()])
        dispatch({ type: 'ADD_MESSAGE', user: user.Email, message: message, to: toUserId });
    },
    recieveMessage: (message: Message): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: 'MESSAGE_RECEIVED_VIEW', message: message})
    },
};

const unloadedState: DialogState = { isLoading: false, dialog: [], withWhomId: '' };

export const reducer: Reducer<DialogState> =
    (state: DialogState | undefined, incomingAction: Action): DialogState => {
        if (state === undefined) {
            return unloadedState;
        }
        const action = incomingAction as KnownAction;
        switch (action.type) {
            case 'REQUEST':
                return {
                    ...state,
                    isLoading: true,
                    dialog: state.dialog
                };
            case 'MESSAGE_RECEIVED':
                if (action.message.firstId == state.withWhomId || action.message.secondId == state.withWhomId) {
                    if (action.message.firstId == state.withWhomId) {
                        
                    }
                    return {
                        ...state,
                        dialog: [...state.dialog, action.message]
                    }
                }
                return {
                    ...state
                }
            case 'RECEIVE_DIALOG':
                return {
                    ...state,
                    isLoading: false,
                    dialog: action.messages,
                    withWhomId: action.withWhomId
                };
                break;
        }
        return state;
    };
