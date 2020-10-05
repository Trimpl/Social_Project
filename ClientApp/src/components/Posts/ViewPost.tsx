import * as React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Post } from '../../store/Posts/PostsStore';
import { CreateComment } from '../Comments/CreateComment';
import { ListOfComments } from '../Comments/ListOfComments';
import { Img } from '../Images/Image';
import { LikeBtn } from './LikeBtn';

interface IState {
    post: JSX.Element
}
interface IProps {
    post: Post
    delete: () => void
}

export class ViewPost extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            post: <div></div>
        }
    }
    _destroy = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // - Удаление компонента из DOM
        this.setState({
            post:
                <div></div>
        })
        ReactDOM.unmountComponentAtNode(document.body);
    }
    closeModalPicture() {
        this.setState({
            post:
                <div></div>
        })
        this.props.delete()
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
    componentDidMount() {
        let postDate = new Date(this.props.post.createDate)
        let date: string
        if (postDate.toLocaleDateString() == new Date().toLocaleDateString()) {
            date = postDate.toLocaleTimeString()
        } else {
            date = `${postDate.toLocaleDateString()} ${postDate.toLocaleTimeString()}`
        }
        this.setState({
            post:
                <div className="div_modal">
                    <img alt="" className="image_modal" />
                    <div className="wrapper_btn">
                        <div className="close-button"
                            onClick={() => this.closeModalPicture()}
                        //onClick={this._destroy.bind(this)}
                        //onClick={this.props.delete()}
                        >
                            <div className="in">
                                <div className="close-button-block"></div>
                                <div className="close-button-block"></div>
                            </div>
                            <div className="out">
                                <div className="close-button-block"></div>
                                <div className="close-button-block"></div>
                            </div>
                        </div>
                    </div>
                    <div key={this.props.post.id} className="post_content bg-white my-3 py-2 rounded shadow">
                        <Link to={this.props.post.link}>
                            <div className="post_header pl-4">
                                <img src={this.props.post.avatar} alt="" width="50" height="50" className="img-avatar" />
                                <div className="post_header_info">
                                    <h5 className="post_author">{this.props.post.userId}</h5>
                                    <div className="post_date">
                                        {date}
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="mt-3 pl-3">
                            {this.renderText(this.props.post.postText, this.props.post.id)}
                            <div className="row ml-1 my-2">
                                {this.props.post.pictureLink.map((picture) => {
                                    return (
                                        <Img link={picture.pictureLink} id={picture.id} key={picture.id} />
                                    )
                                })}
                            </div>
                            <ListOfComments comments={this.props.post.comments} />
                            <div className="row">
                                {/* <CreateComment postId={this.props.post.id} sendComment={this.props.sendComment} />
                                <LikeBtn likes={this.props.post.likes} postId={this.props.post.id}
                                    isLiked={this.props.post.isLiked} sendLike={this.props.sendLike} /> */}
                            </div>
                        </div>
                    </div>
                </div>
        })
    }
    render() {
        console.log(this.props.post.postText)
        return (
            <div className="div_image mx-1" id={this.props.post.id}>
                {this.state.post}
            </div>
        )
    }
}

