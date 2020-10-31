import React from 'react';
import Webcam from 'react-webcam';

import Canvas from './Canvas';

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: contentType});
};

class Main extends React.Component {
  imageFormat = 'image/jpeg';
  captureLoopEnabled = false;
  state = {
    imageBase64: null,
    boxes: [],
  };

  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
  }

  componentDidMount() {
    this.startCaptureLoop();
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      }
      reader.onerror = error => reject(error);
    });
  }

  setBoxes(boxesResponse) {
    this.setState({
      boxes: boxesResponse.boxes.map((bs, index) => {
        return {
          coord: [bs[0], bs[1], bs[2] - bs[0], bs[3] - bs[1]],
          label: boxesResponse.too_close[index]
        };
      })
    });
  }

  onFileChange(event) {
    const imageFile = event.target.files[0];
    if (imageFile) {
      this.toBase64(imageFile).then(imageBase64 => {
        this.computeAndDrawSocialDistance(imageFile, imageBase64);
      });
    }
  }

  computeAndDrawSocialDistance(imageFile, imageBase64) {
    const formData = new FormData();
    formData.append('image', imageFile);

    fetch(`http://localhost:8000/predict`, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(res => {
        this.setState({imageBase64});
        this.setBoxes(res);
        if (this.captureLoopEnabled) {
          this.onCapture();
        }
      });
  }

  onCapture() {
    const restartLoopWithDelay = () => {
      setTimeout(() => {
        this.startCaptureLoop();
      }, 1000);
    };

    if (!this.webcamRef.current) {
      restartLoopWithDelay();
      return;
    }
    const captureBase64 = this.webcamRef.current.getScreenshot();
    if (!captureBase64) {
      restartLoopWithDelay();
      return;
    }
    const captureBase64Jpeg = captureBase64.split(',')[1];
    const captureFile = b64toBlob(captureBase64Jpeg, this.imageFormat);

    this.computeAndDrawSocialDistance(captureFile, captureBase64);
  }

  startCaptureLoop() {
    if (this.captureLoopEnabled) {
      this.onCapture();
    }
  }

  render() {
    return <>
      <div>
        {!this.captureLoopEnabled && <input type='file' onChange={this.onFileChange.bind(this)}/>}
      </div>
      <div>
        {this.state.imageBase64 &&
        <Canvas background={this.state.imageBase64}
                boxes={this.state.boxes}/>}
      </div>
      <div>
        {this.captureLoopEnabled && <Webcam audio={false} style={{visibility: 'hidden'}}
                ref={this.webcamRef}
                screenshotFormat={this.imageFormat}/>}
      </div>
    </>
  }
}

export default Main;
