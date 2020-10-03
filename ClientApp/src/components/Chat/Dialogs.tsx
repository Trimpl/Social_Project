import * as React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../store/Profile/ProfileStore';
import authService from '../api-authorization/AuthorizeService';
import './dialog.scss'
interface IProps {

}
interface IState {
    dialogs: UserDialog[]
}
interface UserDialog extends User {
    message: string
    createDate: Date
    count: number
}
export class Dialogs extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            dialogs: []
        }
    }
    componentDidMount = async () => {
        const token = await authService.getAccessToken();
        fetch(`api/getDialogs`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                return response.ok ? response.json() as Promise<UserDialog[]> : []
            })
            .then(data => {
                this.setState({ dialogs: data })
            })
    }
    renderDialogs() {
        if (this.state.dialogs != null)
            return (
                this.state.dialogs.map((data: UserDialog) => {
                    let postDate = new Date(data.createDate)
                    let date: string
                    if (postDate.toLocaleDateString() == new Date().toLocaleDateString()) {
                        date = postDate.toLocaleTimeString()
                    } else {
                        date = `${postDate.toLocaleDateString()} ${postDate.toLocaleTimeString()}`
                    }
                    let count: string | number = data.count != 0 ? data.count : ''
                    return (
                        <div key={data.id} className="dialog_content mx-auto">
                            <Link to={`/Dialog/${data.id}`}>
                                <div className="dialog_header">
                                    <img src={data.avatar} alt="" width="50" height="50" className="img-avatar" />
                                    <div className="dialog_header_info">
                                        <h5 className="dialog_author">{`${data.firstName} ${data.secondName}`}
                                            <div className="dialog_date">
                                                {date}
                                            </div> </h5>
                                        <div id={data.id} className="message">
                                            <span className="badge badge-pill badge-warning">{count}</span>
                                            {' '}{data.message}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })
            )
    }
    render() {
        return (
            <div className="mt-2 ">
                {this.renderDialogs()}
            </div>
        )
    }
}