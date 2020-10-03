import * as React from 'react';
import './commentInput.scss'
interface IProps {
    postId: string
    sendComment: any
}
interface IState {
    commentText: string
}

export class CreateComment extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            commentText: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    componentDidMount() {
    }
    handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ commentText: event.target.value });
    }
    renderCreatePost() {
        return (
            <div className="form__group field">
                <textarea className="form__field" placeholder="Name" name="name" required
                    onChange={this.handleInputChange} value={this.state.commentText} />
                <label className="form__label">Send comment</label>
                <div className="btn_send" onClick={this.sendComment.bind(this)}>
                    <span className="noselect">Send</span>
                    <div id="circle"></div>
                </div>
            </div>
        )
    }
    sendComment(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.props.sendComment(this.props.postId, this.state.commentText)
        this.setState({ commentText: "" })
    }
    render() {
        return (
            <div className="col-md-10 col-xs-6 col-xl-10 col-9">
                {this.renderCreatePost()}
            </div>
        )
    }
}