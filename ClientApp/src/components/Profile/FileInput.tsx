import * as React from 'react';
import $ from "jquery";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from '@fortawesome/free-solid-svg-icons';
interface IProps {
  onImageChange: any
  id: string
}

export class FileInput extends React.Component<IProps> {
  fileInput: React.RefObject<HTMLInputElement>;
  constructor(props: IProps) {
    super(props);
    this.fileInput = React.createRef();
  }
  componentDidMount() {
    console.log(this.fileInput)
  }
  handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    this.upload(this.fileInput.current!.files![0])
  }
  upload(file: File) {
    if (!file || !file.type.match(/image.*/)) return;
    var fd = new FormData();
    fd.append("image", file);
    fd.append("title", "stepa123");
    fd.append("client_secret", "bda650e874b80220bab96aa22c383a5e4581cead");
    var xhr = new XMLHttpRequest();
    console.log('upload')
    xhr.open("POST", "https://api.imgur.com/3/image");
    xhr.setRequestHeader('Authorization', 'Client-ID 1337b94d530e99b');
    var that = this
    console.log('upload')
    xhr.onload = function () {
      console.log('UPLODAD2')
      that.props.onImageChange(JSON.parse(xhr.responseText).data.link)
      $("#cartinka").empty();
      $("#cartinka").append('<img class="img-thumbnail w-25 h-25" alt="smaple image" src="' + JSON.parse(xhr.responseText).data.link + '" />');
    };
    console.log('UPLODAD1')
    xhr.send(fd);
  }


  renderInput() {
    return (
      <div className="box">
        <input type="file"  id={this.props.id} className="inputfile inputfile-1" onChange={this.handleSubmit.bind(this)} ref={this.fileInput} />
        {/* <label htmlFor={this.props.id}>
          <FontAwesomeIcon icon={faFileImage} />
          <span className="text">Choose file</span>
          <div id="circle"></div>
        </label> */}
      </div>
    )
  }
  render() {
    return (
      <div>
        {this.renderInput()}
      </div>
    );
  }
}

