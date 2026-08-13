export const mobileSections = [
	{ id: 'workout', label: 'Workout', href: '/workout', paths: ['/workout', '/workouts/manage'] },
	{ id: 'history', label: 'History', href: '/workouts', paths: ['/workouts'] },
	{ id: 'plans', label: 'Plans', href: '/plans', paths: ['/plans', '/mesocycles', '/exercise-splits'] },
	{ id: 'exercises', label: 'Exercises', href: '/exercises', paths: ['/exercises', '/exercise-stats'] },
	{
		id: 'more',
		label: 'More',
		href: '/more',
		paths: [
			'/more',
			'/profile',
			'/settings',
			'/docs',
			'/changelog',
			'/donations',
			'/privacy-policy',
			'/terms-of-service'
		]
	}
] as const;

export type MobileSectionId = (typeof mobileSections)[number]['id'];

function isWithin(pathname: string, route: string) {
	return pathname === route || pathname.startsWith(`${route}/`);
}

export function isWorkoutManagementPath(pathname: string) {
	return isWithin(pathname, '/workouts/manage');
}

export function getMobileSection(pathname: string): MobileSectionId | undefined {
	return mobileSections.find((section) => section.paths.some((route) => isWithin(pathname, route)))?.id;
}
