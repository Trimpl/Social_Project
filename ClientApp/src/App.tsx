import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import './custom.scss'
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import LoginForm from './components/api-auth/LoginForm';
import { NotFound } from './components/NotFound';
import RegisterForm from './components/api-auth/RegisterForm';
import { BadConfirmEmail, ConfirmEmailSuccess } from './components/api-auth/ConfirmEmail';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import Friends from './components/Friends/Friends';
import Dialog from './components/Chat/Dialog';
import { Dialogs } from './components/Chat/Dialogs';
import CreateGroup from './components/Groups/CreateGroup';
import GetGroup from './components/Groups/GetGroup';
import { ListOfGroups } from './components/Groups/ListOfGroups';
import { Img } from './components/Images/Image';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/MyLogin' component={LoginForm} />
        <Route path='/MyRegister' component={RegisterForm} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
        <Route path='/notfound' component={NotFound} />
        <Route path='/BadConfirmEmail' component={BadConfirmEmail} />
        <Route path='/ConfirmEmailSuccess' component={ConfirmEmailSuccess} />
        <Route path='/Dialog/:toUserId' component={Dialog} />
        <Route path='/Profile/:userId' component={Profile} />
        <Route path='/Dialogs' component={Dialogs} />
        <AuthorizeRoute path='/EditProfile' component={EditProfile} />
        <Route path='/Friends' component={Friends} />
        <AuthorizeRoute path='/CreateGroup' component={CreateGroup} />
        <AuthorizeRoute path='/EditGroup/:id' component={CreateGroup} />
        <Route path='/Group/:id' component={GetGroup} />
        <Route path='/ListOfGroups' component={ListOfGroups} />
        <Route path='/Image/:id/:link' component={Img} />
    </Layout>
);
