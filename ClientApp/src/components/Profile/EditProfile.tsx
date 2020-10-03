import * as React from 'react';
import * as EditProfileStore from '../../store/Profile/EditProfileStore';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { UserModel } from '../../store/Profile/ProfileStore';
import { FileInput } from './FileInput';
import '../api-auth/form.scss'
import { Img } from '../Images/Image';

type EditProfileProps =
    EditProfileStore.EditProfileState &
    typeof EditProfileStore.actionCreators &
    RouteComponentProps<{}>;

class EditProfile extends React.PureComponent<EditProfileProps, { user: UserModel, isLoading: JSX.Element }> {
    constructor(props: EditProfileProps) {
        super(props);
        this.state = {
            user: this.props.user,
            isLoading: <div></div>
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputFileChange = this.handleInputFileChange.bind(this);
    }
    public componentDidMount() {
        this.props.getEditProfile()
        this.setState({ user: this.props.user })
    }
    public handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        this.props.postEditProfile(this.state.user);
    };
    handleInputFileChange(file: string) {
        console.log('FILE: ', file)
        this.setState(({ user }) => ({
            user: {
                ...user,
                avatar: file
            }
        }))
    }
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value: string = target.value;
        let name: string = target.name;
        this.setState(({ user }) => ({
            user: {
                ...user,
                [name]: value
            }
        }))
    }

    public render() {
        var date = new Date(this.state.user.dateOfBirth)
        var values: string[] = [date.getDate().toString(), (date.getMonth() + 1).toString()];
        for (var id in values) {
            values[id] = values[id].toString().replace(/^([0-9])$/, '0$1');
        }
        return (
            <React.Fragment>
                <div className="bg-white row col-md-6 col-xs-6 col-xl-4 col-12 justify-content-center mx-auto my-5 py-2 rounded shadow">
                    <div className="auth__group field col-12 my-1">
                        <Img link={this.state.user.avatar} id="cartinka" />
                    </div>
                    <div className="auth__group field col-12 my-1">
                        <label htmlFor='Input.FirstName' className="auth__label">First Name</label>
                        <input type='text' name="firstName" value={this.state.user.firstName} className="auth__field" required
                            onChange={this.handleInputChange} />
                    </div>
                    <div className="auth__group field col-12 my-1">
                        <label htmlFor='Input.SecondName' className="auth__label">Second Name</label>
                        <input type='text' name="secondName" value={this.state.user.secondName} className="auth__field" required
                            onChange={this.handleInputChange} />
                    </div>
                    <div className="auth__group field col-12 my-1">
                        <label htmlFor='Input.Country' className="auth__label">Country</label>
                        <input type='text' name="country" value={this.state.user.country} className="auth__field" required
                            onChange={this.handleInputChange} />
                    </div>
                    <div className="auth__group field col-12 my-1">
                        <label htmlFor='Input.City' className="auth__label">City</label>
                        <input type='text' name="city" value={this.state.user.city} className="auth__field" required
                            onChange={this.handleInputChange} />
                    </div>
                    <div className="auth__group field col-12 my-1">
                        <label htmlFor='Input.FamilyStatus' className="auth__label">Family Status</label>
                        <input type='text' name="familyStatus" value={this.state.user.familyStatus} className="auth__field" required
                            onChange={this.handleInputChange} />
                    </div>
                    <div className="auth__group field col-12 my-1">
                        <label htmlFor='Input.Languages' className="auth__label">Languages</label>
                        <input type='text' name="languages" value={this.state.user.languages} className="auth__field" required
                            onChange={this.handleInputChange} />
                    </div>
                    <FileInput id={"edit"} onImageChange={this.handleInputFileChange} />
                    <div className="auth__group field col-12 my-1">
                        <label htmlFor='Input.DateOfBirth' className="auth__label">Date Of Birth</label>
                        <input type='date' name="dateOfBirth"
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                            value={date.getFullYear() + '-' + values[1] + '-' + values[0]} className="auth__field" required
                            onChange={this.handleInputChange} />
                    </div>
                    {this.props.status}
                    <div className="btn_send" onClick={this.handleSubmit.bind(this)}>
                        <span className="noselect">Send</span>
                        <div id="circle"></div>
                    </div>
                    {this.state.isLoading}
                </div>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.editProfile,
    EditProfileStore.actionCreators
)(EditProfile as any);