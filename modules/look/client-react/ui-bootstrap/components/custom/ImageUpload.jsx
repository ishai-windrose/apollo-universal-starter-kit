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
import React, { useState, useEffect, useRef } from 'react';
// used for making the prop types of this component
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';

import defaultImage from './drop-image-here-fix.png';

const ImageUpload = props => {
  const onImageBase64Change = useRef(props.onImageBase64Change);
  const file = useRef();
  const fileInput = useRef();
  const originalImageBase64 = useRef(props.imageBase64 || defaultImage);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(props.imageBase64 || defaultImage);
  const [selectImageMode, setSelectImageMode] = useState(false);

  useEffect(() => {
    if (!selectImageMode) {
      if (originalImageBase64.current !== props.imageBase64) {
        originalImageBase64.current = props.imageBase64 || defaultImage;
      }
      if (imagePreviewUrl !== props.imageBase64) {
        setImagePreviewUrl(props.imageBase64 || defaultImage);
      }
    }
  }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageChange = e => {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    let reader = new FileReader();
    let selectedImage = e.target.files[0];

    reader.onloadend = () => {
      file.current = selectedImage;
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const handleSetImage = () => {
    if (onImageBase64Change.current) {
      onImageBase64Change.current(imagePreviewUrl);
      file.current = null;
    }
    setSelectImageMode(false);
  };

  const handleSelect = () => {
    setSelectImageMode(true);
    fileInput.current.click();
  };

  const handleCancel = () => {
    file.current = null;
    setImagePreviewUrl(originalImageBase64.current);
    fileInput.current.value = null;
  };

  return (
    <div className="fileinput text-center post-image-uploader">
      <input type="file" onChange={handleImageChange} ref={fileInput} />
      <div className={'thumbnail'}>
        <img src={imagePreviewUrl} alt="..." />
      </div>
      <div className="image-upload-button-panel">
        {!file.current ? (
          <Button color="primary" className="select-image-button" onClick={() => handleSelect()}>
            Select Image
          </Button>
        ) : (
          <span>
            <Button color="primary" className="btn-round" onClick={() => handleSetImage()}>
              Set
            </Button>
            <Button color="danger" className="btn-round" onClick={() => handleCancel()}>
              Cancel
            </Button>
          </span>
        )}
      </div>
    </div>
  );
};

ImageUpload.propTypes = {
  imageBase64: PropTypes.string,
  onImageBase64Change: PropTypes.func
};

export default ImageUpload;
