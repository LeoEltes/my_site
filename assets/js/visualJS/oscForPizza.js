let scaleArray = ['C#4', 'D#4', 'F#4', 'G#4', 'A#4'];
let bassArray = ['C#1', "D#1", 'F#1', 'G#1', 'A#1', 'C#2', "D#2", 'F#2', 'G#2', 'A#2'];
let fullScale = ['C#3','D#3', 'F#3', 'G#3', 'A#3', 'C4', 'C#4', 'D#4', 'F4', 'F#4', 'G#4', 'A#4', 'C#5', 'D#5'];

let myChorus = new Tone.Chorus({
  "frequency" : 0.33,
  "delayTime" : 0.6,
  "depth" : 0.8,
  "type" : 'sine',
  "spead" : 110
});
let bassFilter = new Tone.Filter(380, "lowpass", -12);
let reverb = new Tone.Freeverb(0.80, 2000).toMaster();
let panning = new Tone.Panner(0).connect(reverb);

let synth2 = new Tone.Synth({
  "oscillator" : {
    "type" : 'sawtooth'
  },
  "envelope" : {
    "attack" : 9.0,
    "decay" : 0.04,
    "sustain" : 0.0,
    "release" : 5.4,
    "attackCurve" : 'linear',
    "decayCurve" : 'exponential',
    "releaseCurve" : 'exponential'
  },
  "volume" : -6
}).connect(bassFilter);
bassFilter.connect(reverb);

let pad = new Tone.PolySynth(8, Tone.Synth, {
  "oscillator" : {
    "type" : "sine",
  },
  "envelope" : {
    "attack" : 5.0,
    "decay" : 0.8,
    "sustain" : 0.35,
    "release" : 3.83,
    "attackCurve" : 'linear',
    "decayCurve" : 'exponential',
    "releaseCurve" : 'exponential'
  },
  "filter" : {
    "type" : 'lowpass',
    "frequency" : 650,
    "rolloff" : -24,
    "gain" : 0,
    "Q" : 1
  },
  "volume" : -8
});

myChorus.connect(reverb);
pad.connect(myChorus);
Tone.Master.volume.value = -12;

function playSynth2(){
  synth2.triggerAttack(bassArray[round(random(0, bassArray.length - 1))]);
  synth2.setNote(bassArray[round(random(0, bassArray.length - 1))]);
}

function playPad(chord){
  pad.triggerAttackRelease(chord, random(3, 9.0), undefined, random(0.1, 0.4));
}
