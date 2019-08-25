//"REG" = prodclass på Öresundståg, "VAS" = prodclass på Västtågen
let myData = [];
let test = false;
let arrayNumber = 0;
let xpos1, ypos1;

let emptyArray = [];
let synthArray = [];
let waveformArray = [];
let thisSynthArray = [];
let thisWaveformArray = [];
let thisDelayArray = [];

let timerSynth1, timerPad, bassTimer;
let waitSynth1 = 1400;
let waitPad = 12000;
let waitBass = 25000;

let dlyTime, dlyFdb;

let noiseInc = 0;

let deviceId = new Date().getTime();
let key = 'yjnmMp4QnBYswNMS5nvZmkvqpaoa';
let secret = 'dt6nY3mg3TiveWQRrfMEYLFhQQ0a';
let token;

function preload(){
  authorize();
  getData();
}

function getData(){
    $.ajax({
      type: "GET",
      url: "https://api.vasttrafik.se/bin/rest.exe/v2/livemap",
      dataType: "json",
        data: {
        "minx": "12005078",
        "maxx": "12172045",
        "miny": "57460879",
        "maxy": "57507487",
        "onlyRealtime": "yes"
        },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      },
      success: function(data) {
        myData = data.livemap.vehicles;
        test = true;
        },
      error: function(xhr, ajaxOptions, thrownError){
          console.log(xhr.status);
          console.log(thrownError);
        }
      });
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  getData();
  frameRate(30);
  background(50);
  timerSynth1 = millis();
  timerPad = millis();
  bassTimer = millis();
  for(let i = 0; i < 18; i++){
    synthArray[i] = new Tone.PolySynth(1, Tone.Synth, {
      "oscillator" : {
        "partials" : [1.0, 0.6, 0.3, 0],
      },
      "envelope" : {
        "attack" : 0.01,
        "decay" : 1.8,
        "sustain" : 1.0,
        "release" : 1.8,
        "attackCurve" : 'linear',
        "decayCurve" : 'exponential',
        "releaseCurve" : 'exponential'
      },
      "filter" : {
        "type" : 'lowpass',
        "frequency" : 600,
        "rolloff" : -6,
        "Q" : 1,
      }
    });

    waveformArray[i] = new Tone.Waveform(1024);
    pad.connect(waveformArray[i]);
    synth2.connect(waveformArray[i]);
    synthArray[i].connect(waveformArray[i]);
    thisDelayArray[i] = new Tone.FeedbackDelay(0.74, 0.34).connect(panning);
    synthArray[i].connect(thisDelayArray[i]);
  }
}

function draw(){
  if (test == false){
    console.log('loading...');
    getData();
  }
  else if(test){
    background(50);
    getData();

    for(let i = 0; i < myData.length; i++){
      thisSynthArray[i] = synthArray[i];
      thisWaveformArray[i] = waveformArray[i];
    }

    for(let i = 0; i < myData.length; i++){
      let waveform = thisWaveformArray[i].getValue();
      xpos1 = map(myData[i].x, 12005078, 12172045, 0, width);
      ypos1 = map(myData[i].y, 57507487, 57460879, 0, height);

      let stationX = map(12079875, 12005078, 12172045, 0, width);
      let stationY = map(57489564, 57507487, 57460879, 0, height);
      let angle = atan2(stationY - ypos1, stationX - xpos1);

      let hypotenusa = sqrt(abs(stationX-xpos1)*abs(stationX-xpos1) + abs(stationY - ypos1)*abs(stationY - ypos1));

      push();
      translate(xpos1, ypos1);
      fill(255);
      ellipse(0, 0, 21);
      strokeWeight(2);
      text(myData[i].name, 0 + 10, 0 + 4);

      rotate(angle);
      noFill();
      beginShape();
      stroke(255, 120);
      strokeWeight(1);
      for(let i = 0; i < waveform.length; i++){
        let xThis = map(i, 0, waveform.length, 21/2 - 1, hypotenusa);
        let yThis = map(waveform[i], -1, 1, -hypotenusa/10, hypotenusa/10);
        vertex(xThis,yThis);
      }
      endShape();
      pop();

      if(millis() - bassTimer >= waitBass && (myData[i].name == "Västtågen" || myData[i].name == "Öresundståg")){
        playSynth2();
        bassTimer = millis();
      }
    }
    if(millis() - timerSynth1 >= waitSynth1 + (noise(noiseInc)) * 2000){
      let randomIndex = round(random(0, myData.length -1));
      thisDelayArray[randomIndex].feedback.value = random(0.10, 0.50);
      thisDelayArray[randomIndex].delayTime.value = myData[randomIndex].delay;
      playRandomTone(randomIndex, round(map(myData[randomIndex].y, 57507487, 57460879, 4, 0)), map(myData[randomIndex].x, 12005078, 12172045, -1, 1));
      timerSynth1 = millis();
    }

    if(millis() - timerPad >= waitPad + (noise(1000 + noiseInc) - 0.5) * 4000){
      playChord();
      timerPad = millis();
    }
    noiseInc += 0.01
  }
}

function playChord(){
  let arrayOfNotes = [];
  for(let i = 0; i < myData.length; i++){
    arrayOfNotes[i] = fullScale[round(map(myData[i].y, 57507487, 57460879, 0, fullScale.length - 1))];
  }
  let uniqueArray = [...new Set(arrayOfNotes)];
  playPad(uniqueArray);
}

function playRandomTone(index, pitch, panVal){
  thisSynthArray[index].triggerAttackRelease(scaleArray[pitch], "32n", undefined, random(0.1, 0.75));
  panning.pan.value = panVal;
}

function authorize(){
  let credentials = btoa(key + ':' + secret);

  let request = superagent('POST', 'https://api.vasttrafik.se/token');
  request.set({Authorization: 'Basic ' + credentials});
  request.send('grant_type=client_credentials&scope=device_' + deviceId);

  return request.then(res => {
    if (!res.ok){
      return Promise.reject(res.error);
    }
    else {
      token = res.body.access_token;
    }
  })
}
