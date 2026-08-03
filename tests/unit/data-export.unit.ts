import assert from 'node:assert/strict';
import test from 'node:test';
import { buildWorkoutSetsCsv, type WorkoutForCsv } from '../../src/lib/server/user-export.js';

const workout: WorkoutForCsv = {
	id: 'workout-owner',
	userBodyweight: 195,
	startedAt: new Date('2026-08-01T10:00:00.000Z'),
	endedAt: new Date('2026-08-01T11:00:00.000Z'),
	note: 'Good session,\nstrong finish',
	workoutOfMesocycle: {
		mesocycleId: 'mesocycle-owner',
		splitDayIndex: 2,
		workoutStatus: null
	},
	workoutExercises: [
		{
			id: 'exercise-owner',
			exerciseIndex: 0,
			name: '=HYPERLINK("https://attacker.invalid")',
			targetMuscleGroup: 'Chest',
			customMuscleGroup: null,
			bodyweightFraction: 0.5,
			setType: 'Myorep',
			note: 'Quoted "note"',
			sets: [
				{
					id: 'set-owner',
					setIndex: 0,
					reps: 10,
					load: 135,
					RIR: 2,
					skipped: false,
					miniSets: [
						{
							id: 'mini-set-owner',
							miniSetIndex: 0,
							reps: 4,
							load: 135,
							RIR: 0
						}
					]
				}
			]
		}
	]
};

test('exports one RFC-4180 row per regular and mini set while neutralizing formulas', () => {
	const csv = buildWorkoutSetsCsv([workout]);
	const lines = csv.split('\r\n');

	assert.equal(lines.length, 4);
	assert.match(lines[1], /"'=HYPERLINK\(""https:\/\/attacker\.invalid""\)"/);
	assert.match(lines[1], /"Good session,\nstrong finish"/);
	assert.match(lines[1], /"Quoted ""note"""/);
	assert.match(lines[1], /"regular","set-owner","",/);
	assert.match(lines[2], /"mini","mini-set-owner","set-owner",/);
	assert.match(lines[0], /"bodyweight_fraction"/);
	assert.match(lines[0], /"external_load_lb","effective_load_lb"/);
	assert.match(lines[1], /"10","135","232.5","2","false"/);
	assert.match(lines[2], /"4","135","232.5","0","false"/);
	assert.equal(lines[3], '');
});
