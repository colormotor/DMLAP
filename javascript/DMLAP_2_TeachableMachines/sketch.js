/*
  Data and machine learning for artistic practice (DMLAP)
  Week 3
  
  Image classifier via model trained with Teachable Machines
  adapted from https://github.com/ml5js/Intro-ML-Arts-IMA-F21
*/


// Classifier Variable
let classifier;
// Model URL (replace with your model trained on teachablemachine.withgoogle.com)
//const imageModelURL = 'https://teachablemachine.withgoogle.com/models/bXy2kDNi/'; // Night vs Day
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/pcs6MFoPB/'; // Simley vs Star (drawings)

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let confidence = 0.0;

// Load the model first
function preload() {
  // eslint-disable-next-line prefer-template
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(320, 260);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label + ' confidence:' + confidence.toFixed(2), width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  confidence = results[0].confidence;
  // Classifiy again!
  classifyVideo();
}
