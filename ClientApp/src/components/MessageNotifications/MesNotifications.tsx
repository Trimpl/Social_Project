import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as MesNotificationsStore from '../../store/MessageNotifications/MesNotifcationsStore';
import './mn.scss'

type MesNotificationsProps =
    MesNotificationsStore.MesNotificationsState &
    typeof MesNotificationsStore.actionCreators &
    RouteComponentProps<{}>;
interface IState {
}
class MesNotifications extends React.PureComponent<MesNotificationsProps, IState> {
    constructor(props: MesNotificationsProps) {
        super(props)
        this.state = {

        }
    }
    render() {
        if (this.props.messages.length != 0)
            return (
                <div id="notifications">
                    {this.props.messages.map(data => {
                        this.props.deleteNotification(data)
                        return (
                            <div key={data.id} className='content_not pb-4'>
                                <div className="header_not">
                                    <img src={data.avatar} alt="" width="30" height="30" className="img-avatar_not" />
                                    <div className="header_info_not">
                                        <h5 className="author_not">{data.firstUserId}</h5>
                                    </div>
                                    <div className="text_not">
                                        {data.message}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        else return (<div></div>)

    }
};

export default connect(
    (state: ApplicationState) => state.mesNotifications,
    MesNotificationsStore.actionCreators
)(MesNotifications as any);