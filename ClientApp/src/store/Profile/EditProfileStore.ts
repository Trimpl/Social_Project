import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';
import { UserModel } from './ProfileStore';

export interface EditProfileState {
    isLoading: boolean;
    user: UserModel;
    status: string
}

interface Request {
    type: 'REQUEST';
}

interface Receive {
    type: 'RECEIVE';
    user: UserModel;
    status: string
}

type KnownAction = Request | Receive;

export const actionCreators = {
    getEditProfile: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken();
        fetch(`api/EditProfile`, {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json() as Promise<UserModel>)
            .then(data => {
                dispatch({ type: 'RECEIVE', user: data, status: 'downloaded' });
            });
        dispatch({ type: 'REQUEST' });
    },
    postEditProfile: (user: UserModel): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken();
        const formData = new FormData()
        formData.append('Input.FirstName', user.firstName)
        formData.append('Input.SecondName', user.secondName)
        formData.append('Input.Country', user.country)
        formData.append('Input.City', user.city)
        formData.append('Input.Languages', user.languages)
        formData.append('Input.DateOfBirth', user.dateOfBirth.toString())
        formData.append('Input.FamilyStatus', user.familyStatus)
        formData.append('Input.Avatar', user.avatar)
        fetch(`api/EditProfile`, {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
            body: formData
        })
            .then(response => response.json() as Promise<UserModel>)
            .then(data => {
                dispatch({ type: 'RECEIVE', user: data, status: 'ok 200' });
            });
        dispatch({ type: 'REQUEST' });
    }
};

const unloadedState: EditProfileState = {
    user: {
        id: '',
        firstName: '',
        secondName: '',
        familyStatus: '',
        dateOfBirth: new Date(),
        country: '',
        city: '',
        languages: '',
        avatar: '',
        isAuthor: false
    },
    isLoading: false,
    status: ''
};

export const reducer: Reducer<EditProfileState> = (state: EditProfileState | undefined, incomingAction: Action): EditProfileState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST':
            return {
                user: state.user,
                isLoading: true,
                status: ''
            };
        case 'RECEIVE':
            return {
                isLoading: false,
                user: action.user,
                status: action.status
            };
            break;
    }
    return state;
};
