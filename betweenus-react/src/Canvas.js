import React from 'react';
import Boundingbox from 'react-bounding-box';

class Canvas extends React.Component {

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
    }
  };



  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Str = reader.result;
        resolve(base64Str.substring(base64Str.indexOf('base64,') + 7));
      }
      reader.onerror = error => reject(error);
    });
  }

  setBoxes(boxesResponse) {
    this.setState({
      boxes: boxesResponse.boxes.map((bs, index) => ({
        coord: [bs[0], bs[1], bs[2]-bs[0], bs[3]-bs[1]],
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

    fetch(`http://localhost:8000/predict`, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then(res => {
        this.setBoxes(res);
      });
  }

  render() {
    return <div>
      <input type='file' onChange={this.onFileChange.bind(this)}/>
      {this.state.uploadedImageBase64 && <Boundingbox image={this.state.uploadedImageBase64}
                                                      boxes={this.state.boxes}
                                                      options={this.state.bboxOptions}/>}
    </div>
  }
}

export default Canvas;
