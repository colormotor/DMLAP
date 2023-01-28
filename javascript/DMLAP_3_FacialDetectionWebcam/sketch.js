/*
  Data and machine learning for artistic practice
  Week 3
  
  Facial detection on a webcam
  
*/

let faceapi,
    video,
    detections;

// these are our options for detecting faces, provided by ml5.js
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function setup() {
  createCanvas(600, 338); // I use these to downsize a 720p stream, but you can adjust for your webcam if it skews it.
 
  // ask for webcam access - with webcamReady() callback for when we have access
  video = createCapture(VIDEO, webcamReady);
  video.size(width, height); // set size to be equal to canvas
  video.hide(); // hide DOM element
}

function webcamReady(stream) {
  // load the faceapi model - with modelReady() callback
  // - NOTE: this time we provide video as the first parameter
  faceapi = ml5.faceApi(video, detection_options, modelReady)
}

function draw() {
  background(0);
  
  // draw picture
  image(video, 0,0, width, height)
  
  // if we have detections, draw them on the image
  if (detections) {
    // when we call detect, we are looking for potentially multiple faces, so ml5.js returns an array of objects, therefore here we use a for loop to get each 'person'.
    for (let person of detections) {
      drawBox(person);
      drawLandmarks(person);
    }
  }
}


// callback for when ml5.js has loaded the model
function modelReady() {
  console.log("Model is ready...");

  // ask ml5 to detect a faces in the video stream previously provided - gotResults() callback
  faceapi.detect(gotResults);
}

// ml5.js has determined if there's a face
function gotResults(err, result) {
    // check if ml5.js returned an error - if so print to console and stop
    if (err) {
        console.log(err)
        return
    }
      
    // if it gets here we are okay, so store results in the detections variable, this is an OBJECT of detections - see the console
    //console.log(result);
    detections = result;
      
    // we recursively call face detect
    faceapi.detect(gotResults)
}
  

// *** Draw our elements on the image, a box and face feature locations ***  
function drawBox(detections){
    const alignedRect = detections.alignedRect;
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
      
      for (let item in detections.parts.mouth.length) {
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