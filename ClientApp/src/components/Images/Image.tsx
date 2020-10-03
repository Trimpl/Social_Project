import * as React from 'react';
import './image.scss'

interface IState {
    link: string
    background: JSX.Element
}
interface ImgProps {
    link: string
    id: string
}

export class Img extends React.PureComponent<ImgProps, IState> {
    constructor(props: ImgProps) {
        super(props)
        this.state = {
            link: '',
            background: <div></div>
        }
    }
    closeModalPicture() {
        this.setState({
            background:
                <div></div>
        })
    }
    renderModalPicture() {
        this.setState({
            background:
                <div className="div_modal">
                    <img src={this.props.link} key={this.props.id} alt="" className="image_modal" />
                    <div className="wrapper_btn">
                        <div className="close-button" onClick={() => this.closeModalPicture()} >
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
        return (
            <div className="div_image mx-1" id={this.props.id}>
                {this.state.background}
                <img onClick={() => this.renderModalPicture()} src={this.props.link} key={this.props.id} alt="" className="image mb-1" />
            </div>
        )
    }
}

