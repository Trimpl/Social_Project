import * as React from 'react';
import * as NotificationStore from '../../store/Notifications/Notifications';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { ViewPost } from '../Posts/ViewPost';
import { Post } from '../../store/Posts/PostsStore';
import notification from './noti.png'

type NotificationProps =
    NotificationStore.NotificationsState &
    typeof NotificationStore.actionCreators &
    RouteComponentProps<{}>;
interface IState {
    count: string
}
class Notifications extends React.PureComponent<NotificationProps, IState> {
    constructor(props: NotificationProps) {
        super(props)
        this.state = {
            count: this.props.notifications.length === 0 ? '' : this.props.notifications.length.toString()
        }
        this.remove = this.remove.bind(this)
    }
    public componentDidMount() {
        this.ensureDataFetched()
    }
    private remove(id: string, e: React.MouseEvent) {
        const a = [id]
        this.props.removeNotifications(a)
        this.setState({ count: this.props.notifications.length === 0 ? '' : this.props.notifications.length.toString() })
        // $('.dropdown-menu').click(function(e) {
        //     e.stopPropagation();
        // });
    }
    private ensureDataFetched() {
        this.props.request()
    }
    public renderButton() {
        this.setState({ count: this.props.notifications.length === 0 ? '' : this.props.notifications.length.toString() })
    }
    public prevent(e: React.MouseEvent) {
        //console.log(e.currentTarget)
    }
    private renderViewPost(id: string) {
        this.props.renderViewPost(id)
    }
    private deleteViewPost() {
        this.props.deleteViewPost()
    }
    render() {
        var count = this.props.notifications.length === 0 ? '' : this.props.notifications.length.toString()
        var viewPost = this.props.post ? <ViewPost sendLike={this.props.sendLike}
            sendComment={this.props.sendComment}
            post={this.props.post}
            delete={this.deleteViewPost.bind(this)} /> : ''
        return (
            <React.Fragment>
                {viewPost}
                <div className="dropdown" id="notification_drop_down">
                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="badge text-light badge-pill badge-danger">{count}</span>
                        {/* <FontAwesomeIcon icon={faBell} /> */}
                        <img src={notification} id="notification_image" alt="" />
                    </button>
                    {count != ''
                        ?
                        <div className="dropdown-menu animate slideIn"
                            aria-labelledby="dropdownMenuButton"
                            onClick={(event) => this.prevent(event)}>
                            {this.props.notifications.map((data) => {
                                let postDate = new Date(data.createDate)
                                let date: string = (postDate.toLocaleDateString() == new Date().toLocaleDateString())
                                    ? postDate.toLocaleTimeString()
                                    : `${postDate.toLocaleDateString()} ${postDate.getHours()}:${postDate.getMinutes()}`
                                const b = data.image != "" ? <img src={data.image} alt="" /> : <div></div>
                                return (
                                    <div key={data.id}
                                        className="dropdown-item notifications_item">
                                        <div className="row_notification">{b}</div>
                                        <div className="row_notification feedback_header"
                                            onClick={() => this.renderViewPost(data.postId)}>{data.text}</div>
                                        {/* <FontAwesomeIcon icon={faTrashAlt} 
                                        onClick={(event) => this.remove(data.id, event)} /> */}
                                        <select name="" id=""></select>
                                        <div className="feedback_footer">{date}</div>
                                    </div>
                                )
                            })}
                        </div>
                        :
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <div style={{ marginLeft: 10 }}>
                                No notifications
                            </div>
                        </div>}
                </div>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.notification,
    NotificationStore.actionCreators
)(Notifications as any);