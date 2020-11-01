import React from 'react';


class Canvas extends React.Component {

  componentDidUpdate() {
    const ctx = this.canvas.getContext('2d');

    const background = new Image();
    background.src = this.props.background;

    background.onload = (() => {
      this.canvas.width = background.width;
      this.canvas.height = background.height;

      ctx.drawImage(background, 0, 0);

      this.props.boxes.forEach(box => this.drawBox(box.coord, box.label ? 'red' : 'green'));
    });
  }

  drawBox(coord, color, lineWidth = 5) {
    const ctx = this.canvas.getContext('2d');

    let [x, y, width, height] = coord

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.rect(x, y, width, height)
    ctx.stroke();
  }

  render() {
    return <canvas className="is-centered"
                   ref={(canvas) => {
                     this.canvas = canvas;
                   }}/>
  }

}

export default Canvas;