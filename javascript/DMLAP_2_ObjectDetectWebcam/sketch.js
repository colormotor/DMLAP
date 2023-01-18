/*
  Data and machine learning for artistic practice (DMLAP)
  Week 3
  
  Object detector via webcam,
  
  Note, this uses ml5.js 0.5.0 not 0.6.0, 0.6.0 reacts differently.
*/

let video;
let detector;
let detections = [];

function preload() {
  // load our object library cocossd - you could use 'YOLO'
  detector = ml5.objectDetector('cocossd');
}

function setup() {
  createCanvas(640, 480);
  
  // load our webcam feed. When the video is ready the videoReady function will be called
  video = createCapture(VIDEO, videoReady);
  video.size(640, 480);
  video.hide();
}

function videoReady(stream) {
  // we now know the video is ready, so we'll start the detection.
  
  // start our detector, pass in the callback function 'detected'
  // this will be called when a detection is performed
  detector.detect(video, detected);
}


function draw() {
  background(0);
  
  // draw webcam frame
  image(video, 0, 0);

  // loop through all our detections and draw them
  for (let object of detections) {
    // we use lerp to color the border somewhere between red and green based on the confidence of the prediction
    stroke(lerpColor(color(255,0,0), color(0, 255, 0), object.confidence));
    strokeWeight(3);
    noFill();
    // and draw a rectangle around the recognized object
    rect(object.x, object.y, object.width, object.height);
    // In this commented version, we use the normalised values, these represent the percentage across the screen as a value between 0 and 1 
    // - so we multiply these out by the width and height of the canvas.
    // this will be useful in case we want to rescale the video 
    // rect(object.normalized.x * video.width, 
    //      object.normalized.y * video.height, 
    //      object.normalized.width * video.width, 
    //      object.normalized.height * video.height);

    // Draw the label
    noStroke();
    fill(255);
    textSize(24);
    text(object.label, object.x + 10, object.y + 24);
  }
}

function detected(error, results) {
  if (error) {
    console.log("We had an error with the detection -> "+error);
  }
  
  // remember our detections so that we can draw them in draw()
  detections = results;
  
  // By default, no new detection will be done so we need to restart the detection 
  // again (as we did in videoReady(...)) to keep detecting each frame
  detector.detect(video, detected);
}
