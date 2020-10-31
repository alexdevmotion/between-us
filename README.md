# Between us

## Setup

### Requirements
- Anaconda
- GPU
- CUDA 10.0

Install dependencies
```
conda env create -f betweenus.yml
```

Install specific version of monoloco:
```
git clone -b social-distance --single-branch https://github.com/vita-epfl/monoloco.git
cd monoloco
pip install -e .
```