var track, fft;
var xPositionHistory = [],
  yPositionHistory = [],
  segNum;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  segNum = 15;
}

else{
  segNum = 25;
}

for (var i = 0; i < segNum; i++){
  xPositionHistory[i] = 0;
  yPositionHistory[i] = 0;
}

function preload(){
  soundFormats('mp3');
  track = loadSound('/leo_eltes/assets/tracks/42 Guitars mp3.mp3');
}

function setup(){
  var myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.style('position', 'sticky');
  frameRate(30);
  noCursor();
}

function draw(){
  background(animateColour());
  dragSegment(0, mouseX, mouseY);
  for( var i=0; i<xPositionHistory.length-1; i++) {
    dragSegment(i+1, xPositionHistory[i], yPositionHistory[i]);
  }
}

function dragSegment(i, xin, yin){
  var dx = xin - xPositionHistory[i];
  var dy = yin - yPositionHistory[i];
  var angle = atan2(dy, dx);
  xPositionHistory[i] = xin - cos(angle) * random(20, 50);
  yPositionHistory[i] = yin - sin(angle) * random(20, 50);
  segment(xPositionHistory[i], yPositionHistory[i]);
}

function mouseMoved(){
  if(track.isPlaying()){
    return false;
  }
  else{
    track.play();
  }
}

function mousePressed(){
  segNum = 35;
  for (var i = 15; i < segNum; i++){
    xPositionHistory[i] = mouseX;
    yPositionHistory[i] = mouseY;
  }
}

function mouseReleased(){
  for (var i = 0; i < 35; i++){
    xPositionHistory.splice(i, 1);
    yPositionHistory.splice(i, 1);
  }
  segNum=15;
}

function segment(x, y){
  push();
  translate(x, y);
  fill(random(255), random(255), random(255));
  ellipse(random(-25, 25), random(-25, 25), random(20, 35));
  pop();
}

function animateColour(){
  redColor = map(cos(millis()/4000), -1, 1, 0, 255);
  greenColor = map(cos(millis()/3750), -1, 1, 0, 255);
  blueColor = map(cos(millis()/4250), -1, 1, 0, 255);
  return color(redColor, greenColor, blueColor);
}
