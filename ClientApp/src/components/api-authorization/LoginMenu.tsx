import React, { Component, Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser, faUsers, faComments, faCommentAlt, faNewspaper } from '@fortawesome/free-solid-svg-icons'
import Notifications from '../Notifications/Notifications';

interface IProps {
    //action: any
}
interface IState {
    isAuthenticated: boolean,
    userName: string | null,
    userId: string | null,
    firstName: string,
    secondName: string,
    img: string

}

export class LoginMenu extends Component<IProps, IState> {
    _subscription: any
    constructor(props: IProps) {
        super(props);

        this.state = {
            isAuthenticated: false,
            userName: null,
            userId: null,
            firstName: '',
            secondName: '',
            img: ''
        };
    }

    componentDidMount() {
        this._subscription = authService.subscribe(() => this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this._subscription);
    }

    async getProfileAuthView() {
        const token = await authService.getAccessToken()
        fetch(`api/ProfileAuthView`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                return response.ok
                    ? response.json()
                    : []
            })
            .then(data => {
                this.setState({ firstName: data.firstName, secondName: data.secondName, img: data.avatar })
            });
    }

    async populateState() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
        await this.getProfileAuthView()
        this.setState({
            isAuthenticated,
            userName: user && user.Email,
            userId: user && user.sub
        });
    }

    render() {
        const { isAuthenticated, userName, userId } = this.state;
        if (!isAuthenticated) {
            const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return this.anonymousView(registerPath, loginPath);
        } else {
            const profilePath = `${ApplicationPaths.Profile}`;
            const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
            return this.authenticatedView(userName, userId, profilePath, logoutPath);
        }
    }

    authenticatedView(userName: {} | null | undefined, userId: {} | null | undefined, profilePath: string, logoutPath: { pathname: string; state: { local: boolean; }; }) {
        return (
            <Fragment>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/"><FontAwesomeIcon icon={faNewspaper} /> News</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/Friends"><FontAwesomeIcon icon={faUsers} /> Friends</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/Dialogs"><div id='Dialogs'><FontAwesomeIcon icon={faCommentAlt} /> Dialogs</div></NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/ListOfGroups"><FontAwesomeIcon icon={faComments} /> Groups</NavLink>
                </NavItem>
                <NavItem>
                    <Notifications />
                </NavItem>
                <NavItem className="dropDown">
                    <div className="dropdown">
                        <button className="btn dropdown-toggle top_name_select" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src={this.state.img} alt="" />
                            {this.state.firstName}
                        </button>
                        <div className="dropdown-menu animate slideIn" aria-labelledby="dropdownMenuButton">
                            <Link className="text-dark" to={`/Profile/${userId}`}>
                                <div className="dropdown-item notifications row_notification profile_select">
                                    <img src={this.state.img} alt="" className="row_notification" />
                                    <div className="row_notification">
                                        <div className="top_name">
                                            {this.state.firstName} {this.state.secondName}
                                        </div>
                                        <div className="bottom_name">
                                            Go to profile
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/EditProfile">
                                <div className="dropdown-item notifications row_notification">
                                    <div className="row_notification link_select">
                                        Edit profile
                                    </div>
                                </div>
                            </Link>
                            <Link to={logoutPath}>
                                <div className="dropdown-item notifications row_notification">
                                    <div className="row_notification link_select">
                                        Logout
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </NavItem>
            </Fragment>);
    }

    anonymousView(registerPath: string, loginPath: string) {
        return (<Fragment>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={'/MyRegister'}>Register</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={"/MyLogin"}>Login</NavLink>
            </NavItem>
        </Fragment>);
    }
}
