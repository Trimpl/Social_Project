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
    name: string,
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
            name: '',
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
                this.setState({ name: data.name, img: data.avatar })
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
                    <NavLink tag={Link} className="text-dark" to={logoutPath}><FontAwesomeIcon icon={faSignOutAlt} /></NavLink>
                </NavItem>
                <NavItem>
                    <Notifications />
                </NavItem>
                <NavItem className="dropDown">
                    <NavLink tag={Link} className="text-dark" to={`/Profile/${userId}`}>
                        {/* <FontAwesomeIcon icon={faUser} />  */}
                        <img src={this.state.img} alt=""/>
                        {this.state.name} 
                        </NavLink>
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
