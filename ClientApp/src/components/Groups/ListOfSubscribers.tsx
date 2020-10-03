import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../store';
import * as GroupStore from '../../store/Groups/GroupStore'

type GroupeProps =
    GroupStore.GroupState &
    typeof GroupStore.actionCreators &
    RouteComponentProps<{}>;

class ListOfSubscribers extends React.PureComponent<GroupeProps, {}> {
    constructor(props: GroupeProps) {
        super(props)
    }
    componentDidMount() {
        this.props.getListOfSubscribers(this.props.group.id)
    }
    renderAdminList() {
        return (
            this.props.admins.map((data) => {
                let name = data.firstName.length === 0 ? 'Name' : data.firstName
                return (
                    <div className="people_cell" key={data.id}>
                        <Link to={`/Profile/${data.id}`} >
                            <img src={data.avatar} height="50" width="50" className="img-avatar" alt="" />
                            <div className="people_cell_name">{name}</div>
                        </Link>
                        {this.renderMakeAdminBtn('Unadmin', this.props.group.id, data.id)}
                    </div>
                )
            })
        )
    }
    renderUserList() {
        return (
            this.props.users.map((data) => {
                let name = data.firstName.length === 0 ? 'Name' : data.firstName
                return (
                    <div className="people_cell" key={data.id}>
                        <Link to={`/Profile/${data.id}`} >
                            <img src={data.avatar} height="50" width="50" className="img-avatar" alt="" />
                            <div className="people_cell_name">{name}</div>
                        </Link>
                        {this.renderMakeAdminBtn('Admin', this.props.group.id, data.id)}
                    </div>
                )
            })
        )
    }
    renderMakeAdminBtn(text: string, groupId: string, userId: string) {
        if (this.props.isAuthor) {
            return (
                <div className="btn btn-primary btn-sm" onClick={() => {
                    this.props.request({
                        groupId: groupId, userId: userId
                    }, 'ChangeGroupAdmin')
                    this.render()
                }}>
                    {text}
                </div>
            )
        }
    }
    render() {
        return (
            <div>
                <div className="row justify-content-center">
                    <div className="rounded shadow bg-white p-2 mt-3 subs col-12 col-lg-8 col-xl-8 px-1" >
                        <h5>Admins:</h5>
                        {this.renderAdminList()}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="rounded shadow bg-white p-2 mt-3 subs col-12 col-lg-8 col-xl-8 px-1 mb-3" >
                        <h5>Subscribers:</h5>
                        {this.renderUserList()}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.group,
    GroupStore.actionCreators
)(ListOfSubscribers as any);