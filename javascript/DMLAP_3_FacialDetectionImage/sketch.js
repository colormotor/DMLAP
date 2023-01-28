/*
  Data and machine learning for artistic practice
  Week 3
  
  Facial detection on an image
  
*/

let faceapi,
    img,
    detections;

// these are our options for detecting faces, provided by ml5.js
const detection_options = {
    withLandmarks: true,
    withDescriptors: true,
}

function preload() {
  // load image
  img = loadImage("alf.jpg");
}


function setup() {
  createCanvas(img.width, img.height);

  // load the faceapi model - with modelReady() callback
  faceapi = ml5.faceApi(detection_options, modelReady);
}


function draw() {
  background(0);
  
  // draw picture
  image(img, 0,0, width, height)
  
  // if we have detections, draw them on the image
  if (detections) {
    drawBox(detections);
    drawLandmarks(detections);
  }
  
}


// callback for when ml5.js has loaded the model
function modelReady() {
  console.log("Model is ready...");

  // ask ml5 to detect a single face in this image - gotResults() callback
  faceapi.detectSingle(img, gotResults);
}

// ml5.js has determined if there's a face
function gotResults(err, result) {
    // check if ml5.js returned an error - if so print to console and stop
    if (err) {
        console.log(err)
        return
    }
      
    // if it gets here we are okay, so store results in the detections variable, this is an OBJECT of detections - see the console
    console.log(result);
    detections = result;
  
}
  

// *** Draw our elements on the image, a box and face feature locations ***  
function drawBox(detections){
    const alignedRect = detections.alignedRect;
    // we are deconstructing, this is the same as if we did this:
    // const _x = alignedRect._box._x;
    // const _y = alignedRect._box._y;
    // const _width = alignedRect._box._width;
    // const _height = alignedRect._box._height;
    const {_x, _y, _width, _height} = alignedRect._box;
    
    noFill();
    stroke(161, 95, 251);
    strokeWeight(2)
    rect(_x, _y, _width, _height)
}

function drawLandmarks(detections){
    /* 
      In this example we use forEach(), this is a quick way of looping through the objects in an array. It will in this case return each value in the array sequentially as the local variable "item".
      
      In this case, it's equivilent of doing this:
      for (let i=0; i<detections.parts.mouth.length; i++) {
        let item = detections.parts.mouth.length[i];
        
        //...
      }
      
      or 
      
      for (let item of detections.parts.mouth) {
        //...
      }
    */
  
    noFill();
    stroke(161, 95, 251);
    strokeWeight(2)
    
    push()
    // mouth
    beginShape();
    detections.parts.mouth.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // nose
    beginShape();
    detections.parts.nose.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // left eye
    beginShape();
    detections.parts.leftEye.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // right eye
    beginShape();
    detections.parts.rightEye.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape(CLOSE);

    // right eyebrow
    beginShape();
    detections.parts.rightEyeBrow.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape();

    // left eye
    beginShape();
    detections.parts.leftEyeBrow.forEach(item => {
        vertex(item._x, item._y)
    })
    endShape();

    pop();

}
