const num_blocks = 3;

const dur_block = 60.0;

const num_block_parts = 10;

const max_8vb = -6; // octaves

const synth_volume = -26; // dB (roughly 10% of full volume)

let synths_array = null;
let filters_array = null;
let gains_array = null;

function create_arrays(block_index)
{
	synths_array = new Array(num_blocks).fill(null);
	
	filters_array = new Array(num_blocks).fill(null);
	
	gains_array = new Array(num_blocks).fill(null);
}

function init_arrays(block_index)
{
	// synths
	synths_array[block_index] = Array.from({ length: num_block_parts }, () => new Tone.Synth({
		oscillator: { type: 'sawtooth' },
		envelope: { attack: 0, decay: 0, sustain: 1, release: 0 }
	}).set({ volume: synth_volume }));

	let melody = melodies[block_index];	

	const noteNamesArray = Array.from({ length: num_block_parts },
		(_, index) => melody.map(midi => Tone.Frequency(midi+((index+max_8vb)*12), "midi").toNote()));

	const dur_note = dur_block / melody.length; // seconds
	
	const start_time_offset = block_index / num_blocks * dur_block;

	const seqs = Array.from({ length: num_block_parts }, (_, index) => new Tone.Sequence((time, note) => {
		synths_array[block_index][index].triggerAttackRelease(note, dur_note/(index+1), time);
	}, noteNamesArray[index], dur_note/(index+1)).start(start_time_offset));
	
	seqs.forEach((seq, index) => { seq.loop = index + 1; }); // number of loop iterations

	// filters
	filters_array[block_index] = Array.from({ length: num_block_parts }, () => new Tone.Filter({
		type: 'lowpass',
		frequency: 4000,
		rolloff: -12
	}));

	// gains
	gains_array[block_index] = Array.from({ length: num_block_parts }, () => new Tone.Gain(1));

	// connect synths to filters to gains to output
	synths_array[block_index].forEach((synth, index) => {
		synth.connect(filters_array[block_index][index]);
		filters_array[block_index][index].connect(gains_array[block_index][index]);
		gains_array[block_index][index].toDestination();
	});
}

function init_gains_events(block_index, start_time)
{
	const start_time_offset = block_index / num_blocks * dur_block;

	gains_array[block_index].forEach((gain, index) => {
		// cancel existing ramps
		gain.gain.cancelScheduledValues(start_time);

		// add new ramps
		const silent_time_interval = dur_block * 0.02 // seconds; 2%
		const silent_time = index * silent_time_interval;
		const fade_time = dur_block / 2 - silent_time;
		let t = start_time + start_time_offset; // gain time events are based on Tone.now(), not transport
		gain.gain.setValueAtTime(0, t); // Start at 0 gain
		t += silent_time;
		gain.gain.linearRampToValueAtTime(0, t); // Maintain silence
		t += fade_time;
		gain.gain.linearRampToValueAtTime(1, t); // Fade in
		t += fade_time;
		gain.gain.linearRampToValueAtTime(0, t); // Fade out
	});
}

function play() {
	gains_array.forEach((gains, block_index) => {
		init_gains_events(block_index,Tone.now());
	});
	
	Tone.Transport.start();
}

function stop() {
	synths_array.forEach((synths, block_index) => {
		synths.forEach(synth => { synth.triggerRelease(); });
	});
	
	Tone.Transport.stop();
}

create_arrays();
synths_array.forEach((synths, block_index) => { init_arrays(block_index); });
