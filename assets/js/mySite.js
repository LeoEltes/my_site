if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 throw new Error("This script is not supported on mobile units");
}

var myCanvas;
var introSong, fft;
var button, wrapper;
function preload(){
  introSong = loadSound('assets/tracks/Sad guitar mastered.mp3');
  wrapper = select("#wrapper");
  wrapper.hide();
}

function setup(){
  myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.style('z-index', '-1');
  myCanvas.style('position', 'absolute');
  fft = new p5.FFT();
  introSong.setVolume(1.0);
  introSong.play();
  wrapper.show();
}

function draw(){
  background(153);

  var spectrum = fft.analyze();
  noStroke();
  fill(0);

  for (var i = 0; i < spectrum.length; i++){
    var x = map(i, 0, 400, 0, windowWidth);
    var h = -windowHeight + map(spectrum[i], 0, 255, windowHeight, 0);
    rect(x, windowHeight, windowWidth / spectrum.length, h);
  }
}

function keyPressed() {
  if (keyCode === RETURN){
    togglePlay();
  }
}

function togglePlay() {
  if (introSong.isPlaying()) {
    introSong.pause();
  } else {
    introSong.play();
  }
}

function getRemainingTime(){
  return introSong.duration() - introSong.currentTime();
}

function getRemainingTimeInStrFormat(){
  var songDuration = getRemainingTime();
  var timeInMinutes = str(songDuration/60);
  var actualMinutes = split(timeInMinutes, '.');
  actualMinutes.splice(1, 1);
  var timeInSeconds = str(songDuration % 60);
  timeInSeconds = split(timeInSeconds, '.');
  timeInSeconds.splice(1,1);

  return actualMinutes + '.' + timeInSeconds;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
