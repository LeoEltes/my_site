var track, hpFilterFreq, lpFilterFreq, fft, lowFrequency, midFrequency, highFrequency, lpFilter, delay, reverb;

var backColor = 0;

var circles = [];

function preload(){
  soundFormats('mp3');
  track = loadSound('/leo_eltes/assets/tracks/fringilla mp3.mp3');
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  lpFilterDelay = new p5.Delay();
  lpFilterDelay.process(track, 0.25, 0.3, 480);

  delay = new p5.Delay();
  delay.process(track, 0.54, 0.5);

  reverb = new p5.Reverb();
  reverb.process(track, 4.5, 6);

  lpFilterDelay.disconnect();
  delay.disconnect();
  reverb.disconnect();

  track.play();

  lowFrequency = 240;
  midFrequency = 2800;
  highFrequency = 20000;

  fft = new p5.FFT();
  frameRate(30);

  createCircle(windowWidth/4, windowHeight/2, 255, lowFrequency, lpFilterDelay);
  createCircle(windowWidth/2, windowHeight/2, 255, midFrequency, delay);
  createCircle((3*windowWidth)/4, windowHeight/2, 255, highFrequency, reverb);
}

class FreqCircle{
  constructor(xPosition, yPosition, color, frequencyRange, fx){
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.radius;
    this.color = color;
    this.frequencyRange = frequencyRange;
    this.fx = fx;
    this.fxCheck = false;
  }

  contains(xPar, yPar){
    var distance = dist(xPar, yPar, this.xPosition, this.yPosition);
    if (distance <= this.radius){
      return true;
    }
    else{
      return false;
    }
  }

    analyzeFreq(freqAmplitude){
      this.radius = map(freqAmplitude, 0, 255, 0, 200);
    }

    display(){
      noStroke();
      fill(this.color);
      ellipse(this.xPosition, this.yPosition, this.radius * 2);
    }

    changeColorToggle(color){
      if(this.color == 255){
        this.color = color;
      }
      else{
        this.color = 255;
      }
    }

    fxToggle(){
      if(this.fxCheck == false){
        this.fx.connect();
        this.fxCheck = true;
      }
      else{
        this.fx.disconnect();

        this.fxCheck = false;
      }
    }

    getFreqRange(){
      return this.frequencyRange;
    }
}

function draw(){
  background(0);

  fft.analyze();

  for (var i = 0; i < circles.length; i++){
    circles[0].analyzeFreq(fft.getEnergy(10, lowFrequency));
    circles[1].analyzeFreq(fft.getEnergy(lowFrequency, midFrequency));
    circles[2].analyzeFreq(fft.getEnergy(midFrequency, highFrequency));
    circles[i].contains(mouseX, mouseY);
    circles[i].display();
  }
}

function createCircle(xPosition, yPosition, radius, color, freqRange, fx){
  circles.push(new FreqCircle(xPosition, yPosition, radius, color, freqRange, fx));
}

function mousePressed(){
  for (var i = circles.length -1; i >= 0; i--){
    if(circles[i].contains(mouseX, mouseY)){
      circles[i].changeColorToggle(color(156, 23, 123));
      circles[i].fxToggle();
    }
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
