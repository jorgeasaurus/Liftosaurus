import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const session = await event.locals.auth();
	if (!session) redirect(302, '/');
	const trpc = createCaller(await createContext(event));
	return { userExercises: await trpc.workouts.getUserExercises('minimal') };
};
