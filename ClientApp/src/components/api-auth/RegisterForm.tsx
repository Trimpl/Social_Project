import React from 'react';
import * as LoginFormState from '../../store/api-auth/LoginForm';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import authService from '../api-authorization/AuthorizeService';
import './form.scss'

type LoginFormProps =
    LoginFormState.LoginFormState &
    typeof LoginFormState.actionCreators &
    RouteComponentProps<{}>;
interface IState {
    Email: string,
    Password: string,
    ConfirmPassword: string,
    state: string
}
class RegisterForm extends React.PureComponent<LoginFormProps, IState> {
    constructor(props: LoginFormProps) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
            ConfirmPassword: '',
            state: ''
        };
    }

    public handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const returnUrl = "https://localhost:5001/"
        if (this.state.ConfirmPassword === this.state.Password) {
            this.props.request(this.state.Email, this.state.Password, true, 'Register')
            authService.signIn({ returnUrl: returnUrl })
            window.location.replace(returnUrl)
        }
    };

    handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ Email: event.target.value });
    }
    handleChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ Password: event.target.value });
    }
    handleChangeConfirmPassword(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ ConfirmPassword: event.target.value });
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
                <div className="auth__group field col-12 my-1">
                    <input type='password' value={this.state.ConfirmPassword} className="auth__field" required
                        onChange={this.handleChangeConfirmPassword.bind(this)} id='Confirmpassword' />
                    <label className="auth__label">Confirm password</label>
                </div>
                <div className="auth_send col-12" onClick={this.handleSubmit.bind(this)}>
                    <span className="noselect">Register</span>
                    <div id="circle"></div>
                </div>
                {this.props.isLoading}
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.loginForm,
    LoginFormState.actionCreators
)(RegisterForm as any);