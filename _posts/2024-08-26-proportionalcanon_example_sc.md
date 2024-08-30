---
layout: post
title: "Proportional Canon on a Phrase: SuperCollider Example"
date: 2024-08-26
image: "./assets/images/hydrangea_alpha.png"
group: "propcanon"
---

The following is still work-in-progress:

```SuperCollider
// Define the SynthDef
(
SynthDef(\sawSynth, {
    |freq = 440, amp = 0.1, pan = 0, atk = 0.01, rel = 1, cutoff = 4000, rq = 0.25|
    var signal, env;

    // Generate the sawtooth wave
    signal = Saw.ar(freq);

    // Create an amplitude envelope
    env = EnvGen.kr(Env.perc(atk, rel), doneAction: 2);

    // Apply the envelope to the signal
    signal = signal * amp * env;

    // Apply a lowpass filter
    signal = LPF.ar(signal, cutoff, rq);

	// Apply panning
    signal = Pan2.ar(signal, pan);

    // Output the sound
    Out.ar(0, signal);
}).add;
)

// Set the Pbinds (i.e. sequences)
(
var notenums = [55, 59, 62, 67, 71, 74, 79, 83, 55, 60, 64, 67, 72, 76, 79];
var notedurs = [0.5, 0.25, 0.75, 1.5, 0.5, 0.5, 1, 3]; // Durations adding up to 8 seconds

// Assign an array to an environment variable
~myArray = Array.newFrom([nil,nil,nil,nil,nil,nil,nil,nil,nil,nil]);

for (0,9) { arg i;
	~myArray[i] = Pbind(
		\instrument, \sawSynth,
		\midinote, Pseq(notenums+((i-6)*12), inf),
		\dur, Pseq(notedurs*60/i/8, i),
		\legato, 1.2,  // Slight legato to smooth transitions
	);
};

//~myArray.postln;
)

(
for (0,9) { arg i; ~myArray[i].play; }
)

(
for (0,9) { arg i; ~myArray[i].stop; }
)

s.quit;
s.reboot;

// cmd-B start server
// cmd-. stop all sounds
// cmd-return execute command/function
```
