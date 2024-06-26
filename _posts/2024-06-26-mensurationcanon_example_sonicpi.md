---
layout: post
title: "Mensuration Canon on a Phrase: Sonic Pi Example"
date: 2024-06-26
---

```ruby

# NOTE: Turn off Safe Audio Mode in the Audio menu if MIDI note numbers below 0 are being played

# Define the original phrases as MIDI note numbers
original_phrases = [
  [60, 62, 64, 65, 67, 69, 71],  # Synth Block 1: C4 to B4 in MIDI numbers
  [64, 62, 60, 59, 57, 55, 53],  # Synth Block 2: E4 to G3 in MIDI numbers
  [72, 71, 69, 67, 69, 72, 67]   # Synth Block 3: C5, B4, A4, G4, A4, C5, G4 in MIDI numbers
]

# Define the number of parts
num_parts = 10

# Define the octave ranges for each part
lowest_octave_shift = -6  # Transpose down by 6 octaves for the lowest part
highest_octave_shift = 3  # Transpose up by 3 octaves for the highest part

# Define durations for each part (60 seconds to 6.0 seconds)
durations = (1..num_parts).map { |i| 60.0 / i }

# Helper function to calculate the scaled phrase
define :calculate_scaled_phrase do |original_phrase_midi, octave_shift, duration|
  # Transpose the original phrase by the calculated octave shift
  transposed_phrase_midi = original_phrase_midi.map { |note| note + (octave_shift * 12) }  # Transpose by octaves (12 semitones)
  
  # Create the scaled phrase for the specified duration
  duration_factor = duration / original_phrase_midi.length
  scaled_phrase = transposed_phrase_midi.each_with_index.map do |note, index|
    [note, index * duration_factor]
  end
  return scaled_phrase, duration_factor
end

# Function to play a part with a specific duration and amplitude
define :play_part do |part_index, original_phrase_midi, duration, num_parts|
  # Calculate octave shift for this part
  octave_shift = lowest_octave_shift + part_index
  
  # Calculate the scaled phrase
  scaled_phrase, duration_factor = calculate_scaled_phrase(original_phrase_midi, octave_shift, duration)
  
  # Play the scaled phrase in its own thread
  in_thread do
    with_fx :level, amp: 0.0 do |fx|
      in_thread do
        silent_time = part_index * 1.2
        fade_time = 60.0 / 2 - silent_time
        sleep silent_time
        control fx, amp: 1.0, amp_slide: fade_time
        sleep fade_time
        control fx, amp: 0.0, amp_slide: fade_time
      end
      
      (part_index+1).times do
        scaled_phrase.each do |note, start_time|
          synth :saw, note: note, sustain: duration_factor, amp: 1.0 / num_parts, attack: 0, release: 0, cutoff: 80 # not exactly sure what frequency 80 corresponds to
          sleep duration_factor
        end
      end
    end
  end
end

# Play each synth block in sequence with 20-second intervals
original_phrases.each_with_index do |original_phrase, synth_block_index|
  in_thread do
    num_parts.times do |part_index|
      play_part(part_index, original_phrase, durations[part_index], num_parts)
    end
  end
  sleep 20 if synth_block_index < original_phrases.length - 1
end

```
