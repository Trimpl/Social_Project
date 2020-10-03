import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as DialogStore from '../../store/Dialogs/DialogStore'
import { RouteComponentProps } from 'react-router';
import './dialog.scss'
type DialogProps =
    DialogStore.DialogState
    & typeof DialogStore.actionCreators
    & RouteComponentProps<{ toUserId: string }>;
interface IState {
    toUserId: string
    message: string
}
export class Dialog extends React.PureComponent<DialogProps, IState> {
    constructor(props: DialogProps) {
        super(props);
        this.state = {
            toUserId: '',
            message: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    componentDidMount = async () => {
        this.setState({ toUserId: this.props.match.params.toUserId })
        this.props.requestDialog(this.props.match.params.toUserId)
    }
    handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ message: event.target.value });
    }
    sendMessage(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.props.sendMessage(this.state.toUserId, this.state.message)
        this.setState({ message: '' });
    }
    componentDidUpdate() {
        window.scrollTo(0, document.querySelector("#dialog")!.scrollHeight)
    }
    render() {
        return (
            <div onLoad={() => window.scrollTo(0, document.querySelector("#dialog")!.scrollHeight)} >
                <div id="dialog">
                    {this.props.dialog.map(data => {
                        let postDate = new Date(data.createDate)
                        let date: string
                        if (postDate.toLocaleDateString() == new Date().toLocaleDateString()) {
                            date = postDate.toLocaleTimeString()
                        } else {
                            date = `${postDate.toLocaleDateString()} ${postDate.toLocaleTimeString()}`
                        }
                        let bg = ''
                        if (data.isViewed == false) {
                            bg = 'bg-secondary'
                            if (data.withWhomId != this.props.withWhomId && data.withWhomId != undefined) this.props.recieveMessage(data)
                        }
                        return (
                            <div key={data.id} id={data.id} className={`dialog_content_message mx-auto ${bg}`} onLoad={() => setTimeout(() => {
                                if (document.getElementById(data.id) != null) document.getElementById(data.id)!.className = "dialog_content_message mx-auto"
                            }, 5000)}>
                                <div className="dialog_header">
                                    <img src={data.avatar} alt="" width="50" height="50" className="img-avatar" />
                                    <div className="dialog_header_info">
                                        <h5 className="dialog_author">{data.firstUserId}
                                            <div className="dialog_date">
                                                {date}
                                            </div>
                                        </h5>
                                        <div className="message_text ">
                                            {data.message}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="fixed-bottom form__group_post_message field rounded shadow bg-white px-2 row col-xl-5 col-lg-8 col-md-10 col-12 mx-auto mb-xl-5">
                    <div className="col-10 col-sm-9 col-md-9 pl-4">
                        <label className="form__label_post_message">Send message</label>
                        <textarea className="form__field_post_message" placeholder="Name" name="name" required
                            onChange={this.handleInputChange} value={this.state.message} />
                    </div>
                    <div className="col-1 my-auto">
                        <div className="btn_send_post" onClick={this.sendMessage.bind(this)}>
                            <span className="noselect">Send</span>
                            <div id="circle"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.dialog,
    DialogStore.actionCreators
)(Dialog as any);