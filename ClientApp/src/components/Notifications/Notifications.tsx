import * as React from 'react';
import * as NotificationStore from '../../store/Notifications/Notifications';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { ViewPost } from '../Posts/ViewPost';

type NotificationProps =
    NotificationStore.NotificationsState &
    typeof NotificationStore.actionCreators &
    RouteComponentProps<{}>;
interface IState {
    count: string
    post: JSX.Element
}
class Notifications extends React.PureComponent<NotificationProps, IState> {
    constructor(props: NotificationProps) {
        super(props)
        this.state = {
            count: this.props.notifications.length === 0 ? '' : this.props.notifications.length.toString(),
            post: <div></div>
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
        console.log(e.currentTarget)
        // $('.dropdown-menu').click(function(e) {
        //     e.stopPropagation();
        // });
    }
    private renderViewPost() {
        console.log('POSHEL NAXUI')
    }
    render() {
        var count = this.props.notifications.length === 0 ? '' : this.props.notifications.length.toString()
        return (
            <React.Fragment>
                {this.state.post}
                {/* <button onClick={() => this.renderViewPost()}>
                    poshel naxui
                </button> */}
                <div className="dropdown">
                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                    >
                        <span className="badge badge-pill badge-warning">{count}</span>
                        <FontAwesomeIcon icon={faBell} />
                    </button>
                    {count != ''
                        ?
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" onClick={(event) => this.prevent(event)}>
                            {this.props.notifications.map((data) => {
                                const b = data.image != "" ? <img src={data.image} alt="" /> : <div></div>
                                return (
                                    <div key={data.id} className="dropdown-item notifications">
                                        <div>
                                            {b}
                                            <div onClick={() => this.renderViewPost()}>{data.text}</div>
                                            <FontAwesomeIcon icon={faTrashAlt} onClick={(event) => this.remove(data.id, event)} />
                                        </div>
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