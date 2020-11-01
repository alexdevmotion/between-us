# Between us API

API that receives an image as input and responds with a JSON that contains:
- bounding boxes of detected human poses
- for each human pose, a boolean indicating whether or not they are respecting the social distancing norm


## Setup

### Requirements
- Anaconda
- GPU + CUDA 10.0

#### Create an env with all required dependencies
```
cd betweenus-api
conda env create -f betweenus.yml
```

#### Install specific version of Monoloco
```
git clone -b social-distance --single-branch https://github.com/vita-epfl/monoloco.git
cd monoloco
pip install -e .
```


## Usage

Start the server on port 8000
```
python server.py
```


## Example output
```
curl --request POST \
  --url http://localhost:8000/predict \
  --header 'Content-Type: multipart/form-data' \
  --form 'image=images/fun/famous_beatles.jpg'
```

```
{
  "boxes": [
    [
      307.69431072732675,
      515.5085627395914,
      457.87624591329825,
      839.7450383346273,
      0.7588235294117648
    ],
    [
      82.49378531319755,
      517.3484599427406,
      270.4304853166853,
      851.9474995299156,
      0.7117647058823531
    ],
    [
      487.85962255252815,
      532.6579805930949,
      658.3666958068469,
      853.0940946022176,
      0.6470588235294118
    ],
    [
      686.9696666646448,
      525.6854031959676,
      865.8030994486364,
      865.5501925071574,
      0.6764705882352942
    ],
    [
      745.0856167811045,
      473.97913734957297,
      761.524368570458,
      547.1124764199583,
      0.6294117647058824
    ]
  ],
  "too_close": [
    true,
    true,
    true,
    true,
    false
  ]
}
```


## Approach
A multi step approach to detecting people and determining the distance between them:

1. Detect the poses (keypoints & bboxes) using [openpifpaf](https://github.com/vita-epfl/openpifpaf)
2. Transpose to birds-eye view using [Monoloco](https://github.com/vita-epfl/monoloco)
3. Calculate distances between people
4. Calculate future positions based on orientation

`NOTE` The poses alone are not enough to accurately calculate distances, we need info about the depth.\
Estimating depth from bounding box sizes yields very poor results, since they vary in shape very much.\
[Monoloco](https://github.com/vita-epfl/monoloco) solves this by transposing in 3D space from monocular RGB images.\
This enables a much more accurate distance computation.

## Credits
- [openpifpaf](https://github.com/vita-epfl/openpifpaf)
- [Monoloco](https://github.com/vita-epfl/monoloco)
- [FastAPI](https://github.com/tiangolo/fastapi)
