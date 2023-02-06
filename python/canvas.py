#!/usr/bin/env python3
#%%
import matplotlib.pyplot as plt
import numpy as np
import cairo
import numbers

def is_number(x):
    return isinstance(x, numbers.Number)

def convert_rgb(x):
    if len(x)==1:
        return (x[0], x[0], x[0])
    return x[:3]

def convert_rgba(x):
    if len(x)==1:
        return (x[0], x[0], x[0], 1.0)
    elif len(x) == 3:
        return (*x, 1.0)
    elif len(x) == 2:
        return (x[0], x[0], x[0], x[1])
    return x[:4]

class Canvas:
    ''' Creates a "canvas" like object that behaves similarly to p5js'''
    def __init__(self, width, height):
        sur = cairo.ImageSurface(cairo.FORMAT_ARGB32, width, height)
        ctx = cairo.Context(sur)
        #ctx.scale(width, height)
        ctx.set_source_rgba(0.0, 0.0, 0.0, 1.0)
        ctx.rectangle(0,0,width,height)
        ctx.fill()

        self.width = width
        self.height = height
        self.sur = sur
        self.ctx = ctx
        self.cur_fill = convert_rgba([1.0])
        self.cur_stroke = None

    def no_fill(self):
        self.fill(None)

    def no_stroke(self):
        self.stroke(None)

    def fill(self, *args):
        if args[0] is None:
            self.cur_fill = None
        else:
            self.cur_fill = convert_rgba(args)

    def stroke(self, *args):
        if args[0] is None:
            self.cur_stroke = None
        else:
            self.cur_stroke = convert_rgba(args)

    def _fillstroke(self):
        if self.cur_fill is not None:
            self.ctx.set_source_rgba(*self.cur_fill)
            self.ctx.fill()
        if self.cur_stroke is not None:
            self.ctx.set_source_rgba(*self.cur_stroke)
            self.ctx.stroke()

    def circle(self, center, radius):
        self.ctx.arc(*center, radius, 0,np.pi*2.)
        self._fillstroke()

    def line(self, a, b):
        self.ctx.new_path()
        self.ctx.move_to(*a)
        self.ctx.line_to(*b)
        self._fillstroke()

    def polygon(self, points):
        self.polyline(points, True)

    def polyline(self, points, closed=False):
        self.ctx.new_path()
        self.ctx.move_to(*points[0])
        for p in points[1:]:
            self.ctx.line_to(*p)
        if closed:
            self.ctx.close_path()

    def background(self, *args):
        self.ctx.set_source_rgb(*convert_rgb(args))
        self.ctx.rectangle(0, 0, self.width, self.height)
        self.ctx.fill()

    def get_image(self):
        img = np.ndarray (shape=(self.height, self.width,4), dtype=np.uint8, buffer=self.sur.get_data())[:,:,:3]
        img = img[:,:,::-1]
        return img

if __name__ == '__main__':
    c = Canvas(200, 100)
    c.background(0, 0, 0)
    c.stroke(1)
    c.no_fill()
    c.circle([20, 50], 10)
    c.stroke(1, 0, 1)
    c.line([0,0], [200,60])
    c.line([0,10], [200,90])
    im = c.get_image()
    plt.imshow(im)
    plt.show()
