# Between us API

## Setup

### Requirements
- Anaconda
- GPU
- CUDA 10.0

Install dependencies
```
cd betweenus-api
conda env create -f betweenus.yml
```

Install specific version of monoloco
```
git clone -b social-distance --single-branch https://github.com/vita-epfl/monoloco.git
cd monoloco
pip install -e .
```

## Running

Start the server
```
python server.py
```

