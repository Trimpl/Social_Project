import * as React from 'react';
import { Link } from 'react-router-dom';
import { Friend } from '../../store/Friends/FriendsStore';
import authService from '../api-authorization/AuthorizeService';
import './friends.scss'
interface IProps {
    friend: Friend,
    isFriend: boolean
}
class PanelOfFriend extends React.PureComponent<IProps, { isFriend: boolean }> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isFriend: this.props.isFriend
        }
    }
    public componentDidMount() {
    }
    public renderButton() {
        if (this.state.isFriend) {
            return (
                <div className="btn_send_friend link" onClick={this.addDeleteFriend.bind(this)}>
                    <span className="noselect">Unsubscribe</span>
                    <div id="circle"></div>
                </div>
            )
        } else {
            return (
                <div className="btn_send_friend link" onClick={this.addDeleteFriend.bind(this)}>
                    <span className="noselect">Subscribe</span>
                    <div id="circle"></div>
                </div>
            )
        }
    }
    public async addDeleteFriend() {
        const token = await authService.getAccessToken();
        fetch(`api/friends/addDeleteFriend?friendId=${this.props.friend.id}`, {
            method: 'POST',
            headers: !token ? {} : {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                if (!response.ok) {
                } else {
                    this.setState({ isFriend: !this.state.isFriend })
                }
            })
    }
    public render() {
        return (
            <React.Fragment>
                <div>
                    <div className="post_content mx-sm-5">
                        <div className="post_header">
                            <img src={this.props.friend.avatar} alt="" width="50" height="50" className="img-avatar" />
                            <div className="post_header_info">
                                <h5 className="post_author">{`${this.props.friend.firstName} ${this.props.friend.secondName}`}</h5>
                                <div className="post_date">
                                    {this.props.friend.dateOfBirth.toUTCString}
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.renderButton()}
                    <div className="link">
                        <Link to={`/Profile/${this.props.friend.id}`}>
                            <div className="btn_send_friend">
                                <span className="noselect">Watch profile</span>
                                <div id="circle"></div>
                            </div>
                        </Link>
                    </div>
                    <div className="link mb-2">
                        <Link to={`/Dialog/${this.props.friend.id}`}>
                            <div className="btn_send_friend">
                                <span className="noselect">Chat now!</span>
                                <div id="circle"></div>
                            </div>
                        </Link>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};


export default PanelOfFriend