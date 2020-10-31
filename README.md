# Between us

## Setup

Install dependencies
```
conda install pytorch==1.1.0 torchvision==0.3.0 cudatoolkit=10.0 -c pytorch
conda install openpifpaf==0.9.0
```

Install specific version of monoloco:
```
git clone -b social-distance --single-branch https://github.com/vita-epfl/monoloco.git
cd monoloco
pip install -e .
```