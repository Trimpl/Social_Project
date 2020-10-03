import * as signalR from "@microsoft/signalr"
import authService from "../../components/api-authorization/AuthorizeService";

async function getToken() {
    const token = await authService.getAccessToken()
    return token !== null ? token : ''
}
let connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub", {
        accessTokenFactory: () => {
            return getToken()
        },
    })
    .configureLogging(signalR.LogLevel.None)
    .build();
export const signalRRegisterCommands = async (store: any) => {
    connection.on("ReceiveMessage", async function (data) {
        store.dispatch({ type: 'MESSAGE_RECEIVED', message: data })
        const user = await authService.getUser()
        store.dispatch({ type: 'GET_NUMBER_OF_UNREAD_DIALOGS', id: user.sub })
    });
    connection.on("NewPost", function (data) {
        data.comments = []
        store.dispatch({ type: 'CREATE_POST_RECEIVE_OK', post: data })
    });
    connection.on("NewLike", async function (data) {
        let user = await authService.getUser()
        store.dispatch({ type: 'LIKE_RECEIVED', newLike: data, user: user })
    });
    connection.on("NewComment", function (data) {
        store.dispatch({ type: 'COMMENT_RECEIVED', newComment: data })
    });
    connection.on("GetNumberOfUnreadDialogs", function (data) {
        if (document.getElementById('dialogsSpan')) {
            if (data === 0) document.getElementById('dialogsSpan')!.className = "badge badge-pill badge-warning d-none"
            else {
                document.getElementById('dialogsSpan')!.textContent = data
                document.getElementById('dialogsSpan')!.className = "badge badge-pill badge-warning"
            }
        }
        else if (data !== 0) document.getElementById('Dialogs')!.innerHTML += `<span class="badge badge-pill badge-warning" id="dialogsSpan">${data}</span>`
    })
    connection.on("RecieveNotification", function (data) {
        store.dispatch({ type: 'NOTIFICATION_RECIEVED', notification: data })
    });
    async function start() {
        try {
            console.log('CONNECTION START')
            await connection.start()
            console.log("CONNECTED")
        } catch (err) {
            console.log(err)
            setTimeout(() => start(), 5000)
        }
    }
    connection.onclose(async () => {
        console.log('DISCONNECTED. Trying to reconnect')
        start()
    })
    const user = await authService.getUser()
    await connection.start().then(() => {
        if (connection.state === 'Connected') store.dispatch({ type: 'GET_NUMBER_OF_UNREAD_DIALOGS', id: user.sub })
    })
};

export const ping = (store: any) => (next: (arg0: any) => any) => async (action: any) => {
    if (connection.state === 'Connected') {
        switch (action.type) {
            case 'GET_NUMBER_OF_UNREAD_DIALOGS':
                connection.invoke('GetNumberOfUnreadDialogs', action.id)
                break;
            case 'CREATE_POST':
                connection.invoke('SendPost', action.postText, action.pictureLink, action.userId, action.groupId)
                break;
            case 'MESSAGE_RECEIVED_VIEW':
                connection.invoke('MESSAGE_RECEIVED_VIEW', action.message)
                connection.invoke('GetNumberOfUnreadDialogs', action.message.secondId)
                break;
            case 'ADD_MESSAGE':
                connection.invoke('SendMessage', action.user, action.message, action.to)
                break;
            case 'SEND_LIKE':
                connection.invoke('SendLikes', action.userId, action.postId)
                break;
            case 'SEND_COMMENT':
                connection.invoke('SendComment', action.userId, action.postId, action.text)
                break;
            case 'REMOVE_NOTIFICATIONS':
                connection.invoke('RemoveNotifications', action.ids)
                break;
        }
    }
    return next(action)
}