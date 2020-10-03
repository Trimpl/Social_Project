import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';

export interface PhotoAlbumSate {
    isLoading: boolean
    pictures: Picture[]
    isAuthor: boolean
}
export interface Picture {
    id: string
    postId: string
    userId: string
    pictureLink: string
}
interface REQUEST_ALBUM {
    type: 'REQUEST_ALBUM';
}
interface RECEIVE_ALBUM {
    type: 'RECEIVE_ALBUM'
    pictures: Picture[]
    isAuthor: boolean
}

type KnownAction = REQUEST_ALBUM | RECEIVE_ALBUM;

export const actionCreators = {
    requestAlbum: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.profile && appState.profile.user) {
            const token = await authService.getAccessToken();
            fetch(`api/getAlbum?albumId=${appState.profile.user!.id}`, {
                method: 'GET',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            })
                .then(response => response.json() as Promise<any>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_ALBUM', pictures: data, isAuthor: appState.profile!.user!.isAuthor });
                });
        }
        dispatch({ type: 'REQUEST_ALBUM', });
    },
    addToAlbum: (pictures: string[]): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState()
        if (appState && appState.profile && appState.profile.user) {
            const token = await authService.getAccessToken();
            fetch(`api/addPicture`, {
                method: 'POST',
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({albumId: appState.profile.user.id, pictures: pictures})
            })
                .then(response => response.json() as Promise<any>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_ALBUM', pictures: data, isAuthor: appState.profile!.user!.isAuthor });
                });

            dispatch({ type: 'REQUEST_ALBUM', });
        }
    }
};

const unloadedState: PhotoAlbumSate = { isLoading: false, pictures: [], isAuthor: false };

export const reducer: Reducer<PhotoAlbumSate> = (state: PhotoAlbumSate | undefined, incomingAction: Action): PhotoAlbumSate => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_ALBUM':
            return {
                ...state,
                isLoading: true
            };
        case 'RECEIVE_ALBUM':
            return {
                ...state,
                pictures: action.pictures,
                isLoading: false,
                isAuthor: action.isAuthor
            };
            break;
    }
    return state;
};
