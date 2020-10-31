import React from 'react';
import Boundingbox from 'react-bounding-box';
import Webcam from 'react-webcam';

class Main extends React.Component {
  imageFormat = 'image/jpeg';
  captureLoopEnabled = true;
  state = {
    uploadedImageBase64: null,
    boxes: [],
    bboxOptions: {
      colors: {
        normal: 'rgba(255,225,255,1)',
        selected: 'rgba(0,225,204,1)',
        unselected: 'rgba(100,100,100,1)'
      },
      style: {
        maxWidth: '100%',
        maxHeight: '90vh'
      },
      base64Image: true,
      // showLabels: true
    },
    uploading: true
  };

  constructor(props) {
    super(props);

    this.webcamRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      this.startCaptureLoop();
    }, 2000);
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Str = reader.result;
        resolve(base64Str.split(',')[1]);
      }
      reader.onerror = error => reject(error);
    });
  }

  setBoxes(boxesResponse) {
    this.setState({
      boxes: boxesResponse.boxes.map((bs, index) => ({
        coord: [bs[0], bs[1], bs[2] - bs[0], bs[3] - bs[1]],
        label: boxesResponse.too_close[index] ? 'BAD' : 'GOOD'
      }))
    });
  }

  async onFileChange(event) {
    const imageFile = event.target.files[0];
    if (imageFile) {
      this.uploadFile(imageFile);
      this.setState({
        uploadedImageBase64: await this.toBase64(imageFile)
      });
    }
  }

  uploadFile(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    this.setState({
      uploading: true
    });

    fetch(`http://localhost:8000/predict`, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(res => {
        this.setBoxes(res);
        this.setState({
          uploading: false
        });
        if (this.captureLoopEnabled) {
          // setTimeout(() => {
          //   this.onCapturePhoto();
          // }, 1000);
        }
      });
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

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
  }

  onCapturePhoto() {
    const captureBase64 = this.webcamRef.current.getScreenshot();
    const captureBase64Jpeg = captureBase64.split(',')[1];

    this.uploadFile(this.b64toBlob(captureBase64Jpeg, this.imageFormat));
    this.setState({
      uploadedImageBase64: captureBase64Jpeg
    });
  }

  startCaptureLoop() {
    if (this.captureLoopEnabled) {
      this.onCapturePhoto();
    }
  }

  render() {
    return <>
      <div>
        <input type='file' onChange={this.onFileChange.bind(this)}/>
      </div>
      <div>
        {this.state.uploadedImageBase64 &&
        <Boundingbox image={this.state.uploadedImageBase64}
                     boxes={this.state.boxes}
                     options={this.state.bboxOptions}/>}
      </div>
      <div>
        <Webcam audio={false}
                ref={this.webcamRef}
                screenshotFormat={this.imageFormat}/>
      </div>
    </>
  }
}

export default Main;
