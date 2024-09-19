function playSynthBlock(melody, dur_synth_block, startTime) {
	const num_parts = 10;
	const synth_volume = -26; // dB
	const max_8vb = -6; // octaves
	const max_dur_note = dur_synth_block / melody.length; // seconds
	const silent_time_interval = dur_synth_block * 0.02 // seconds; 2%

	// Create modules
	const synths = Array.from({ length: num_parts }, () => new Tone.Synth({
		oscillator: { type: 'sawtooth' },
		envelope: { attack: 0, decay: 0, sustain: 1, release: 0 }
	}).set({ volume: synth_volume }));
	const filters = Array.from({ length: num_parts }, () => new Tone.Filter({
		type: 'lowpass',
		frequency: 4000,
		rolloff: -12
	}));
	const gains = Array.from({ length: num_parts }, () => new Tone.Gain(0).toDestination());

	// Connect synths to filters and gains
	synths.forEach((synth, i) => {
		synth.connect(filters[i]);
		filters[i].connect(gains[i]);
	});

	// Schedule notes
	function scheduleNotes(i_part, dur_note, currentTime) {
		const noteShift = (max_8vb + i_part) * 12;
		const repeat_count = i_part + 1;
		for (let r = 0; r < repeat_count; r++) {
			melody.forEach(noteNum => {
				const transposedNote = Tone.Frequency(noteNum + noteShift, "midi").toNote();
				synths[i_part].triggerAttackRelease(transposedNote, dur_note, currentTime);
				currentTime += Tone.Time(dur_note).toSeconds();
			});
		}
	}

	// Schedule fades
	function scheduleFades(i_part, t) {
		const silent_time = i_part * silent_time_interval;
		const fade_time = dur_synth_block / 2 - silent_time;
		const gain = gains[i_part];
		gain.gain.setValueAtTime(0, t); // Start at 0 gain
		t += silent_time;
		gain.gain.linearRampToValueAtTime(0, t); // Maintain silence
		t += fade_time;
		gain.gain.linearRampToValueAtTime(1, t); // Fade in
		t += fade_time;
		gain.gain.linearRampToValueAtTime(0, t); // Fade out
	}

	// Schedule the notes and automation to be played in sequence
	for (let i = 0; i < num_parts; i++) {
		scheduleNotes(i, max_dur_note / (i + 1), startTime);
		scheduleFades(i, startTime);
	}
}

function play() {
	const dur_synth_block = 60.0;
	startTime = Tone.now();
	melodies.forEach(melody => {
		playSynthBlock(melody, dur_synth_block, startTime);
		startTime += dur_synth_block / 3;
	});
}
