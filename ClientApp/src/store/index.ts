import * as LoginForm from './api-auth/LoginForm';
import * as Profile from './Profile/ProfileStore'
import * as EditProfile from './Profile/EditProfileStore'
import * as Friends from './Friends/FriendsStore'
import * as Dialog from '../store/Dialogs/DialogStore'
import * as CreatePost from '../store/Posts/PostsStore'
import * as PhotoAlbum from '../store/PhotoAlbum/PhotoAlbumStore'
import * as Group from '../store/Groups/GroupStore'
import * as Notification from '../store/Notifications/Notifications'
import * as MesNotification from '../store/MessageNotifications/MesNotifcationsStore'

export interface ApplicationState {
    loginForm: LoginForm.LoginFormState | undefined
    profile: Profile.ProfileState | undefined
    editProfile: EditProfile.EditProfileState | undefined
    friends: Friends.FriendsState | undefined
    dialog: Dialog.DialogState | undefined
    createPost: CreatePost.PostsState | undefined
    photoAlbum: PhotoAlbum.PhotoAlbumSate | undefined
    group: Group.GroupState | undefined
    notification: Notification.NotificationsState | undefined
    mesNotifications: MesNotification.MesNotificationsState | undefined
}

export const reducers = {
    loginForm: LoginForm.reducer,
    profile: Profile.reducer,
    editProfile: EditProfile.reducer,
    friends: Friends.reducer,
    dialog: Dialog.reducer,
    createPost: CreatePost.reducer,
    photoAlbum: PhotoAlbum.reducer,
    group: Group.reducer,
    notification: Notification.reducer,
    mesNotifications: MesNotification.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
