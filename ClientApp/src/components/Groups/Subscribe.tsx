import * as React from 'react';
import authService from '../api-authorization/AuthorizeService';

interface IProps {
    groupId: string
}
interface IState {
    subscribed: boolean
}

export class Subscribe extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            subscribed: false
        }
    }
    async componentDidMount() {
        const token = await authService.getAccessToken();
        fetch(`api/isSubscribed?groupId=${this.props.groupId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then((data) => {
                this.setState((state) => ({
                    ...state,
                    subscribed: data
                }))
            })
    }
    async subscribe() {
        const token = await authService.getAccessToken();
        fetch(`api/subscribe?groupId=${this.props.groupId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (response.ok) {
                    this.setState((state) => ({
                        ...state,
                        subscribed: !state.subscribed
                    }))
                }
            })
    }
    render() {
        return (
            <div>
                {this.state.subscribed
                    ? <div className="btn_send_friend" onClick={this.subscribe.bind(this)}>
                        <span className="noselect">Отписаться</span>
                        <div id="circle"></div>
                    </div>
                    : <div className="btn_send_friend" onClick={this.subscribe.bind(this)}>
                        <span className="noselect">Подписаться</span>
                        <div id="circle"></div>
                    </div>
                }
            </div>
        )
    }
}