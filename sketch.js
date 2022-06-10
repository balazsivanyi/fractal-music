
//setting up rools for L-systems
var rules = {
  "A":["C","F","E"],
  "C":["G","E"],
  "E":["C","G"],
  "F":["A","C"],
  "G":["E","F","C"]
};

var seqIndex = 0;
var noteIndex = -1;
let initSeq = ["C"];
let newTokens = [];
let sequences = [initSeq, []];
let fontSize = 24;
let maxNumSequences = 8;
let maxSequenceLength = 30;

function setup() {
  
  //setting up visuals
  createCanvas(800, 500);

  //setting up sound engine
  synth = new p5.PolySynth();
  sloop = new p5.SoundLoop(soundLoop, 0.5);
  
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
  var pitch = token + "4"; 
  
  //assigning synth parameters and playing notes
  var velocity = 0.5;
  var beatSeconds = 0.5;
  var duration = random([beatSeconds, beatSeconds/4]);
  this.interval = duration;
  synth.play(pitch, velocity, cycleStartTime, duration);
  
  //preparing next sequence of notes with the rule and adding it to the array
  newTokens = rules[token];
  sequences[seqIndex+1] = sequences[seqIndex+1].concat(newTokens);
}

function draw() {
  background(0, 255, 255);

  // highlightNote(seqIndex, noteIndex, generatingTokenColor);
  // for (var i=0; i<newTokens.length; i++) {
  //   highlightNote(seqIndex + 1, sequences[seqIndex + 1].length - 1 - i, newTokenColor);
  // }

  // textAlign(CENTER, CENTER);
  // noStroke();

  // for (var i=0; i<sequences.length; i++) {
  //   fill(255 - 195 * (i+1) / sequences.length);
  //   if (i == sequences.length - 1) {
  //     fill(0, 150, 255); // Generated tokens text
  //   }
  //   var seq = sequences[i];
  //   var lineHeight = fontSize + 10;
  //   text(seq.join(" "), width/2, height*2/3 - lineHeight * (sequences.length - i - 1));
  // }
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
