/*

In this code we create colour markers on the screen, each time saving their coordinates and r,g,b values and providing them to our neural network.
e.g. nnAddData(inputs, output); in mousePressed();

Once we have enough points we call nnTrain(); this trains the neural network

The demo will show a grid with all the colors predicted at each position

This code demo drastically simplifies the process of training a network as it's week 1 - but later in the module we will do this for ourselves!

Instructions:
- Click to place a point,
- Press 1 to 4 to change the colour of the points
- Press 't' to train the model

*/

let data_points = [];

function initNeuralNetwork() {
  // setup the neural network (see brain.js)
  // for each example, the network has two inputs [x, y] (the mouse position) and three outputs [r, g, b] (the corresponding color)
  nnSetup({inputs:2,   // do not change this
           outputs: 3, // do not change this
           hiddenUnits: 16, // the number of hidden units in our neural network (generally this should be proportional to the dataset size)
           architecture: 'default', // try changing this to 'tanh' for a different neural network architecture
           });
}

function setup() {
  createCanvas(500, 500);

  // set our background once at the start
  background(255);

  ourColor = color(255,0,0);

  initNeuralNetwork();

  // Uncomment to load an existing configuration of colors
  // loadData('data.json');
}


// This function draws a grid predicting the color for each cell in the grid
function drawGrid() {
  let step = 20; // The coarsness of the grid
  // Collect center points of each cell and put the points in an array
  // the array will be ordered by rows of the grid
  let inputs = [];
  for (let y = 0; y < 500; y += step){
    for (let x = 0; x < 500; x += step){
      inputs.push([(x + step/2)/500, (y + step/2)/500]);
    }
  }

  // Predict colors for ALL collected center points
  let res = nnPredict(inputs);

  // Now draw the grid with the predicted colors
  let i = 0;
  for (let y = 0; y < 500; y += step){
    for (let x = 0; x < 500; x += step){
      const clr = res[i];
      fill(clr[0], clr[1], clr[2]);
      rect(x, y, step, step);
      i += 1; // Increment cell (recall these are ordered by row and the inner loop goes along a row)
    }
  }
}

function draw() {
  // note in this demo we update the canvas every frame
  background(200);
  fill(0);
  noStroke();
  text("Click to place a point\nPress 1-3 to change color\nPress 't' to train.", 20, 20);

  fill(ourColor);
  stroke(1);
  ellipse(mouseX, mouseY, 5, 5);

  // if we have already trained the neural network draw a grid with the predicted colors
   if (mode === "demo") {
     drawGrid();
   }

  for (const p of data_points){
    fill(p.r, p.g, p.b);
    stroke(0);
    ellipse(p.x, p.y, 10, 10);
  }
}

function mousePressed() {
  if (mode == "training") {
    // draw a circle at our mouse coordinates, set to the colour of our current color.
    let inputs = [mouseX/500, mouseY/500];
	  let output = [red(ourColor),
				          green(ourColor),
				          blue(ourColor)];

    data_points.push({x: mouseX,
                      y: mouseY,
                      r: red(ourColor),
                      g: green(ourColor),
                      b: blue(ourColor)});

    nnAddData(inputs, output);
  }
}

function keyPressed() {
  // Switch is equivalent to a series of if-else statements
  //
  switch (key) {
    // 1, 2, 3 select colors
    case "1":
      ourColor = color(255,0,0);
      break; // Important to call break after each "case" otherwise execution will continue to the next
    case "2":
      ourColor = color(0,255,0);
      break;
    case "3":
      ourColor = color(0,0,255);
      break;
    // "t" starts training the neural network! (see brain.js)
    case "t":
      nnTrain(50, {liveUpdate:true, // if true, we will see the result at each iteration of training
                    learningRate: 0.2, // "speed" at which the training procedure tries to reach the minimum error
                                       // should be less than 1
                 });
      break;
    case "l":
      loadData("data.json");
      break;
    case "s":
      saveData("data.json");
      break;
  }
}

// Loading and saving
function loadData(path){
  function loaded(json){
    // Clear the neural network
    initNeuralNetwork();
    // Load existing data if any
    data_points = json;
    // if we have points add them
    for (const data of data_points){
      let input = [data.x, data.y];
      let output = [data.r, data.g, data.b];
      // this adds the data to the neural network
      nnAddData(input, output);
    }
  }

  loadJSON(path, loaded);
}

// This will actually download a file. 
function saveData(path){
  saveJSON(data_points, './data.json');
}
