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
  state = {
    computing: false,
    imageFileName: '',
    imageBase64: null,
    boxes: [],
    mode: null,
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
      this.setState({imageFileName: imageFile.name});
      this.toBase64(imageFile).then(imageBase64 => {
        this.computeAndDrawSocialDistance(imageFile, imageBase64);
      });
    }
  }

  computeAndDrawSocialDistance(imageFile, imageBase64) {
    const formData = new FormData();
    formData.append('image', imageFile);

    this.setState({computing: true});

    fetch(`http://localhost:8000/predict`, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(res => {
        this.setState({imageBase64});
        this.setBoxes(res);
        this.setState({computing: false});
        this.startCaptureLoop();
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
    if (this.state.mode === 'webcam') {
      this.setState({imageFileName: null})
      this.onCapture();
    }
  }

  onModeSelected(mode) {
    this.setState({mode}, () => {
      this.startCaptureLoop();
    });
  }

  render() {
    return <>
      <div>
        <div className="buttons has-addons is-centered">
          <button className={'button ' + (this.state.mode === 'webcam' && 'is-primary is-selected')}
                  onClick={() => this.onModeSelected('webcam')}>Webcam live feed
          </button>
          <button className={'button ' + (this.state.mode === 'upload' && 'is-primary is-selected')}
                  onClick={() => this.onModeSelected('upload')}>Image upload
          </button>
        </div>

        {this.state.mode === 'upload' &&
        <>
          <div className={'file is-centered is-primary ' + (this.state.imageFileName && 'has-name')}>
            <label className="file-label">
              <input className="file-input" type="file" accept="image/*" onChange={this.onFileChange.bind(this)}/>
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">
                  Choose a file…
                </span>
              </span>
              {this.state.imageFileName && <span className="file-name">
                {this.state.imageFileName}
              </span>
              }
            </label>
          </div>
          {this.state.computing && <div className="columns is-centered my-4">
            <progress className="progress is-small is-primary" style={{width: 300}} max="50">15%</progress>
          </div>}
        </>}
      </div>
      <div>
        {this.state.imageBase64 &&
          <div className="mt-4 columns is-centered">
            <Canvas background={this.state.imageBase64}
                    boxes={this.state.boxes}/>
          </div>}
      </div>
      <div>
        {this.state.mode === 'webcam' && <Webcam id="webcam" audio={false}
                                                 ref={this.webcamRef}
                                                 screenshotFormat={this.imageFormat}/>}
      </div>
    </>
  }
}

export default Main;
