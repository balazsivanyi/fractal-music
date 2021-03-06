/* Fractal music generator with L-systems inspired by the code developed by mohammadfairuz.ramla@mylasalle.edu.sg */

//C# myxolidioan scale for L-systems
var newrules = {
  "C#":["E#", "C#"],
  "D#":["G#","F#", "B"],
  "E#":["C#","D#"],
  "F#":["A#","A#"],
  "G#":["E#", "G#", "D#"],
  "A#":["F#","B","C#"],
  "B":["D#","E#"],
};

var seqIndex = 0;
var noteIndex = -1;
let initSeq = ["C#"];
let newTokens = [];
let sequences = [initSeq, []];
let fontSize = 24;
let maxNumSequences = 8;
let maxSequenceLength = 24;

function setup() {
  createCanvas(windowWidth, windowHeight-50);
  
  //setting up sound engine
  synth = new p5.PolySynth();
  sloop = new p5.SoundLoop(soundLoop, 1);
  reverb = new p5.Reverb();
  delay = new p5.Delay();
  filter = new p5.LowPass();
  
  //play button functionality
  playButton = createButton('Play');
  playButton.position(2 * playButton.size().width - 50, height - 2 * playButton.size().height + 50);
  playButton.mousePressed(togglePlay);

  //pause button functionality
  pauseButton = createButton('Pause');
  pauseButton.position(2 * pauseButton.size().width, height - 2 * pauseButton.size().height + 50);
  pauseButton.mousePressed(togglePause); 
  
  //step button functionality
  stepButton = createButton("Step");
  stepButton.position(2 * stepButton.size().width + 100, height - 2 * stepButton.size().height + 50);
  stepButton.mousePressed(stepSoundLoop)
}

function soundLoop(cycleStartTime) {
  //populating noteIndex array with next notes unil previously set max number of an individual sequence is not triggered
  noteIndex++;
  if (noteIndex >= min(sequences[seqIndex].length, maxSequenceLength)) {
    nextSequence();
  }
  
  //initialising tree with sequences and notes
  var token = sequences[seqIndex][noteIndex];
  
  //specifing octaves of sound based on the output of the loop
  var pitch = token + "5"; 
  
  //assigning audio effects
  synth.setADSR(0.01,0.2,0,0.1); 
  reverb.process(synth, 1.5, 1.5);
  reverb.drywet(0.5);
  delay.process(synth, 0.2, 0.6, 2500);
  filter.set(500, 1);
  
  //assigning synth parameters and playing notes
  var velocity = 0.2;
  var beatSeconds = 0.4;
  var duration = random([beatSeconds/2, beatSeconds]);
  this.interval = duration;
  synth.play(pitch, velocity, cycleStartTime, duration);
  synth.connect(filter);

  //preparing next sequence of notes with the rule and adding it to the array
  newTokens = newrules[token];
  sequences[seqIndex+1] = sequences[seqIndex+1].concat(newTokens);
}

function draw() {
  background(000000);
  textAlign(LEFT, CENTER);
  noStroke();
  //displaying played notes with a gradient, and continously shifting them upwards
  for (var i = 0; i < sequences.length; i++) {
    fill(255 - 180 * (i + 1) / sequences.length);
    var seq = sequences[i];
    var lineHeight = fontSize + 5;
    text(seq.join(" "), 50, height * 3/4 - lineHeight * (sequences.length - i - 1));
  }
}

//crerating new empty array for next sequence of notes
function nextSequence() {
  noteIndex = 0;
  seqIndex++;
  sequences.push([]); 
}

//button functionality for play
function togglePlay() {
    sloop.maxIterations = Infinity;
    sloop.start();
}

//button functionality for pause
function togglePause() {
  if (sloop.isPlaying) {
    sloop.pause();
  }
}

//button functionality for playing individual steps
function stepSoundLoop() {
  sloop.stop();
  soundLoop(0);
}