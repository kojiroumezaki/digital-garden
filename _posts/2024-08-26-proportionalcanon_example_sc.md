---
layout: post
title: "Proportional Canon on a Phrase: SuperCollider Example"
date: 2024-08-26
image: "./assets/images/hydrangea_alpha.png"
group: "propcanon"
---

```SuperCollider
// 1
(
~dur_total = 60;
~numparts = 10;
~lowest_8vb = -6;
)

// 2
(
SynthDef("saw", { arg freq = 440, amp = 0.1, dur = 1.0, blocknum = 0, partnum = 0, busnumstart = 32;
	var busnum = busnumstart+(blocknum*10)+partnum;
	var env = Env.pairs([[0,0],[0,1],[dur,1],[dur,0]],\lin).kr(2);
	var snd = Saw.ar(freq, env) * amp;
	snd = BLowPass.ar(snd,4000);
	Out.ar(busnum, snd);
}).add;
)

// 3
(
SynthDef("gain", { arg dur_total = 60.0, blocknum = 0, partnum = 0, busnumstart = 32, panpos = 0.0;
	var busnum = busnumstart+(blocknum*10)+partnum;
	var dur_wait = dur_total * 0.025 * partnum;
	var env = Env.pairs([[0,0],[dur_wait,0],[dur_total/2,1],[dur_total-dur_wait,0],[dur_total,0]],\lin).kr(2);
	var snd = In.ar(busnum) * env;
	Out.ar(0,Pan2.ar(snd,panpos));
}).add;
)

// 4
(
~f = { arg notenums = [], blocknum = 0;
	for (0,~numparts-1) { arg i;
		Pbind(
			\instrument, \saw,
			\freq, Pseq((notenums+(12*(i+~lowest_8vb))).midicps,i+1),
			\dur, ~dur_total/(i+1)/notenums.size,
			\blocknum, blocknum,
			\partnum, i
		).play;

		Synth("gain", [\dur_total, ~dur_total,
			\partnum, i,
			\blocknum, blocknum,
			\panpos, (200.rand-100)/100]
		);
	};
}
)

// 5
(
{
	"block 0 START".postln;
	~f.value([60, 62, 64, 65, 67, 69, 71],0);

	(~dur_total/3).wait;

	"block 1 START".postln;
	~f.value([64, 62, 60, 59, 57, 55, 53],1);

	(~dur_total/3).wait;

	"block 2 START".postln;
	~f.value([72, 71, 69, 67, 69, 72, 67],2);
}.fork;
)

// helpers
s.quit;

ServerOptions.devices.postln;  // Lists all available audio input and output devices
s.options.outDevice = "External Headphones";
s.options.outDevice = "MacBook Pro Speakers";
s.options.sampleRate = 44100;
s.options.sampleRate = 48000;
s.reboot;

// cmd-B start server
// cmd-. stop all sounds
// cmd-return execute command/function
```
