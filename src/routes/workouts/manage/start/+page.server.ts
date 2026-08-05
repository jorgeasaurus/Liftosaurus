import { createContext } from '$lib/trpc/context.js';
import { createCaller } from '$lib/trpc/router.js';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	event.depends('workouts:start');
	const trpc = createCaller(await createContext(event));

	const repeatSkipped = event.url.searchParams.get('repeatSkipped');
	if (repeatSkipped) {
		const splitDayIndex = Number(repeatSkipped);
		if (!Number.isFinite(splitDayIndex) || !Number.isInteger(splitDayIndex) || splitDayIndex < 0) {
			throw error(400, 'Invalid skipped workout day');
		}
		const workoutData = trpc.workouts.getSkippedWorkoutData(splitDayIndex);
		return { workoutData };
	}

	const workoutData = trpc.workouts.getTodaysWorkoutData();
	const skippedWorkouts = trpc.workouts.getSkippedWorkoutsOfCurrentCycle();
	return { workoutData, skippedWorkouts };
};
