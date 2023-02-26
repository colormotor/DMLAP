# ffmpeg

Install ffmpeg with [conda](https://anaconda.org/conda-forge/ffmpeg):

`conda install -c conda-forge ffmpeg`

Visit [ffmpeg.org](https://ffmpeg.org) for reference on how to record, convert and stream audio and video.

Useful practice:

- Extract images from a video:

`ffmpeg -i foo.mp4 -r 25 -f image2 foo-%03d.jpeg`

`-i` for import.

`-r` for rate. You could write `fps=25` instead.

`-f` for folder.

`foo-%03d.jpeg` specifies to use decimal numbers composed of 3 digits padded with zeros to express the sequence number.

This will extract 25 video frames per second from the video and will output them in files named foo-001.jpeg, foo-002.jpeg, etc. You can add `-s WxH` so that images are rescaled to fit new WxH values.

- Or create a video from images:

`ffmpeg -f image2 -framerate 12 -i foo-%03d.jpeg -s WxH foo.avi`





