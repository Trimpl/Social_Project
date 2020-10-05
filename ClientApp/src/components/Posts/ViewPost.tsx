import * as React from 'react';

interface IState {
}
interface IProps {
}

export class ViewPost extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
        console.log('POSHEL NAXUI')
    }
    renderModalPicture() {
        this.setState({
            background:
                <div className="div_modal">
                    <img alt="" className="image_modal" />
                    <div className="wrapper_btn">
                        <div className="close-button" >
                            <div className="in">
                                <div className="close-button-block"></div>
                                <div className="close-button-block"></div>
                            </div>
                            <div className="out">
                                <div className="close-button-block"></div>
                                <div className="close-button-block"></div>
                            </div>
                        </div>
                    </div>
                </div>
        })
    }
    render() {
        console.log('POSHEL NAXUI')
        return (
            <div>
                <div className="div_modal">
                    <img alt="" className="image_modal" />
                    <div className="wrapper_btn">
                        <div className="close-button" >
                            <div className="in">
                                <div className="close-button-block"></div>
                                <div className="close-button-block"></div>
                            </div>
                            <div className="out">
                                <div className="close-button-block"></div>
                                <div className="close-button-block"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

