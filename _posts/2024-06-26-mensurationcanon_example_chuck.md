---
layout: post
title: "Mensuration Canon on a Phrase: Sonic Pi Example"
date: 2024-06-26
---

```chucK

// Define the original phrases as frequencies (in Hz)
[[ 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88 ],  // Synth Block 1: C4 to B4 in Hz
 [ 329.63, 293.66, 261.63, 246.94, 220.00, 196.00, 174.61 ],  // Synth Block 2: E4 to F3 in Hz
 [ 523.25, 493.88, 440.00, 392.00, 440.00, 523.25, 392.00 ]] @=> float original_phrases[][];  // Synth Block 3: C5, B4, A4, G4, A4, C5, G4 in Hz

// Define the number of parts
10 => int num_parts;

// Define the octave ranges for each part
-6 => int lowest_octave_shift;  // Transpose down by 6 octaves for the lowest part
3 => int highest_octave_shift;  // Transpose up by 3 octaves for the highest part

// Define durations for each part (60 seconds to 6.0 seconds)
[60.0, 30.0, 20.0, 15.0, 12.0, 10.0, 8.57, 7.5, 6.67, 6.0] @=> float durations[];

fun void calculate_octave_shifted_phrase(float original_phrase[], int octave_shift, float duration, float scaled_phrase[], float duration_factor) {
    duration / original_phrase.size() => duration_factor;
    for (0 => int i; i < original_phrase.size(); i++) {
        original_phrase[i] * Math.pow(2, octave_shift) => scaled_phrase[i];
    }
}

fun void gain_control(int part_index, SawOsc @saw, float amp_max) {
	// Calculate silent and fade times
	part_index * 1.2 => float silent_time;
	60.0 / 2.0 - silent_time => float fade_time;

	// Set initial volume to 0
	0.0 => saw.gain;
	
	// Wait for the silent time
	silent_time::second => now;

	// Calculate the gain increment per millisecond
	1.0 / (fade_time * 1000.0) => float gainIncrement;
	
	// Fade in over fade_time seconds
	for (0.0 => float gain; gain <= 1.0; gain+gainIncrement => gain) {
		gain * amp_max => saw.gain;
		1::ms => now;
	}
	
	// Fade out over fade_time seconds
	for (1.0 => float gain; gain >= 0.0; gain-gainIncrement => gain) {
		gain * amp_max => saw.gain;
		1::ms => now;
	}
};

// Function to play a part with a specific duration and amplitude
fun void play_part(int part_index, float original_phrase[], float duration, int num_parts) {
	
    // Calculate octave shift for this part
    lowest_octave_shift + part_index => int octave_shift;

    // Initialize the octave shifted phrase
    float scaled_phrase[original_phrase.size()];
    duration / original_phrase.size() => float duration_event;

    // Calculate the octave shifted phrase
    calculate_octave_shifted_phrase(original_phrase, octave_shift, duration, scaled_phrase, duration_event);

    // Create a sawtooth oscillator
    SawOsc saw;
    LPF lpf;
    saw => lpf => dac;
    4000.0 => lpf.freq;
    0.25 => lpf.Q;

    // Calculate max amplitude
    1.0 / num_parts => float amp_max;

    // Control the part's amplitude in its own thread
    spork ~ gain_control(part_index,saw,amp_max);

	// Play the events
    for (0 => int repeat_count; repeat_count < (part_index + 1); repeat_count++) {
        for (0 => int i_event; i_event < scaled_phrase.size(); i_event++) {
        	<<< scaled_phrase[i_event],duration_event >>>;
            scaled_phrase[i_event] => saw.freq;
            duration_event::second => now;
        }
    }
}

// Play each synth block in sequence with 20-second intervals
original_phrases.size() => int num_synth_blocks;
for (0 => int i_block; i_block < num_synth_blocks; i_block++) {

	<<< "synth_block_index ",i_block >>>;
	for (0 => int i_part; i_part < num_parts; i_part++)
		spork ~ play_part(i_part, original_phrases[i_block], durations[i_part], num_parts);

    // Sleep for 20 seconds between synth blocks, except after the last one
    if (i_block == num_synth_blocks-1)
    	60::second => now;
    else
        20::second => now;
}

```
