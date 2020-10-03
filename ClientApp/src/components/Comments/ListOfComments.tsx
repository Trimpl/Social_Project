import * as React from 'react';
import { Link } from 'react-router-dom';
import './listOfComments.scss'
export interface Comment {
    id: string
    userId: string
    postId: string
    text: string
    createDate: Date
    avatar: string
    link: string
}
interface IProps {
    comments: Comment[]
}
interface IState {
}

export class ListOfComments extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
    }
    showAll(id: string) {
        const elementClass = document.getElementById(id)!.className
        document.getElementById(id)!.className = elementClass == "wall_post_text" ? "wall_post_text_cut" : "wall_post_text"
    }
    renderText(text: string, id: string) {
        if (text.length > 300) {
            return (
                <div>
                    <div id={id} className="comment_post_text_cut">{text}</div>
                    <button className="btn btn-link" onClick={() => this.showAll(id)}>Show all</button>
                </div>
            )
        } else {
            return (
                <div className="comment_post_text">{text}</div>
            )
        }
    }
    render() {
        if (this.props.comments && this.props.comments.length != 0) {
            return (
                <div className="border-top border-bottom border-blue mb-1 comment_post_div">
                    {this.props.comments.map((data) => {
                        let postDate = new Date(data.createDate)
                        let date: string
                        if (postDate.toLocaleDateString() == new Date().toLocaleDateString()) {
                            date = postDate.toLocaleTimeString()
                        } else {
                            date = `${postDate.toLocaleDateString()} ${postDate.toLocaleTimeString()}`
                        }
                        return (
                            <div key={data.id} className="comment_post_content mb-1">
                                <Link to={`/Profile/${data.link}`}>
                                    <div className="comment_post_header">
                                        <img src={data.avatar} alt="" width="30" height="30" className="img-avatar" />
                                        <div className="comment_post_header_info">
                                            <h5 className="comment_post_author">{data.userId}</h5>
                                            <div className="comment_post_date">
                                                {date}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div>
                                    {this.renderText(data.text, data.id)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }
}
