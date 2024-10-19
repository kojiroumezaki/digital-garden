const num_blocks = 3;

const dur_block = 60.0;

const num_block_parts = 10;

const max_8vb = -6; // octaves

const synth_volume = -26; // dB (roughly 10% of full volume)

let synths_array = null;
let filters_array = null;
let gains_array = null;

function create_arrays()
{
	synths_array = new Array(num_blocks).fill(null);
	filters_array = new Array(num_blocks).fill(null);
	gains_array = new Array(num_blocks).fill(null);
}

function create_block(block_index)
{
	let melody = melodies[block_index];

	let start_time = block_index / num_blocks * dur_block;
	
	synths_array[block_index] = Array.from({ length: num_block_parts }, () => new Tone.Synth({
		oscillator: { type: 'sawtooth' },
		envelope: { attack: 0, decay: 0, sustain: 1, release: 0 }
	}).set({ volume: synth_volume }));
	
	filters_array[block_index] = Array.from({ length: num_block_parts }, () => new Tone.Filter({
		type: 'lowpass',
		frequency: 4000,
		rolloff: -12
	}));
	
	gains_array[block_index] = Array.from({ length: num_block_parts }, () => new Tone.Gain(1).toDestination());
	gains_array[block_index].forEach((gain, index) => {
		const silent_time_interval = dur_block * 0.02 // seconds; 2%
		const silent_time = index * silent_time_interval;
		const fade_time = dur_block / 2 - silent_time;
		let t = start_time;
		gain.gain.setValueAtTime(0, t); // Start at 0 gain
		t += silent_time;
		gain.gain.linearRampToValueAtTime(0, t); // Maintain silence
		t += fade_time;
		gain.gain.linearRampToValueAtTime(1, t); // Fade in
		t += fade_time;
		gain.gain.linearRampToValueAtTime(0, t); // Fade out
	});
	
	// Connect synths to filters and gains
	synths_array[block_index].forEach((synth, index) => {
		synth.connect(filters_array[block_index][index]);
		filters_array[block_index][index].connect(gains_array[block_index][index]);
		gains_array[block_index][index].toDestination();
	});
	
	const max_dur_note = dur_block / melody.length; // seconds
	
	const noteNamesArray = Array.from({ length: num_block_parts },
		(_, index) => melody.map(midi => Tone.Frequency(midi+((index+max_8vb)*12), "midi").toNote()));
	
	const dur = max_dur_note;
	
	const seqs = Array.from({ length: num_block_parts }, (_, index) => new Tone.Sequence((time, note) => {
		synths_array[block_index][index].triggerAttackRelease(note, dur/(index+1), time);
	}, noteNamesArray[index], dur/(index+1)).start(start_time));
	
	seqs.forEach((seq, index) => { seq.loop = index + 1; });
}

function play() {
	console.log("play() called");

	create_arrays();
	synths_array.forEach((synths, block_index) => {
		create_block(block_index);
	});
	
	Tone.Transport.start();
}

function stop() {
	console.log("stop() called");

	synths_array.forEach((synths, block_index) => {
		synths.forEach(synth => { synth.triggerRelease(); });
	});
	
	Tone.Transport.stop();
}
