import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../store';
import * as GroupStore from '../../store/Groups/GroupStore'
import CreatePost from '../Posts/CreatePost';
import ListOfPosts from '../Posts/ListOfPosts';
import ListOfSubscribers from './ListOfSubscribers';
import { Subscribe } from './Subscribe';
import './group.scss'

type GroupeProps =
    GroupStore.GroupState &
    typeof GroupStore.actionCreators &
    RouteComponentProps<{ id: string }>;

interface IState {

}

class GetGroup extends React.PureComponent<GroupeProps, IState> {
    constructor(props: GroupeProps) {
        super(props)
    }
    componentDidMount() {
        this.props.getGroup(this.props.match.params.id)
    }
    renderGroup() {
        if (this.props.group.id != '') {
            return (
                <div>
                    <div className="row justify-content-center">
                        <div key={this.props.group.id} className="bg-white col-12 col-lg-8 col-xl-8 px-1 border border-top border-bottom">
                            <div className="group_content">
                                <div className="group_header">
                                    <img src={this.props.group.avatarLink} alt="" width="50" height="50" className="img-avatar" />
                                    <div className="group_header_info">
                                        <h5 className="group_author">{this.props.group.name}
                                            <div className="group_date absolute">
                                                <Subscribe groupId={this.props.group.id} />
                                                {this.renderAuthView()}
                                            </div>
                                        </h5>
                                        <p>{this.props.group.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ListOfSubscribers />
                    { this.renderAdminView()}
                    <ListOfPosts />
                </div >
            )
        }
    }
    renderAuthView() {
        if (this.props.isAuthor)
            return (
                <div>
                    <Link to={`/EditGroup/${this.props.group.id}`}>
                        <div className="d-flex">
                            <div className="btn_send_friend">
                                <span className="noselect">Edit group</span>
                                <div id="circle"></div>
                            </div>
                        </div>
                    </Link>
                </div>
            )
    }
    renderAdminView() {
        if (this.props.isAdmin)
            return (
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8 col-xl-8 px-1">
                        <CreatePost />
                    </div>
                </div>
            )
    }
    render() {
        return (
            <div>
                {this.renderGroup()}
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.group,
    GroupStore.actionCreators
)(GetGroup as any);