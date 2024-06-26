---
layout: post
title: "Mensuration Canon on a Phrase"
date: 2024-06-26
---

1. Create an 8-second phrase. Center it around G4. The phrase should roughly be in the G3-D5 range. Call it the original phrase.
2. Transpose the original phrase down by 6 octaves. Scale the duration of the phrase to 60/1 seconds (60 seconds). Play this phrase 1 time so that it is 60 seconds in duration. Call this a part.
3. Transpose the original phrase down by 5 octaves. Scale the duration of the phrase to 60/2 seconds (30 seconds). Play this phrase 2 times so that it is 60 seconds in duration. Call this another part.
4. Transpose the original phrase down by 4 octaves. Scale the duration of the phrase to 60/3 seconds (20 seconds). Play this phrase 3 times so that it is 60 seconds in duration. Call this another part.
5. ...and so on until you have a total of 10 parts, where the lowest part is 6 octaves below the original phrase and the highest part is 3 octaves above the original phrase.
6. To each part add a fade in and fade out.
7. The part in the lowest octave will start fading in at 0 seconds, reach full amplitude at 30 seconds, and end fading out at 60 seconds.
8. The part in the next octave above will start fading in at 1.2 seconds, reach full amplitude at 30 seconds, and end fading out at 28.8 seconds.
9. The part in the next octave above will start fading in at 2.4 seconds, reach full amplitude at 30 seconds, and end fading out at 27.6 seconds.
10. ...and so on until you have fade times for all 10 parts. The highest octave part will start fading in at 9 * 1.2 seconds, reach full amplitude at 30 seconds, and end at 60 seconds - 9 * 1.2 seconds.
11. Play all 10 parts concurrently. Call this a synth block.
12. For timbre, synthesize all parts with a sawtooth wave oscillator without any amplitude envelope. Each part will have its own dedicated oscillator.
13. Add a low pass filter to each oscillator. For all oscillators, a suggested cutoff frequency is 4kHz with a Q-factor of 0.25.
14. Create a total of 3 synth blocks. They should not necessarily be based on the same original phrase.
15. Play the synth blocks in sequence (one after another) at 20 second intervals. Looping the 3 synth blocks is a suggestion. Before each synth block plays again, change its original 8-second phrase.

Original 8-second phrases can be anything (e.g., MIDI notes), but continuous pitch tracking data on a solo instrument (e.g. shakuhachi) with roughly 10-20 data points per second is a possible suggestion.


An example in Sonic Pi (Ruby) is [here](/digital-garden{% post_url 2024-06-26-mensurationcanon_example_sonicpi %}).

In memory of Larry Polansky. June, 2024.
