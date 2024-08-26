---
layout: post
title: "Mensuration Canon on a Phrase: SuperCollider Example"
date: 2024-08-26
image: "./assets/images/hydrangea_alpha.png"
group: "propcanon"
---

The following is still work-in-progress:

```SuperCollider
(
~originalPhrase = Pbind(
    \instrument, \default,
    \midinote, Pshuf([55, 59, 62, 67, 71, 74, 79, 83, 55, 60, 64, 67, 72, 76, 79], inf),  // MIDI notes shuffled for variation
    \dur, Pseq([0.5, 0.25, 0.75, 1.5, 0.5, 0.5, 1, 3], inf),  // Durations adding up to 8 seconds
    \legato, 1.2,  // Slight legato to smooth transitions
).play;
)

~originalPhrase.stop;

s.quit;
```
