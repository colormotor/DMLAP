/*
  Data and machine learning for artistic practice (DMLAP)
  Week 2
  Image classification demo
*/

let classifier,
    result_string = "Predicting...",
    img;

// The preload function is predefined and automatically called in p5js (alike setup or draw). 
// It is used to make sure any asset or object loaded in it is finished 
// BEFORE setup will be called.
function preload() {
  // load in our classifier from the internet. It downloads the model.
  classifier = ml5.imageClassifier("MobileNet");
  
  // load our dog image
  // try out using australian-labradoodle-guide.jpg - does it work well?
  img = loadImage("labrador.jpg");
}

function setup() {
  createCanvas(img.width, img.height + 50);
  
  // call classify on the image
  // we do this in setup as we only want to do this once.
  // we pass in a function `weKnow` that will be called once the classifier has identified what our image is.
  // Note that we pass the name of the function, as an argument to the function.
  // In JavaScript functions can be treated as any other variable. So they can be assigned, e.g. I could do:
  //
  // let f = weKnow; 
  //
  // and then f and weKnow would represent exactly the same function.
  // Note that we do not add the parentheses at the end, it is `weKnow` and not `weKnow()`.
  // that means we are treating the function as a variable, while adding the `()` at the end, with eventual arguments
  // would actually *call* the function (i.e. exectute it) and gives us back any information that the function returns.
  // A function passed in in this manner is commonly referred to as a *callback*, and this is quite common to see in JavaScript.
  classifier.classify(img, weKnow);
}

function draw() {
  background(225);
  
  // draw the dog
  image(img, 0, 0, img.width, img.height);
  
  // draw the prediction, this is waiting text until weKnow is called.
  fill(0);
  textSize(20);
  textAlign(CENTER);
  text(result_string, 0, height - 40, width, 40);
}

function weKnow(error, results) {
  // this function is called when the image classifier has decided on what the image contains, or has thrown an error. This is called a callback function.
  
  console.log(results);
  
  if (!error) {
    // log our results to the console so we can see them
    console.log("We think we know what this is...");
    console.log(results);
    
    // form a string to contain the results
    // here we use the backtick method of embedding variables in strings. We use Math.ceil to round up the decimal to the closest whole number
    result_string = `This is a ${results[0].label}, I'm ${(Math.ceil(results[0].confidence * 100))}% confident.`;
  
  }else {
    // there was an error
    console.log("There was an error determining the object within the image -> "+error);
  }
}