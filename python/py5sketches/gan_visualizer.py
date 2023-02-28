#!/usr/bin/env python3
import numpy as np
import tensorflow as tf
from tensorflow import keras
from numpy import arccos, sin, clip, dot
from numpy.linalg import norm
from py5canvas import canvas
import cv2

# Output size
w, h = 512, 512
# Make sure this matches the latent dimension you trained on
latent_dim = 100 

def random_latent_vector():
    return np.random.normal(size=latent_dim)*1.0 # Try varying this multiplier

a = random_latent_vector()
b = random_latent_vector()

# Number of frames for interpolation (more, slower)
n_frames = 20

# Load generator model
generator = keras.models.load_model('../models/dcgan_dmlap/e40_generator.hd5')
print(generator.summary())

# linear interpolation
def lerp(t, a, b):
    return a + t*(b - a)

# spherical linear interpolation (slerp)
def slerp(val, low, high):
    omega = arccos(clip(dot(low/norm(low), high/norm(high)), -1.0, 1.0))
    so = sin(omega)
    if so == 0:
        # L'Hopital's rule/LERP
        return (1.0-val) * low + val * high
    return sin((1.0-val)*omega) / so * low + sin(val*omega) / so * high

# Runs the model on an input image
def generate_image(model):
    noise = slerp((sketch.frame_count%n_frames)/n_frames, a, b)
    generated_image = generator(np.expand_dims(noise, 0),
                                training=False)[0].numpy()
    generated_image = np.clip(generated_image, -1, 1)
    return generated_image*0.5 + 0.5

def setup():
    sketch.create_canvas(w, h)
    sketch.frame_rate(60) 

def draw():
    c = sketch.canvas
    global a, b # We neeed this to modify a and b 

    if sketch.frame_count%n_frames == 0:
        a, b = b, a
        b = random_latent_vector()

    c.background(0)
    img = generate_image(generator)
    c.image(img, [0,0], [c.width, c.height], opacity=1)
