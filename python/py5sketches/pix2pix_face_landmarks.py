#!/usr/bin/env python3
import numpy as np
from py5canvas import canvas
from mlxtend.image import extract_face_landmarks
import tensorflow as tf
from tensorflow import keras
import cv2

# Create video input
vid = canvas.VideoInput(size=(512, 512))
# Load pix2pix model
generator = keras.models.load_model('../models/pix2pixlandmarks.h5')
print(generator.summary())

# Runs the model on an input image
def generate_image(model, img):
    img = (img/255)*2.0 - 1.0 # Scale to [-1,1]
    res = model(np.expand_dims(img, 0), training=True)[0].numpy()
    return (res*0.5 + 0.5) # Scale to [0, 1] (Canvas is fine with that)

def setup():
    sketch.create_canvas(512, 512)
    sketch.frame_rate(20) # Our framerate will be pretty low anyhow

# Gives us back a sequence of polylines for each face feature
def landmark_polylines(landmarks):
    # https://pyimagesearch.com/2017/04/03/facial-landmarks-dlib-opencv-python/
    landmarks = np.array(landmarks).astype(np.float32)
    indices = [list(range(0, 17)),
               list(range(17, 22)),
               list(range(22, 27)),
               list(range(27, 31)),
               list(range(31, 36)),
               list(range(36, 42)) + [36],
               list(range(42, 48)) + [42],
               list(range(48, 60)) + [48],
               list(range(60, 68)) + [60]]
    return [landmarks[I] for I in indices]


def draw():
    c = sketch.canvas

    c.background(0)

    # Read video and compute landmarks
    frame = vid.read()
    landmarks = extract_face_landmarks(frame)

    c.stroke_weight(2)
    c.stroke(255) #, 0, 0)
    c.no_fill()

    if landmarks is not None: # If no landmaks can be found landmark will be "None"
        paths = landmark_polylines(landmarks)
        for path in paths:
            c.polyline(path)

        # Try to mess with the image
        #for i in range(3):
           #c.rect(np.random.uniform(0, c.width, 2), np.random.uniform(10, 60, 2)*[0.1,7.0])

        # Get the current canvas image and feed it to pix2pix
        img = c.get_image()
        # This requires resizing to 256x256
        res = generate_image(generator, cv2.resize(img, [256, 256]))
        # And then drawing it on the whole canvas
        c.image(res, [0,0], [c.width, c.height])

    # This will draw the (low) framerate
    # c.text_size(10)
    # c.fill(255)
    # c.text([10, 20], '%.3f fps'%(1.0 / sketch.delta_time))
