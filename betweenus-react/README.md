# Between Us API demo app

Demo app that queries the API with images (either uploaded or from the webcam), then renders the JSON output in a HTML canvas element as bounding boxes, indicating violations of the social distancing protocol.

## Features

### Upload mode
![Upload mode showcase](../assets/upload.gif)

### Webcam mode
![Webcam mode showcase](../assets/webcam.gif)


## Setup

### Requirements
- Node
- yarn

### Install dependencies
```
yarn
```


## Usage

### Start a local server
```
yarn start
```

### Build for deployment
```
yarn build
```

## Credits
- [Create React App](https://github.com/facebook/create-react-app)
- Inspiration from [react-bounding-box](https://github.com/alx/react-bounding-box), but we ended up writing our own Canvas bounding box rendering component
- [react-webcam](https://github.com/mozmorris/react-webcam)
- [bulma](https://github.com/jgthms/bulma)
