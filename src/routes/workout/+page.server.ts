import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';

export const load = async (event) => {
	event.depends('workouts:current');
	const trpc = createCaller(await createContext(event));

	return { workoutData: trpc.workouts.getTodaysWorkoutData() };
};
