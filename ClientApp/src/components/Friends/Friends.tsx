import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as FriendsStore from '../../store/Friends/FriendsStore'
import PanelOfFriend from './PanelOfFriend';

type FriendsProps =
FriendsStore.FriendsState &
    typeof FriendsStore.actionCreators &
    RouteComponentProps<{}>;

class Friends extends React.PureComponent<FriendsProps> {
    public componentDidMount() {
        this.ensureDataFetched()
    }
    private ensureDataFetched() {
        this.props.requestFriends()
        this.props.requestNotFriends()
    }
    public renderListOfFriends() {
        if (this.props.listOfFriends == []) {
            return
        } else {
            return (
                this.props.listOfFriends.map(data => <PanelOfFriend key={data.id} friend={data} isFriend={true}/>)
            )
        }
    }
    public renderListOfNotFriends() {
        if (this.props.listOfNotFriends == []) {
            return
        } else {
            return (
                this.props.listOfNotFriends.map(data => <PanelOfFriend key={data.id} friend={data} isFriend={false}/>)
            )
        }
    }
    public render() {
        return (
            <React.Fragment>
                <div className="bg-white">
                    <div className="border-bottom border-dark">
                        {this.renderListOfFriends()}
                    </div>
                    {this.renderListOfNotFriends()}
                </div>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.friends,
    FriendsStore.actionCreators
)(Friends as any);