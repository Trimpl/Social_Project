import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../store';
import * as CreatePostStore from '../../store/Posts/PostsStore'
import { CreateComment } from '../Comments/CreateComment';
import { ListOfComments } from '../Comments/ListOfComments';
import { Img } from '../Images/Image';
import { LikeBtn } from './LikeBtn';

type CreatePostProps =
    CreatePostStore.PostsState &
    typeof CreatePostStore.actionCreators &
    RouteComponentProps<{}>;

interface IState {
    postText: string
    pictureLink: string[]
}

class ListOfPosts extends React.PureComponent<CreatePostProps, IState> {
    constructor(props: CreatePostProps) {
        super(props)
        this.state = {
            postText: '',
            pictureLink: []
        }
    }
    componentDidMount() {
        const location = window.location.pathname
        if (location.includes('Profile')) {
            this.props.requestPosts('Profile')
        } else if (location.includes('Group')) {
            this.props.requestPosts('Group')
        } else if (location === '/') {
            this.props.requestPosts('News')
        }
    }
    showAll(id: string) {
        const elementClass = document.getElementById(id)!.className
        document.getElementById(id)!.className = elementClass == "wall_post_text" ? "wall_post_text_cut" : "wall_post_text"
    }
    renderText(text: string, id: string) {
        if (text.length > 500) {
            return (
                <div>
                    <div id={id} className="wall_post_text_cut">{text}</div>
                    <button className="btn btn-link" onClick={() => this.showAll(id)}>Show all</button>
                </div>
            )
        } else {
            return (
                <div className="wall_post_text pl-2">{text}</div>
            )
        }
    }
    renderPosts() {
        if (this.props.posts) {
            return (
                <div className="row justify-content-center">
                    <div className="px-1 col-12 col-lg-8 col-xl-8">
                        {this.props.posts.map(data => {
                            let postDate = new Date(data.createDate)
                            let date: string
                            if (postDate.toLocaleDateString() == new Date().toLocaleDateString()) {
                                date = postDate.toLocaleTimeString()
                            } else {
                                date = `${postDate.toLocaleDateString()} ${postDate.toLocaleTimeString()}`
                            }
                            return (
                                <div key={data.id} className="post_content bg-white my-3 py-2 rounded shadow">
                                    <Link to={data.link}>
                                        <div className="post_header pl-4">
                                            <img src={data.avatar} alt="" width="50" height="50" className="img-avatar" />
                                            <div className="post_header_info">
                                                <h5 className="post_author">{data.userId}</h5>
                                                <div className="post_date">
                                                    {date}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="mt-3 pl-3">
                                        {this.renderText(data.postText, data.id)}
                                        <div className="row ml-1 my-2">
                                            {data.pictureLink.map((picture) => {
                                                return (
                                                    <Img link={picture.pictureLink} id={picture.id} key={picture.id}/>
                                                )
                                            })}
                                        </div>
                                        <ListOfComments comments={data.comments} />
                                        <div className="row">
                                            <CreateComment postId={data.id} sendComment={this.props.sendComment} />
                                            <LikeBtn likes={data.likes} postId={data.id}
                                                isLiked={data.isLiked} sendLike={this.props.sendLike} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        }
    }
    render() {
        return (
            <div>
                {this.renderPosts()}
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.createPost,
    CreatePostStore.actionCreators
)(ListOfPosts as any);