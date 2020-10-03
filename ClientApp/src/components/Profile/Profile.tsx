import * as React from 'react';
import * as ProfileStore from '../../store/Profile/ProfileStore';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { Link } from 'react-router-dom';
import CreatePost from '../Posts/CreatePost';
import PhotoAlbum from '../PhotoAlbum/PhotoAlbum';
import ListOfPosts from '../Posts/ListOfPosts';
import './profile.scss'
import { Img } from '../Images/Image';
import { ListOfFriends } from './ListOfSubs';

type ProfileProps =
    ProfileStore.ProfileState &
    typeof ProfileStore.actionCreators &
    RouteComponentProps<{ userId: string }>;

class Profile extends React.PureComponent<ProfileProps> {
    public componentDidMount() {
        this.ensureDataFetched()
    }
    public componentDidUpdate() {
        if (this.props.user !== null && this.props.user!.id !== this.props.match.params.userId)
            this.ensureDataFetched()
    }
    private ensureDataFetched() {
        this.props.requestProfile(this.props.match.params.userId)
        this.props.requestFriends(this.props.match.params.userId)
    }
    private renderUser() {
        if (this.props.user !== null) {
            return (
                <div>
                    <div className="row justify-content-center">
                        <div className="page_block rounded shadow bg-white py-2 mb-3 col-6 col-lg-4 col-xl-5 align-self-start ml-3">
                            <Img link={this.props.user.avatar} id={this.props.user.id} />
                            {this.props.user.isAuthor
                                ? <div className="text-center">
                                    <Link to="/EditProfile">
                                        <div className="btn_send_profile">
                                            <span className="noselect">Edit Profile</span>
                                            <div id="circle"></div>
                                        </div>
                                    </Link>
                                    <Link to="/CreateGroup">
                                        <div className="btn_send_profile">
                                            <span className="noselect">CreateGroup</span>
                                            <div id="circle"></div>
                                        </div>
                                    </Link>
                                </div>
                                : <div className="text-center">
                                    <Link to={`/Dialog/${this.props.user.id}`}>
                                        <div className="btn_send_profile">
                                            <span className="noselect">Chat now!</span>
                                            <div id="circle"></div>
                                        </div>
                                    </Link>
                                </div>}
                        </div>
                        <div className="col-6 col-lg-4 col-xl-5 div_info mb-5">
                            <div className="rounded shadow bg-white p-2">
                                <h5>{this.props.user.firstName} {this.props.user.secondName}</h5>
                                <p>City: {this.props.user.city}</p>
                                <p>Coutnry: {this.props.user.country}</p>
                                <p>Date of birth: {this.props.user.dateOfBirth.toUTCString}</p>
                                <p>Languages: {this.props.user.languages}</p>
                                <p>Family status: {this.props.user.familyStatus}</p>
                            </div>
                            <div className="rounded shadow bg-white p-2 mt-3 subs">
                                <h5>Subscribers:</h5>
                                <ListOfFriends listOfFrfiends={this.props.listOfFriends} />
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8 col-xl-8 px-1 mb-3 bg-white rounded">
                            <PhotoAlbum />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8 col-xl-8 px-1">
                            <CreatePost />
                        </div>
                    </div>
                    <div>
                        <ListOfPosts />
                    </div>
                </div >
            )
        } else {
            return (
                <div></div>
            )
        }
    }
    public render() {
        return (
            <React.Fragment>
                {this.props.isLoading}
                {this.renderUser()}
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.profile,
    ProfileStore.actionCreators
)(Profile as any);