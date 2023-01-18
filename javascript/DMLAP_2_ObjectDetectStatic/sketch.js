/*
  Data and machine learning for artistic practice (DMLAP)
  Week 2
  
  Object detector via static image,
*/

let detector,
    pic,
    detections = [];

// The preload function is predefined and automatically called in p5js (alike setup or draw). 
// It is used to make sure any asset or object loaded in it is finished 
// BEFORE setup will be called.
function preload() {
  // load our object library cocossd - you could use 'YOLO'
  detector = ml5.objectDetector('cocossd');
  
  // load our image
  pic = loadImage('dog.jpg');
}

function setup() {
  createCanvas(pic.width, pic.height);
  
  // start our detector, give the callback function of detected()
  detector.detect(pic, detected);
}


function draw() {
  // clear the background
  background(0);
  
  // draw dog photo
  image(pic, 0, 0);

  // loop through all our detections and draw them
  for (let object of detections) {
    // we use lerp to color the border somewhere between red and green based on the confidence of the prediction
    stroke(lerpColor(color(255,0,0), color(0, 255, 0), object.confidence));
    strokeWeight(3);
    noFill();
    // draw rectangle around a detection
    rect(object.x, object.y, object.width, object.height);
    // We can also use the normalised values, these represent the percentage across the screen as a value between 0 and 1 - so we multiply these out by the width and height of the canvas.
    // rect(object.normalized.x * pic.width, object.normalized.y * pic.height, object.normalized.width * pic.width, object.normalized.height * pic.height);
    
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
}
