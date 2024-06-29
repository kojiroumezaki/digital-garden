---
layout: post
title: "Mensuration Canon on a Phrase: Tone.js Example"
date: 2024-06-28
---

{% raw %}
<script src="https://unpkg.com/tone"></script>
<script>
	const melody = ["C4","D4","E4","F4","G4","A4","B4","C5"];
	function playParts() {

		const num_parts = 10;
		const max_8vb = -6; // octaves
		const max_dur_note = 60. / melody.length; // seconds
		const synth_volume = -20; // dB
                
		// create modules
		let synths = [];
		let filters = [];
		let gains = [];
		for (i = 0; i < num_parts; i++) {
			synth = new Tone.Synth({
				oscillator:{type:'sawtooth'},
				envelope:{attack:0,decay:0,sustain:1,release:0}
			});
			synth.volume.value = synth_volume;
			synths.push(synth);

			filter = new Tone.Filter({
				type:'lowpass',
				frequency:4000,
				rolloff:-12
			});
			filters.push(filter);

            gain = new Tone.Gain(0); // Initial gain value (0 for silence)
			gains.push(gain);

			synth.connect(filter);
			filter.connect(gain);
			gain.toDestination();
		}

		function scheduleNotes(i_part,dur_note,currentTime) {
			repeat_count = 0;
			do {
				melody.forEach(noteName => {
					// transpose the note
					let noteNum = Tone.Frequency(noteName).toMidi();
					noteNum += (max_8vb+i_part) * 12;
					noteName = Tone.Frequency(noteNum,"midi").toNote();
					
					synths[i_part].triggerAttackRelease(noteName, dur_note, currentTime);
					currentTime += Tone.Time(dur_note).toSeconds();
				});
			} while (++repeat_count < (i_part+1));
		}

		function scheduleFades(i_part,currentTime) {
			silent_time = i_part * 1.2;
			fade_time = 60.0 / 2 - silent_time;

			gain = gains[i_part];
			t = currentTime;
            gain.gain.setValueAtTime(0, t); // Start at 0 gain
            t += silent_time;
            gain.gain.linearRampToValueAtTime(0,t);
            t += fade_time;
            gain.gain.linearRampToValueAtTime(1,t);
            t += fade_time;
            gain.gain.linearRampToValueAtTime(0,t);
        }

		// schedule the notes and automation to be played in sequence
		const startTime = Tone.now();
		for (i = 0; i < num_parts; i++) {
			scheduleNotes(i,max_dur_note/(i+1),startTime);
			scheduleFades(i,startTime);
		}
	}
</script>
<button onclick="playParts()">Play Parts</button>
{% endraw %}
