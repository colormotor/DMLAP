/*
  Data and machine learning for artistic practice
  Week 3
  
  Facial recognition on an image
*/

let faceapi,
    group_photo,
    detections = [],
    people_detections = [],
    label_images = [],
    labeledFaceDescriptors = [];

// Our labels correspond to images in the "images" folder
const labels = ["chandler", "monica", "ross", "joey", "phoebe"];

// these are our options for detecting faces, provided by ml5.js
const detection_options = {
    withLandmarks: true,
    withDescriptors: true,
};

function preload() {
  // preload our image
  group_photo = loadImage("./images/friends-group.jpg");
  for (let label of labels) {
    const imgUrl = `./images/${label}.jpg`;
    const img = loadImage(imgUrl);
    label_images.push(img);
  }
}

function modelReady() {
  // Model has loaded, detect faces
  console.log("Model ready, detecting");
  faceapi.detect(group_photo, gotResults);
}

function gotResults(err, results) {
  // We found faces, store and recognize them now
  console.log("Got results");
  detections = results;
  recognizeFaces(results);
}

// This function must be defined "async" to work since it uses parts of the faceapi that are hidden to the Ml5js user
async function recognizeFaces(fullFaceDescriptions) {
  // we loop through the labels array, looking at each new face. We then load in the image for each of them - these are the small headshots.
  let labeledFaceDescriptors = [];
  for (let i = 0; i < labels.length; i++) {
    let img = label_images[i];
    let label = labels[i];
    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
    const fullFaceDescription = await faceapi.detectSingle(img);
    print("desc");
    console.log(fullFaceDescription);//"Detection");
    if (!fullFaceDescription) {
      throw new Error(`no faces detected for ${label}`);
    }

    // // save the face descriptors plus the label e.g. Joey to the labeledFaceDescriptors array
    const faceDescriptors = [fullFaceDescription.descriptor];
    console.log(faceDescriptors);
    labeledFaceDescriptors.push(new faceapi.model.LabeledFaceDescriptors(label, faceDescriptors));
  }

   // log so we can see
  console.log(labeledFaceDescriptors);

  // we determine the maximum euclidian distance and then use faceMatcher() to compare all the faces to our large image
  const maxDescriptorDistance = 0.6;
  const faceMatcher = new faceapi.model.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);

  // we fill an array (results) with the best matches based on the descriptors we generated above
  let results = [];
  for (let desc of fullFaceDescriptions){
      results.push(faceMatcher.findBestMatch(desc.descriptor));
  }

  // save this array to global so we can display it
  people_detections = results;

  // log results
  console.log(results);
  console.log("Done");
}

function setup() {
  createCanvas(840, 743); // use dimensions of image
  faceapi = ml5.faceApi(detection_options, modelReady);
  return;
}


function draw() {
  // draw the group image
  image(group_photo, 0, 0);
  //return;

  // loop through detected faces and draw it
  for (let detected of detections) {
      // we grab this for the names - this is the x and y coords of the face
      const alignedRect = detected.alignedRect;
      const {_x, _y, _width, _height} = alignedRect._box;

      // draw our box and new landmarks
      drawBox(detected);
      drawLandmarksv2(detected);

      // if names have been predicted, loop through and display them by the box
      if (people_detections.length == detections.length) {
          var name = people_detections[detections.indexOf(detected)]._label;
          var dist = people_detections[detections.indexOf(detected)]._distance;

          // styling
          textSize(15);
          noStroke();
          fill(161, 95, 251)
          text(name, _x, _y);
      }
  }
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

function drawLandmarksv2(detections){
    for(let p of detections.landmarks.positions) {
      point(p._x, p._y);
    }
}
