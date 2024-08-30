---
layout: post
title: "Proportional Canon on a Phrase: SuperCollider Example"
date: 2024-08-26
image: "./assets/images/hydrangea_alpha.png"
group: "propcanon"
---

The following is still work-in-progress:

```SuperCollider
~dur_total = 60;

(
SynthDef("saw", { arg freq = 440, amp = 0.1, dur = 1.0, partnum = 0, busnumstart = 100;
	var env = Env.pairs([[0,0],[0,1],[dur,1],[dur,0]],\lin).kr(2);
	var snd = Saw.ar(freq, env) * amp;
	Out.ar(busnumstart+partnum, snd);
}).add;
)

(
SynthDef("gain", { arg partnum = 0, dur_total = 60, busnumstart = 100;
	var dur_wait = dur_total * 0.025 * partnum;
	var env = Env.pairs([[0,0],[dur_wait,0],[dur_total/2,1],[dur_total-dur_wait,0],[dur_total,0]],\lin).kr(2);
	var snd = In.ar(busnumstart+partnum) * env;
	Out.ar(partnum%2,snd); // alternate left and right for now
}).add;
)

// the following implements one synth block only; expand this to three
(
var numparts = 10;
var lowest_8vb = -6;
var notenums = [60,62,64,65,64,67,65,71,64];

for (0,numparts-1) { arg i;
	Pbind(
		\instrument, \saw,
		\freq, Pseq((notenums+(12*(i+lowest_8vb))).midicps,i+1),
		\dur, ~dur_total/(i+1)/notenums.size,
		\partnum, i
	).play;

	Synth("gain", [\partnum, i]);
};
)

s.quit;
s.reboot;

// cmd-B start server
// cmd-. stop all sounds
// cmd-return execute command/function
```
