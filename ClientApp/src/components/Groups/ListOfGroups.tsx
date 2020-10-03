import * as React from 'react';
import { Link } from 'react-router-dom';
import authService from '../api-authorization/AuthorizeService';
import { Subscribe } from './Subscribe';

interface IState {
    subGroups: any,
    notSubGroups: any
}

export class ListOfGroups extends React.PureComponent<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            subGroups: undefined,
            notSubGroups: undefined
        }
    }
    componentDidMount = async () => {
        const token = await authService.getAccessToken();
        fetch(`api/getListOfSubGroups`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                return response.ok ? response.json() as Promise<any> : { subGroups: [], notSubGroups: [] }
            })
            .then(data => {
                this.setState({ subGroups: data.listOfSubGroups, notSubGroups: data.listOfNotSubGroups })
            })
    }
    renderGroups(sub: boolean) {
        if (this.state.subGroups != null || this.state.notSubGroups != null) {
            let a: any
            sub == true ? a = this.state.subGroups : a = this.state.notSubGroups
            return (
                a.map((data: any) => {
                    return (
                        <div key={data.id} className="bg-white col-12 border border-top border-bottom">
                            <div className="post_content mx-sm-5">
                                <div className="post_header">
                                    <img src={data.avatarLink} alt="" width="50" height="50" className="img-avatar" />
                                    <div className="post_header_info">
                                        <h5 className="post_author">{data.name}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 ml-5">
                                <Subscribe groupId={data.id} />
                            </div>
                            <Link to={`/Group/${data.id}`}>
                                <div className="btn_send_friend ml-5">
                                    <span className="noselect">Go to group</span>
                                    <div id="circle"></div>
                                </div>
                            </Link>
                        </div>
                    )
                })
            )
        }
    }
    render() {
        return (
            <div className="row justify-content-center">
                <div className="border-top border-bottom border-black col-8">
                    {this.renderGroups(true)}
                </div>
                <div className="border-top border-bottom  border-black col-8">
                    {this.renderGroups(false)}
                </div>
            </div>
        )
    }
}