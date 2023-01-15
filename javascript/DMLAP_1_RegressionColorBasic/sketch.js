/*

In this code we create colour markers on the screen, each time saving their coordinates and r,g,b values and providing them to our neural network.
e.g. nnAddData(inputs, output); in mousePressed();

Once we have enough points we call nnTrain(); this trains the neural network

After it has trained we ask the neural network to predict the colour for the mouse coordinates (reflected in the square)

This code demo drastically simplifies the process of training a network as it's week 1 - but later in the module we will do this for ourselves!

Instructions:
- Click to place a point,
- Press 1 to 4 to change the colour of the points
- Press 'T' to train the model

*/


function setup() {
  createCanvas(500, 500);

  // set our background once at the start
  background(255);

  // our first colour can be red;
  ourColor = color(255,0,0);

  // note in this demo we just clear the canvas at the beginning
  background(200);
  fill(0);
  noStroke();
  text("Click to place a point\nPress 1-3 to change color\nPress 't' to train.", 20, 20);

  // setup the neural network (see brain.js)
  // for each example, the network has two inputs [x, y] (the mouse position) and three outputs [r, g, b] (the corresponding color)
  nnSetup({inputs:2, outputs:3});

}

function draw() {
  // if we have already trained we want to show the output as a square
  // in the bottom right-hand side
   if (mode === "demo") {
	   const mouseColor = nnPredict([mouseX, mouseY]);
       print(mouseColor);
	   fill(mouseColor[0], mouseColor[1], mouseColor[2]);
	   rect(0, height-50, 50, 50);
   }
}

function mousePressed() {
  if (mode == "training") {
    // draw a circle at our mouse coordinates, set to the colour of our current color.
    fill(ourColor);
    noStroke();
    ellipse(mouseX, mouseY, 10, 10);

    let inputs = [mouseX, mouseY];
	let output = [red(ourColor),
				  green(ourColor),
				  blue(ourColor)];

    // this adds the data to the neural network
    nnAddData(inputs, output);
  }
}

function keyPressed() {
  if (key == "1") {
    ourColor = color(255,0,0);
  }else if (key == "2") {
    ourColor = color(0,255,0);
  }else if (key == "3") {
    ourColor = color(0,0,255);
  }else if (key == "t") {
    // this means we should train our neural network!
    nnTrain();
  }
}
