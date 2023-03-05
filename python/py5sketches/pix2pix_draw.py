#!/usr/bin/env python3
import numpy as np
from py5canvas import canvas
from mlxtend.image import extract_face_landmarks
import tensorflow as tf
from tensorflow import keras
import cv2

# Create video input
w, h = 512, 256
# Empty result initially
result = np.zeros((256, 256, 3))

model_path = '../models/pix2pix_landmarks_3/e100_generator.hd5'

# Load pix2pix model
generator = keras.models.load_model(model_path)
print(generator.summary())

# Runs the model on an input image
def generate_image(model, img):
    img = (img/255)*2.0 - 1.0 # Scale to [-1,1]
    res = model(np.expand_dims(img, 0), training=True)[0].numpy()
    return (res*0.5 + 0.5) # Scale to [0, 1] (Canvas is fine with that)


def setup():
    sketch.create_canvas(w, h)
    sketch.frame_rate(20) # Our framerate will be pretty low anyhow
    sketch.canvas.background(0)

def draw():
    c = sketch.canvas

    c.stroke(255)
    c.no_fill()
    c.stroke_weight(1.0)
    if sketch.mouse_pressed:
        c.line(sketch.mouse_pos - sketch.mouse_delta, sketch.mouse_pos)

    #img = c.get_image()[:,:256,:]
    c.image(result, [256,0], [256, 256])

def key_pressed(k, modifier):
    print('key pressed')
    global result
    c = chr(k)
    if c=='c':
        sketch.canvas.background(0)
    if c==' ':
        img = sketch.canvas.get_image()[:,:256,:]
        result = generate_image(generator, img)
