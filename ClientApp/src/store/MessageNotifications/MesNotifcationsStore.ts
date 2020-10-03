import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import { Message } from '../Dialogs/DialogStore';

export interface MesNotificationsState {
    messages: Message[]
}

interface Receive {
    type: 'RECEIVE';
}
interface MESSAGE_RECEIVED {
    type: 'MESSAGE_RECEIVED',
    message: Message
}
interface DELETE_NOTIFICATION {
    type: 'DELETE_NOTIFICATION'
    message: Message
}

type KnownAction = Receive | MESSAGE_RECEIVED | DELETE_NOTIFICATION;

export const actionCreators = {
    deleteNotification: (message: Message): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        setTimeout(() => {
            dispatch({ type: 'DELETE_NOTIFICATION', message: message })
        }, 5000)
    },
};

const unloadedState: MesNotificationsState = { messages: [] };
export const reducer: Reducer<MesNotificationsState> = (state: MesNotificationsState | undefined, incomingAction: Action): MesNotificationsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'DELETE_NOTIFICATION':
            let a = state.messages.filter((data) => {
                if (data.id != action.message.id)
                    return data
            })
            return {
                messages: a
            };
        case 'MESSAGE_RECEIVED':
            if (window.location.pathname.includes(action.message.firstId) || window.location.pathname.includes(action.message.secondId))
                return { ...state }
            return {
                messages: [...state.messages, action.message]
            };
            break;
    }
    return state;
};
