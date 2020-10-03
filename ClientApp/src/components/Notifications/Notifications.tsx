import * as React from 'react';
import * as NotificationStore from '../../store/Notifications/Notifications';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

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
    }
    public componentDidMount() {
        this.ensureDataFetched()
    }
    private remove() {
        const a = this.props.notifications.map(data => data.id)
        this.props.removeNotifications(a)
        this.setState({ count: this.props.notifications.length === 0 ? '' : this.props.notifications.length.toString() })
    }
    private ensureDataFetched() {
        this.props.request()
    }
    public renderButton() {
        this.setState({ count: this.props.notifications.length === 0 ? '' : this.props.notifications.length.toString() })
    }
    render() {
        var count = this.props.notifications.length === 0 ? '' : this.props.notifications.length.toString()
        return (
            <React.Fragment>
                <div className="dropdown">
                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        onClick={() => this.remove()}>
                        <span className="badge badge-pill badge-warning">{count}</span>
                        <FontAwesomeIcon icon={faBell} />
                    </button>
                    {count != ''
                        ?
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {this.props.notifications.map((data) => {
                                const b = data.image != "" ? <img src={data.image} width="10" height="10" alt="" /> : <div></div>
                                return (
                                    <a key={data.id} className="dropdown-item">
                                        <div>
                                            {b}
                                            {data.text}
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                        :
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <div style={{marginLeft: 10}}>
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