# Between us API

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

Start the server
```
python server.py
```
