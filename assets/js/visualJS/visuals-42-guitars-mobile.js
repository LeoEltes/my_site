var track;
var xPositionHistory = [],
  yPositionHistory = [],
  segNum = 2;

for (var i = 0; i < segNum; i++){
  xPositionHistory[i] = 0;
  yPositionHistory[i] = 0;
}

function preload(){
  soundFormats('mp3');
  track = loadSound('/leo_eltes/assets/tracks/42 Guitars mp3.mp3');
}

function setup(){
  var myCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
  myCanvas.style('position', 'absolute');
  frameRate(30);
}

function draw(){
  background(animateColour());
  var currentXPos = map(rotationZ, 0, 359, 0, windowWidth, true);
  var currentYPos = map(rotationX, -180, 180, 0, windowHeight, true);
  dragSegment(0, 0, mouseY);
  console.log("Zrotation, xpos: " +currentXPos);
  console.log("Xrotation, ypos: " +currentYPos);
  for( var i=0; i<xPositionHistory.length-1; i++) {
    dragSegment(i+1, xPositionHistory[i], yPositionHistory[i]);
  }
}

function animateColour(){
  redColor = map(cos(millis()/4000), -1, 1, 0, 255);
  greenColor = map(cos(millis()/3750), -1, 1, 0, 255);
  blueColor = map(cos(millis()/4250), -1, 1, 0, 255);
  return color(redColor, greenColor, blueColor);
}

function dragSegment(i, xin, yin){
  var dx = xin - xPositionHistory[i];
  var dy = yin - yPositionHistory[i];
  var angle = atan2(dy, dx);
  xPositionHistory[i] = xin - cos(angle) * random(20, 50);
  yPositionHistory[i] = yin - sin(angle) * random(20, 50);
  segment(xPositionHistory[i], yPositionHistory[i]);
}

function segment(x, y){
  push();
  translate(x, y);
  fill(random(255), random(255), random(255));
  ellipse(random(-25, 25), random(-25, 25), random(20, 35));
  pop();
}

function mousePressed(){
  if(track.isPlaying()){
    return false;
  }
  else{
    track.play();
  }
}
