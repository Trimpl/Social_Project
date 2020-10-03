import React from 'react';
import * as LoginFormState from '../../store/api-auth/LoginForm';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import './form.scss'

type LoginFormProps =
    LoginFormState.LoginFormState &
    typeof LoginFormState.actionCreators &
    RouteComponentProps<{}>;
interface IState {
    Email: string,
    Password: string,
    RememberMe: boolean,
    message: any
}
class LoginForm extends React.PureComponent<LoginFormProps, IState> {
    constructor(props: LoginFormProps) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
            RememberMe: false,
            message: undefined
        };
    }

    public handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        this.props.request(this.state.Email, this.state.Password, true, 'Login');
    };

    handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ Email: event.target.value });
    }
    handleChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ Password: event.target.value });
    }

    public render() {
        return (
            <div className="bg-white row col-md-6 col-xs-6 col-xl-4 col-12 justify-content-center mx-auto my-5 py-2 rounded shadow">
                <div className="auth__group field col-12 my-1">
                    <input type='email' className="auth__field" value={this.state.Email} required
                        onChange={this.handleChangeEmail.bind(this)} id='email' />
                    <label htmlFor='Input.Email' className="auth__label">Email</label>
                </div>
                <div className="auth__group field col-12 my-1">
                    <input type='password' value={this.state.Password} className="auth__field" required
                        onChange={this.handleChangePassword.bind(this)} id='password' />
                    <label htmlFor='Input.Password' className="auth__label">Password</label>
                </div>
                {this.props.isLoading}
                <div className="auth_send col-12" onClick={this.handleSubmit.bind(this)}>
                    <span className="noselect">Login</span>
                    <div id="circle"></div>
                </div>
                <p>{this.props.status}</p>
                {this.props.isLoading}
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.loginForm,
    LoginFormState.actionCreators
)(LoginForm as any);