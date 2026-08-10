import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	event.depends('workouts:all');
	const session = await event.locals.auth();

	if (!session) redirect(302, '/');

	const trpc = createCaller(await createContext(event));

	return {
		todaysWorkoutData: trpc.workouts.getTodaysWorkoutData(),
		dashboardChartData: trpc.workouts.getDashboardChartData(),
		entityCounts: trpc.users.getEntityCounts()
	};
};
