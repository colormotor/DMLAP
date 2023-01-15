/*

Helper code providing access to a ml5.js neural network, basically simplifying sketch.js for you.
You most likely don't need to change anything here.
*/

let nn,
    mode = "training";

// Default options for all functions in this file
const DEFAULTS = {
    inputs: 1,
    outputs: 1,
    architecture: 'default', // This will use the default ML5js architecture
    hiddenUnits: 16,
    batchSize: 32,
    learningRate: 0.2,
    validationSplit:0.0, // By default we won't perform any validation. This does not influence training, but removes datapoints if > 0
    liveUpdate: false,
};

function nnSetup(options_={}) {
  // set up our neural network
    const options = {
        ...DEFAULTS,
        ...options_,
    } || DEFAULTS;

  if (options.activation == 'tanh'){
    // This is an alternative regression architecture. Will result in "smoother" predictions
    layers = [{
                type: 'dense',
                units: options.hiddenUnits,
                activation: 'tanh'
              },
              {
                type: 'dense',
                activation: 'linear'
              }];
  }else{
    // This is the default "regression" architecture for ML5js, equivalent to not specifying any layers
    layers = [
          {
            type: 'dense',
            units: options.hiddenUnits,
            activation: 'relu',
          },
          {
            type: 'dense',
            activation: 'sigmoid',
          },
        ];
  }

  nn = ml5.neuralNetwork({
    inputs: options.inputs,
    outputs: options.outputs,
    layers: layers,
    task: 'regression', // more on what this is next week
    debug: true
  });
}

function nnAddData(inputs, outputs) {
  // we add it to the 'brain'
  nn.addData(inputs, outputs);
}

function nnTrain(numEpochs=35, options_={}){
  const options = {
        ...DEFAULTS,
        ...options_,
  } || DEFAULTS;

  // we normalise the data
  nn.normalizeData();

  // we then train our neural network
  nn.train({
    epochs: numEpochs,
    batchSize: options.batchSize,
    learningRate: options.learningRate,
    validationSplit:options.validationSplit
  }, finishedTraining);
  if (options.liveUpdate) // this will signal that we want to see updates as we train (might slow down training)
    mode = "demo";
}

function finishedTraining(){
  console.log("We finished training!");
  // switch to the demo mode - this will tell our app that we can visualize the result
  mode = "demo";
}

function nnPredict(input) {
  // The standard ML5js way to perform predictions is asyncronous, but async programming can be tricky.
  // Luckily the "predictSync" function forces ML5js to give us the result immediately and simplifies matters
  const res = nn.predictSync(input);

  // ML5 places each component of the prediction into an object.
  // as a result, the format of the output of a prediction is different from the one given as training data
  // E.g. if we trained the network with one input array [x] and an output array [a, b, c] one prediction will give
  // [{'0':predicted_a, ... , 'value':predicted_a, ...},
  //  {'1':predicted_b, ... , 'value':predicted_b, ...},
  //  {'2':predicted_c, ... , 'value':predicted_c, ...}]
  // meaning that with "straight" ML5js we will need to parse these values and put them into our preferred format
  // (which is likely the one we provided in the first place as training data).
  //
  // If we provide an array of inputs (asking for multiple predictions), predictedSync will return an array of such objects, so here we handle the two cases
  
  // making it consistent with the input format
  if (Array.isArray(input[0])){
    // multiple predictions
    return res.map(element => element.map(v => v.value));
  }else{
    // make one prediction
    return res.map(v => v.value);
  }
}
