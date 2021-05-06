/*!

=========================================================
* Paper Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
// used for making the prop types of this component
import PropTypes from 'prop-types';

import {Button} from 'reactstrap';

import defaultImage from './drop-image-here-fix.png';

class ImageUpload extends React.Component {
    onImageBase64Change = undefined;

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            imagePreviewUrl: defaultImage
        };
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.onImageBase64Change = props.onImageBase64Change;
    }

    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
            if (this.onImageBase64Change) {
                this.onImageBase64Change(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }

    handleSubmit(e) {
        e.preventDefault();
        // this.state.file is the file/image uploaded
        // in this function you can save the image (this.state.file) on form submit
        // you have to call it yourself
    }

    handleClick() {
        this.refs.fileInput.click();
    }

    handleRemove() {
        this.setState({
            file: null,
            imagePreviewUrl: defaultImage
        });
        this.refs.fileInput.value = null;
        if (this.onImageBase64Change) {
            this.onImageBase64Change("");
        }
    }

    render() {
        return (
            <div className="fileinput text-center post-image-uploader">
                <input type="file" onChange={this.handleImageChange} ref="fileInput"/>
                <div className={'thumbnail' + (this.props.avatar ? ' img-circle' : '')}>
                    <img src={this.state.imagePreviewUrl} alt="..."/>
                </div>
                <div className="image-upload-button-panel">
                    {this.state.file === null ? (
                        <Button color="primary" className="select-image-button" onClick={() => this.handleClick()}>
                            {this.props.avatar ? 'Add Photo' : 'Select image'}
                        </Button>
                    ) : (
                        <span>
              <Button color="primary" className="btn-round" onClick={() => this.handleClick()}>
                Change
              </Button>
                            {this.props.avatar ? <br/> : null}
                            <Button color="danger" className="btn-round" onClick={() => this.handleRemove()}>
                <i className="fa fa-times"/>
                Remove
              </Button>
            </span>
                    )}
                </div>
            </div>
        );
    }
}

ImageUpload.propTypes = {
    avatar: PropTypes.bool
};

export default ImageUpload;
