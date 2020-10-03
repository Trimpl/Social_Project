import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { LoginMenu } from './api-authorization/LoginMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faComments, faCommentAlt, faNewspaper } from '@fortawesome/free-solid-svg-icons'

export default class NavMenu extends React.PureComponent<{}, { isOpen: boolean }> {
    public state = {
        isOpen: false
    };

    public render() {
        return (
            <header>
                <Navbar className="navbar navbar-expand-md navbar-light box-shadow mb-5 fixed-top bg-light" >
                    <Container>
                        <NavbarBrand tag={Link} to="/">MSN</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2" />
                        <Collapse className="" isOpen={this.state.isOpen} navbar>
                            <ul className="navbar-nav flex-grow">
                                <LoginMenu></LoginMenu>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}
