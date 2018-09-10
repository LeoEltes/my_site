var track;
var xPositionHistory = [],
  yPositionHistory = [],
  segNum = 6;

for (var i = 0; i < segNum; i++){
  xPositionHistory[i] = 0;
  yPositionHistory[i] = 0;
}

// Position Variables
var newXpar = 0;
var newYpar = 0;

// Speed - Velocity
var vx = 0;
var vy = 0;

// Acceleration
var ax = 0;
var ay = 0;

var vMultiplier = 0.007;
var bMultiplier = 0.6;

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
  ballMove();
  dragSegment(0, newXpar, newYpar);
  for( var i=0; i<xPositionHistory.length-1; i++) {
    dragSegment(i+1, xPositionHistory[i], yPositionHistory[i]);
  }
}

function dragSegment(i, xin, yin){
  angleMode(RADIANS);
  var dx = xin - xPositionHistory[i];
  var dy = yin - yPositionHistory[i];
  var angle = atan2(dy, dx);
  xPositionHistory[i] = xin - cos(angle) * random(20, 50);
  yPositionHistory[i] = yin - sin(angle) * random(20, 50);
  segment(xPositionHistory[i], yPositionHistory[i]);
}

function mousePressed(){
  if(track.isPlaying()){
    return false;
  }
  else{
    track.play();
  }
}

function segment(x, y){
  push();
  translate(x, y);
  fill(random(255), random(255), random(255));
  ellipse(random(-8, 8), random(-8, 8), random(8, 20));
  pop();
}

function animateColour(){
  angleMode(RADIANS);
  redColor = map(cos(millis()/4000), -1, 1, 0, 255);
  greenColor = map(cos(millis()/3750), -1, 1, 0, 255);
  blueColor = map(cos(millis()/4250), -1, 1, 0, 255);
  return color(redColor, greenColor, blueColor);
}

function ballMove() {

	ax = accelerationX;
	ay = accelerationY;

	vx = vx + ay;
	vy = vy + ax;
	newYpar = newYpar + vy * vMultiplier;
	newXpar = newXpar + vx * vMultiplier;

	// Bounce when touch the edge of the canvas
	if (newXpar < 0) {
		newXpar = 0;
		vx = -vx * bMultiplier;
	}
 	if (newYpar < 0) {
 		newYpar = 0;
 		vy = -vy * bMultiplier;
 	}
 	if (newXpar > width - 20) {
 		newXpar = width - 20;
 		vx = -vx * bMultiplier;
 	}
 	if (newYpar > height - 20) {
 		newYpar = height - 20;
 		vy = -vy * bMultiplier;
 	}

}
