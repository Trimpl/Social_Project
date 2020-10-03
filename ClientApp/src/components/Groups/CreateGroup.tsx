import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../store';
import * as GroupStore from '../../store/Groups/GroupStore'
import { Group } from '../../store/Groups/GroupStore';
import { FileInput } from '../Profile/FileInput';
import '../api-auth/form.scss'
import { Img } from '../Images/Image';

type GroupeProps =
    GroupStore.GroupState &
    typeof GroupStore.actionCreators &
    RouteComponentProps<{ id: string }>;

interface IState {
    group: Group
}

class CreateGroupe extends React.PureComponent<GroupeProps, IState> {
    constructor(props: GroupeProps) {
        super(props)
        this.state = {
            group: this.props.group
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputFileChange = this.handleInputFileChange.bind(this);
    }
    componentDidMount() {
        if (this.props.match.params.id != null) this.props.getGroup(this.props.match.params.id)
    }
    handleInputFileChange(file: string) {
        this.setState(({ group }) => ({
            group: {
                ...group,
                avatarLink: file
            }
        }))
    }
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value: string = target.value;
        let name: string = target.name;
        this.setState(({ group }) => ({
            group: {
                ...group,
                [name]: value
            }
        }))
    }
    handleSubmit = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const group = {
            avatarLink: this.state.group.avatarLink,
            name: this.state.group.name,
            description: this.state.group.description
        }
        if (window.location.pathname.includes('CreateGroup')) {
            this.props.request(group, 'createGroup')
            window.location.replace('ListOfGroups');
        } else {
            const editGroup = {
                ...group,
                id: this.props.group.id
            }
            this.props.request(editGroup, 'editMainInfoGroup')
        }
    }
    renderForm() {
        return (
            <div className="bg-white row col-md-6 col-xs-6 col-xl-4 col-12 justify-content-center mx-auto my-5 py-2 rounded shadow">
                <div>
                    <Img link={this.state.group.avatarLink} id="asd"/>
                </div>
                <div className="auth__group field col-12 my-1">
                    <label className="auth__label">Name</label>
                    <input type='text' name="name" value={this.state.group.name} className="auth__field" required
                        onChange={this.handleInputChange} />
                </div>
                <div className="auth__group field col-12 my-1">
                    <label className="auth__label">Description</label>
                    <input type='text' name="description" value={this.state.group.description} className="auth__field" required
                        onChange={this.handleInputChange} />
                </div>
                <div className="col-12">
                    <FileInput id={"group"} onImageChange={this.handleInputFileChange} />
                </div>
                <div className="btn_send" onClick={this.handleSubmit.bind(this)}>
                    <span className="noselect">Create</span>
                    <div id="circle"></div>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div>
                {this.renderForm()}
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.group,
    GroupStore.actionCreators
)(CreateGroupe as any);