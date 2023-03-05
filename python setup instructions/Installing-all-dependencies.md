# Installing all dependencies

The following are instructions that should install all the required dependencies for the DMLAP course. 
This assumes you followed the Python and Conda setup instructions and installed Tensorflow by following [Installing Tensorflow.ipynb](Installing Tensorflow.ipynb). Repeating these steps if all or some of the dependencies are already satisfied should cause no problem.

Now first make sure your environment is active
```
conda activate dmlap
```
and then
```
conda install -c conda-forge jupyter numpy matplotlib pycairo opencv scikit-image 
conda install -c conda-forge dlib mlxtend
pip install pyglet
```

Now install the [py5canvas](https://github.com/colormotor/py5canvas) module locally. To do so in the terminal (in a directory of your choice) write:

```
git clone https://github.com/colormotor/py5canvas.git
cd py5canvas
pip install -e .
```

## Updating py5canvas
To update py5canvas to the latest version, navigate to the `py5canvas` directory in the terminal (using `cd`) and then
```
git pull
```
