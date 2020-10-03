import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as CreatePostStore from '../../store/Posts/PostsStore'
import { Img } from '../Images/Image';
import { FileInput } from '../Profile/FileInput';
import './createPost.scss'

type CreatePostProps =
    CreatePostStore.PostsState &
    typeof CreatePostStore.actionCreators &
    RouteComponentProps<{}>;

interface IState {
    postText: string
    pictureLink: string[]
}

class CreatePost extends React.PureComponent<CreatePostProps, IState> {
    constructor(props: CreatePostProps) {
        super(props)
        this.state = {
            postText: '',
            pictureLink: []
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleInputFileChange = this.handleInputFileChange.bind(this)
    }
    componentDidMount() {
        window.location.pathname.includes('Profile')
            ? this.props.requestPosts('Profile') : this.props.requestPosts('Group')
    }
    handleInputFileChange(file: string) {
        this.setState(prevState => ({
            ...prevState,
            pictureLink: [...prevState.pictureLink, file]
        }))
    }
    handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ postText: event.target.value });
    }
    renderCreatePost() {
        if (window.location.pathname.includes('Profile')) {
            if (this.props.user != null) {
                return (
                    this.props.user.isAuthor
                        ?
                        <div className="form__group_post field rounded shadow bg-white px-5">
                            <textarea className="form__field_post" placeholder="Name" name="name" required
                                onChange={this.handleInputChange} value={this.state.postText} />
                            <label className="form__label_post">Send post</label>
                            <div className="d-flex">
                                <div className="btn_send_post" onClick={this.sendPost.bind(this)}>
                                    <span className="noselect">Send</span>
                                    <div id="circle"></div>
                                </div>
                                <FileInput onImageChange={this.handleInputFileChange} id={'post'} key={"post"}/>
                            </div>
                            {this.state.pictureLink != []
                                    ? this.state.pictureLink.map((data, index) => <Img link={data} id={index.toString()} />)
                                    : <div></div>}
                        </div>
                        : <div></div>
                )
            }
        } else {
            if (this.props.group != null) {
                return (
                    true
                        ?
                        <div className="form__group_post field rounded shadow bg-white px-5">
                            <textarea className="form__field_post" placeholder="Name" name="name" required
                                onChange={this.handleInputChange} value={this.state.postText} />
                            <label className="form__label_post">Send post</label>
                            <div className="d-flex">
                                <div className="btn_send_post" onClick={this.sendPost.bind(this)}>
                                    <span className="noselect">Send</span>
                                    <div id="circle"></div>
                                </div>
                                <FileInput id={'post'} onImageChange={this.handleInputFileChange} key={'post'}/>
                            </div>
                        </div>
                        : <div></div>
                )
            }
        }
    }
    sendPost(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (window.location.pathname.includes('Profile')) {
            this.props.sendPost(this.state.postText, this.state.pictureLink)
            this.setState({
                postText: '',
                pictureLink: []
            })
        } else {
            this.props.sendPost(this.state.postText, this.state.pictureLink, this.props.group!.id)
            this.setState({
                postText: '',
                pictureLink: []
            })
        }
    }
    render() {
        return (
            <div>
                {this.renderCreatePost()}
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.createPost,
    CreatePostStore.actionCreators
)(CreatePost as any);