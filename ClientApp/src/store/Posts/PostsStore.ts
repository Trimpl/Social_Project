import { Action, Reducer } from 'redux';
import { AppThunkAction } from '..';
import authService from '../../components/api-authorization/AuthorizeService';
import { UserModel } from '../Profile/ProfileStore';
import { Group } from '../Groups/GroupStore';
import { Comment } from '../../components/Comments/ListOfComments';

export interface PostsState {
    recievedSuccess: boolean
    posts: Post[]
    user: UserModel | null
    group: Group | null
}
export interface Like {
    id: string
    userId: string
    postId: string
}
export interface Picture {
    id: string
    pictureLink: string
}
export interface Post {
    id: string
    userId: string
    postText: string
    createDate: Date
    pictureLink: Picture[]
    likes: number
    isLiked: boolean
    comments: Comment[]
    avatar: string
    link: string
}
interface CREATE_POST_REQUEST {
    type: 'CREATE_POST_REQUEST';
}
interface CREATE_POST_RECEIVE_OK {
    type: 'CREATE_POST_RECEIVE_OK'
    post: Post
}
interface CREATE_POST_RECEIVE_BAD {
    type: 'CREATE_POST_RECEIVE_BAD';
}
interface RECIEVE_POSTS_OK {
    type: 'RECIEVE_POSTS_OK';
    posts: Post[]
    user: UserModel | null
}
interface RECIEVE_LIKES_OK {
    type: 'RECIEVE_LIKES_OK';
    likes: Like[]
}
interface COMMENT_RECEIVED {
    type: 'COMMENT_RECEIVED'
    newComment: Comment
}
interface LIKE_RECEIVED {
    type: 'LIKE_RECEIVED'
    newLike: {
        countsOfLikes: number
        postId: string
        isLiked: boolean
        userId: string
    }
    user: any
}
interface SEND_LIKE {
    type: 'SEND_LIKE'
    userId: string
    postId: string
}
interface SEND_COMMENT {
    type: 'SEND_COMMENT'
    userId: string
    postId: string
    text: string
}
interface RECIEVE_POSTS_GROUP_OK {
    type: 'RECIEVE_POSTS_GROUP_OK'
    posts: Post[]
    group: Group | null
}
interface RECIEVE_POSTS_BAD {
    type: 'RECIEVE_POSTS_BAD'
}
interface CREATE_POST {
    type: 'CREATE_POST'
    postText: string
    pictureLink: string[] | undefined
    groupId: string | undefined
    userId: string
}

type KnownAction = CREATE_POST | COMMENT_RECEIVED | SEND_COMMENT | SEND_LIKE | RECIEVE_LIKES_OK | LIKE_RECEIVED | RECIEVE_POSTS_GROUP_OK | CREATE_POST_REQUEST | CREATE_POST_RECEIVE_OK | CREATE_POST_RECEIVE_BAD | RECIEVE_POSTS_OK | RECIEVE_POSTS_BAD;

export const actionCreators = {
    sendPost: (postText: string, pictureLink?: string[], groupId?: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const token = await authService.getAccessToken();
        const [user] = await Promise.all([authService.getUser()])
        dispatch({ type: 'CREATE_POST', postText: postText, userId: user.sub, groupId: groupId, pictureLink: pictureLink })
    },
    requestPosts: (method: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        const token = await authService.getAccessToken();
        if (method === 'Profile') {
            if (appState.profile && appState.profile.user) {
                fetch(`api/getPosts?userId=${appState.profile.user.id}`, {
                    method: 'GET',
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then(response => {
                        return response.ok
                            ? response.json()
                            : []
                    })
                    .then(data => {
                        dispatch({ type: 'RECIEVE_POSTS_OK', posts: data, user: appState.profile!.user })
                    })
            }
        }
        else if (method === 'Group') {
            if (appState.group && appState.group.group.id) {
                fetch(`api/getPosts?userId=${appState.group.group.id}`, {
                    method: 'GET',
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then(response => {
                        return response.ok
                            ? response.json()
                            : []
                    })
                    .then(data => {
                        dispatch({ type: 'RECIEVE_POSTS_GROUP_OK', posts: data, group: appState.group!.group })
                    })
            }
        } else if (method === 'News') {
            const isAuthenticated = await authService.isAuthenticated()
            if (isAuthenticated.valueOf()) {
                fetch(`api/getNewsPosts`, {
                    method: 'GET',
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    },
                })
                    .then(response => {
                        return response.ok
                            ? response.json()
                            : []
                    })
                    .then(data => {
                        dispatch({ type: 'RECIEVE_POSTS_OK', posts: data, user: appState.profile!.user })
                    })
            }
        }
    },
    getLike: (postId: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        fetch(`api/getLike?postId=${postId}`, {
            method: 'GET',
        })
            .then(response => {
                return (response.json() as Promise<Like[]>)
            })
            .then(data => dispatch({ type: 'RECIEVE_LIKES_OK', likes: data }))
        dispatch({ type: 'CREATE_POST_REQUEST' })
    },
    sendLike: (postId: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        let user = await authService.getUser()
        dispatch({ type: 'SEND_LIKE', userId: user.sub, postId: postId })
    },
    sendComment: (postId: string, text: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        let user = await authService.getUser()
        dispatch({ type: 'SEND_COMMENT', userId: user.sub, postId: postId, text: text })
    },
};

const unloadedState: PostsState = { recievedSuccess: false, posts: [], user: null, group: null };

export const reducer: Reducer<PostsState> = (state: PostsState | undefined, incomingAction: Action): PostsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'LIKE_RECEIVED':
            return {
                ...state,
                posts: state.posts.map((data) => {
                    if (data.id === action.newLike.postId) {
                        data.likes = action.newLike.countsOfLikes
                        if (action.user.sub === action.newLike.userId)
                            data.isLiked = action.newLike.isLiked
                    }
                    return data
                })
            }
        case 'RECIEVE_POSTS_OK':
            return {
                ...state,
                user: action.user,
                posts: action.posts,
            };
        case 'COMMENT_RECEIVED':
            return {
                ...state,
                posts: state.posts.map((data) => {
                    if (data.id === action.newComment.postId) {
                        data.comments = [...data.comments, action.newComment]
                    }
                    return data
                })
            };
        case 'RECIEVE_POSTS_GROUP_OK':
            return {
                ...state,
                group: action.group,
                posts: action.posts,
            };
        case 'RECIEVE_POSTS_BAD':
            return {
                ...state
            };
        case 'CREATE_POST_REQUEST':
            return {
                ...state,
                recievedSuccess: false
            };
        case 'CREATE_POST_RECEIVE_OK':
            return {
                ...state,
                posts: [action.post, ...state.posts],
                recievedSuccess: true
            };
        case 'CREATE_POST_RECEIVE_BAD':
            return {
                ...state,
                recievedSuccess: false
            };
    }
    return state;
};
