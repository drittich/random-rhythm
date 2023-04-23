import './style.css'
// import vex
import Vex from 'vexflow'

const canvas = document.getElementById('notation') as HTMLCanvasElement;

generateRandomRhythm(canvas);

function generateRandomRhythm(canvas: HTMLCanvasElement) {
	const renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
	const ctx = renderer.getContext();
	const stave = new Vex.Flow.Stave(10, 0, 800);

	stave.addClef('treble');
	stave.setContext(ctx).draw();

	const noteDurations: string[] = ['w', 'h', 'q', '8', '16'];
	const durationValues: { [key: string]: number } = { w: 4, h: 2, q: 1, '8': 0.5, '16': 0.25 };
	const numBeats = 4;
	let remainingBeats = numBeats;
	const notes: any = [];
	const beams: any = [];

	while (remainingBeats > 0) {
		const duration: string = noteDurations[Math.floor(Math.random() * noteDurations.length)];

		if (durationValues[duration] <= remainingBeats) {
			const note = new Vex.Flow.StaveNote({
				keys: ['c/4'],
				duration: duration,
			});
			notes.push(note);
			remainingBeats -= durationValues[duration];
		}
	}

	// Create beams for consecutive 16th and 8th notes
	for (let i = 0; i < notes.length - 1; i++) {
		if ((notes[i].duration === '16' && notes[i + 1].duration === '16') || (notes[i].duration === '8' && notes[i + 1].duration === '8')) {
			const beam = new Vex.Flow.Beam([notes[i], notes[i + 1]]);
			beams.push(beam);
		}
	}

	const voice = new Vex.Flow.Voice({ num_beats: numBeats, beat_value: 4 });
	voice.addTickables(notes);

	const formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 800);
	voice.draw(ctx, stave);

	// Draw beams
	beams.forEach((beam: any) => beam.setContext(ctx).draw());
}
