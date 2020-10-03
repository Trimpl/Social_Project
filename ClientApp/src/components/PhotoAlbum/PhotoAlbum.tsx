import * as React from 'react';
import * as PhotoAlbumStore from '../../store/PhotoAlbum/PhotoAlbumStore';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { FileInput } from '../Profile/FileInput';
import { Img } from '../Images/Image';

type PhotoAlbumProps =
    PhotoAlbumStore.PhotoAlbumSate &
    typeof PhotoAlbumStore.actionCreators &
    RouteComponentProps<{}>;
interface IState {
    pictureLinks: string[]
}
class PhotoAlbum extends React.PureComponent<PhotoAlbumProps, IState> {
    constructor(props: PhotoAlbumProps) {
        super(props)
        this.state = {
            pictureLinks: []
        }
        this.handleInputFileChange = this.handleInputFileChange.bind(this)
    }
    handleInputFileChange(file: string) {
        console.log('PHOTO FILE: ', file)
        this.setState(prevState => ({
            ...prevState,
            pictureLinks: [...prevState.pictureLinks, file]
        }))
    }
    public componentDidMount() {
        this.props.requestAlbum()
    }
    public renderAlbum() {
        if (this.props.pictures != []) return (
            <div>
                {this.props.pictures.map((data, index) => {
                    return (
                        <div className="image_album my-2" key={index}>
                            <Img link={data.pictureLink} id={index.toString()} key={index} />
                        </div>
                    )
                })}
            </div>
        )
    }
    renderStateAlbum() {
        if (this.state.pictureLinks != []) return (
            this.state.pictureLinks.map((data, index) => {
                return (
                    <div className="image_album p-3" key={data}>
                        <Img link={data} id={index.toString()} key={index} />
                    </div>
                )
            })
        )
    }
    addToAlbum(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.props.addToAlbum(this.state.pictureLinks)
        this.setState({ pictureLinks: [] })
    }
    renderCreatePost() {
        return (
            this.props.isAuthor
                ? <div className="d-flex p-2">
                    <div className="btn_send_post" id="photo" onClick={this.addToAlbum.bind(this)}>
                        <span className="noselect">Add photo to album</span>
                        <div id="circle"></div>
                    </div>
                    <FileInput onImageChange={this.handleInputFileChange} id={"photo"} key={"photo"}/>
                </div>
                : <div></div>
        )
    }
    public render() {
        if (this.props.isAuthor || this.props.pictures != [])
            return (
                <div>
                    {this.renderCreatePost()}
                    {this.renderAlbum()}
                    <div>
                        {this.renderStateAlbum()}
                    </div>
                </div>
            )
        else
            return (
                <div></div>
            )
    }
};

export default connect(
    (state: ApplicationState) => state.photoAlbum,
    PhotoAlbumStore.actionCreators
)(PhotoAlbum as any);