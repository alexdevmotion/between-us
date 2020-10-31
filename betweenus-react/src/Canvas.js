import React from 'react';
import Boundingbox from "react-bounding-box";

class Canvas extends React.Component {

  state = {
    bbox: [
      82.49378531319755,
      517.3484599427406,
      270.4304853166853,
      851.9474995299156,
    ]
  };

  params = {
    image: 'beatles.jpg',
    boxes: [
      // coord(0,0) = top left corner of image
      //[x, y, width, height]
      [this.state.bbox[0], this.state.bbox[1], this.state.bbox[2] - this.state.bbox[0], this.state.bbox[3] - this.state.bbox[1]],
      // [300, 0, 250, 250],
      // [700, 0, 300, 25],
      // [1100, 0, 25, 300]
      // {coord: [0, 0, 250, 250], label: "test"},
      // {coord: [300, 0, 250, 250], label: "A"},
      // {coord: [700, 0, 300, 25], label: "B"},
      // {coord: [1100, 0, 25, 300], label: "C"}
    ],
    options: {
      colors: {
        normal: 'rgba(255,225,255,1)',
        selected: 'rgba(0,225,204,1)',
        unselected: 'rgba(100,100,100,1)'
      },
      style: {
        maxWidth: '100%',
        maxHeight: '90vh'
      },
      showLabels: true
    }
  };

  render() {
    return <Boundingbox image={this.params.image}
                        boxes={this.params.boxes}
                        options={this.params.options}/>;
  }
}

export default Canvas;
