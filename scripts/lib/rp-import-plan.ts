const TIME_ZONE = 'America/Los_Angeles';
const KILOGRAMS_TO_POUNDS = 2.2046226218487757;

const MUSCLE_GROUPS = {
	1: 'Chest',
	2: 'Lats',
	3: 'Triceps',
	4: 'Biceps',
	5: 'SideDelts',
	6: 'Quads',
	7: 'Glutes',
	8: 'Hamstrings',
	9: 'Calves',
	10: 'Traps',
	11: 'Forearms',
	12: 'Abs'
} as const;

type MuscleGroup = (typeof MUSCLE_GROUPS)[keyof typeof MUSCLE_GROUPS];

type RpSet = {
	id: number;
	position: number;
	weight?: number | null;
	reps?: number | null;
	repsTarget?: number | null;
	bodyweight?: number | null;
	unit?: string | null;
	finishedAt?: string | null;
	status?: string | null;
};

type RpDayExercise = {
	id: number;
	exerciseId: number;
	position: number;
	muscleGroupId?: number | null;
	sets?: RpSet[];
};

type RpDay = {
	id: number;
	week: number;
	position: number;
	label?: string | null;
	status?: string | null;
	createdAt?: string | null;
	finishedAt?: string | null;
	bodyweight?: number | null;
	unit?: string | null;
	exercises?: RpDayExercise[];
};

type RpMesocycle = {
	id: number;
	key: string;
	name?: string | null;
	microRirs?: number | string | null;
	unit?: string | null;
	weeks?: Array<{ days?: RpDay[] }>;
};

type RpExercise = {
	id: number;
	name: string;
	muscleGroupId?: number | null;
	exerciseType?: string | null;
};

export type RpBootstrap = {
	currentMesocycle?: RpMesocycle | null;
	exercises?: RpExercise[];
};

export type ImportSetPlan = {
	setIndex: number;
	reps: number;
	load: number;
	RIR: number;
	skipped: false;
};

export type ImportExercisePlan = {
	exerciseIndex: number;
	name: string;
	targetMuscleGroup: MuscleGroup;
	bodyweightFraction: number | null;
	setType: 'Straight';
	repRangeStart: number;
	repRangeEnd: number;
	sets: ImportSetPlan[];
};

export type ImportWorkoutPlan = {
	sourceDayId: number;
	week: number;
	splitDayIndex: number;
	status: string;
	userBodyweight: number;
	startedAt: Date;
	endedAt: Date;
	note: string;
	exercises: ImportExercisePlan[];
};

export type ImportTemplatePlan = Omit<ImportExercisePlan, 'sets'> & { sets: number };

export type RpImportPlan = {
	sourceMesocycleId: number;
	sourceMesocycleKey: string;
	name: string;
	startDate: Date;
	endDate: null;
	RIRProgression: number[];
	splitDays: Array<{
		name: string;
		dayIndex: number;
		isRestDay: false;
		exercises: ImportTemplatePlan[];
	}>;
	workouts: ImportWorkoutPlan[];
	counts: { workouts: number; exercises: number; sets: number };
};

export function buildRpImportPlan(
	bootstrap: RpBootstrap,
	options: { mesocycleKey: string; from: string; through: string }
): RpImportPlan {
	validateDate(options.from, '--from');
	validateDate(options.through, '--through');
	if (options.from > options.through) throw new Error('--from must not be after --through.');

	const mesocycle = bootstrap.currentMesocycle;
	if (!mesocycle || mesocycle.key !== options.mesocycleKey) {
		throw new Error(`Expanded currentMesocycle ${options.mesocycleKey} was not found in the source JSON.`);
	}
	if (!Array.isArray(mesocycle.weeks)) throw new Error('currentMesocycle.weeks must be an expanded array.');

	const exerciseCatalog = new Map((bootstrap.exercises ?? []).map((exercise) => [exercise.id, exercise]));
	const allDays = mesocycle.weeks.flatMap((week) => week.days ?? []);
	const selectedDays = allDays
		.filter((day) => {
			if (!day.finishedAt) return false;
			const localDate = dateInTimeZone(day.finishedAt);
			return localDate >= options.from && localDate <= options.through;
		})
		.sort((left, right) => dateValue(left.finishedAt) - dateValue(right.finishedAt));

	if (selectedDays.length === 0) throw new Error('No finished RP workouts matched the requested date range.');

	const knownBodyweights = selectedDays
		.filter((day) => isFiniteNumber(day.bodyweight) && Number(day.bodyweight) > 0)
		.map((day) => ({
			at: dateValue(day.finishedAt),
			value: toPounds(Number(day.bodyweight), sourceUnit(day.unit ?? mesocycle.unit))
		}));
	if (knownBodyweights.length === 0) throw new Error('No usable bodyweight was present in the selected RP workouts.');

	const workouts = selectedDays.map((day) =>
		buildWorkout(day, mesocycle, exerciseCatalog, nearestBodyweight(day, knownBodyweights))
	);
	const splitDayCount = Math.max(...allDays.map((day) => day.position)) + 1;
	const currentWeek = Math.max(...selectedDays.map((day) => day.week));
	const continuationDays = mesocycle.weeks[currentWeek]?.days ?? [];
	const splitDays = Array.from({ length: splitDayCount }, (_, dayIndex) => {
		const latestFinished = selectedDays.filter((day) => day.position === dayIndex).at(-1);
		const representative = continuationDays.find((day) => day.position === dayIndex) ?? latestFinished;
		if (!representative) throw new Error(`No imported workout exists for split day ${dayIndex + 1}.`);
		const fallbackWorkout = workouts.find((candidate) => candidate.sourceDayId === latestFinished?.id);
		return {
			name: representative.label || `Day ${dayIndex + 1}`,
			dayIndex,
			isRestDay: false as const,
			exercises: buildTemplateExercises(representative, exerciseCatalog, fallbackWorkout)
		};
	});

	const rirValues = mesocycle.weeks
		.map((_, weekIndex) => targetRir(mesocycle.microRirs, weekIndex + 1))
		.reduce<number[]>((values, rir) => {
			values.push(values.length === 0 ? rir : Math.min(rir, values.at(-1)!));
			return values;
		}, []);
	const maxRir = Math.max(...rirValues);
	const RIRProgression = Array.from(
		{ length: maxRir + 1 },
		(_, rir) => rirValues.filter((value) => value === rir).length
	);

	return {
		sourceMesocycleId: mesocycle.id,
		sourceMesocycleKey: mesocycle.key,
		name: mesocycle.name || `RP Mesocycle ${mesocycle.id}`,
		startDate: startOfDateInLosAngeles(options.from),
		endDate: null,
		RIRProgression,
		splitDays,
		workouts,
		counts: {
			workouts: workouts.length,
			exercises: workouts.reduce((sum, workout) => sum + workout.exercises.length, 0),
			sets: workouts.reduce(
				(sum, workout) => sum + workout.exercises.reduce((inner, exercise) => inner + exercise.sets.length, 0),
				0
			)
		}
	};
}

function buildTemplateExercises(
	day: RpDay,
	exerciseCatalog: Map<number, RpExercise>,
	fallbackWorkout: ImportWorkoutPlan | undefined
): ImportTemplatePlan[] {
	return (day.exercises ?? [])
		.map((dayExercise) => {
			const source = exerciseCatalog.get(dayExercise.exerciseId);
			if (!source) throw new Error(`RP exercise ${dayExercise.exerciseId} is missing from the exercise catalog.`);
			const fallback = fallbackWorkout?.exercises.find((exercise) => exercise.exerciseIndex === dayExercise.position);
			const plannedSets = dayExercise.sets ?? [];
			const targetReps = plannedSets
				.map((set) => Number(set.repsTarget ?? set.reps))
				.filter((reps) => Number.isFinite(reps) && reps > 0)
				.map(Math.round);
			const sets = plannedSets.length || fallback?.sets.length;
			if (!sets) throw new Error(`RP day ${day.id} exercise ${source.name} has no planned set count.`);
			if (targetReps.length === 0 && !fallback) {
				throw new Error(`RP day ${day.id} exercise ${source.name} has no planned rep targets.`);
			}

			return {
				exerciseIndex: dayExercise.position,
				name: source.name,
				targetMuscleGroup: targetMuscleGroup(dayExercise, source),
				bodyweightFraction: source.exerciseType?.startsWith('bodyweight') ? 1 : null,
				setType: 'Straight' as const,
				repRangeStart: targetReps.length ? Math.min(...targetReps) : fallback!.repRangeStart,
				repRangeEnd: targetReps.length ? Math.max(...targetReps) : fallback!.repRangeEnd,
				sets
			};
		})
		.sort((left, right) => left.exerciseIndex - right.exerciseIndex);
}

function buildWorkout(
	day: RpDay,
	mesocycle: RpMesocycle,
	exerciseCatalog: Map<number, RpExercise>,
	bodyweight: number
): ImportWorkoutPlan {
	const week = Number(day.week) + 1;
	const exercises = (day.exercises ?? [])
		.map((dayExercise) => buildExercise(day, dayExercise, week, mesocycle, exerciseCatalog, bodyweight))
		.filter((exercise): exercise is ImportExercisePlan => exercise !== null)
		.sort((left, right) => left.exerciseIndex - right.exerciseIndex);
	if (exercises.length === 0) throw new Error(`RP day ${day.id} is finished but has no completed sets.`);

	const setTimes = (day.exercises ?? [])
		.flatMap((exercise) => exercise.sets ?? [])
		.map((set) => set.finishedAt)
		.filter((value): value is string => Boolean(value))
		.map((value) => new Date(value))
		.filter((value) => !Number.isNaN(value.valueOf()));
	const endedAt = validDate(day.finishedAt, `RP day ${day.id} finishedAt`);
	const startedAt = setTimes.length
		? new Date(Math.min(...setTimes.map((date) => date.valueOf())))
		: validDate(day.createdAt, `RP day ${day.id} createdAt`);

	return {
		sourceDayId: day.id,
		week,
		splitDayIndex: day.position,
		status: day.status || 'complete',
		userBodyweight: bodyweight,
		startedAt,
		endedAt,
		note: `Imported from RP Hypertrophy (${mesocycle.key}, W${week}D${day.position + 1}, ${day.status || 'complete'}).`,
		exercises
	};
}

function buildExercise(
	day: RpDay,
	dayExercise: RpDayExercise,
	week: number,
	mesocycle: RpMesocycle,
	exerciseCatalog: Map<number, RpExercise>,
	bodyweight: number
): ImportExercisePlan | null {
	const source = exerciseCatalog.get(dayExercise.exerciseId);
	if (!source) throw new Error(`RP exercise ${dayExercise.exerciseId} is missing from the exercise catalog.`);
	const completedSets = (dayExercise.sets ?? [])
		.filter((set) => (set.status === 'complete' || Boolean(set.finishedAt)) && Number(set.reps) > 0)
		.sort((left, right) => left.position - right.position);
	if (completedSets.length === 0) return null;

	const bodyweightFraction = source.exerciseType?.startsWith('bodyweight') ? 1 : null;
	const reps = completedSets.map((set) => Math.round(Number(set.reps)));

	return {
		exerciseIndex: dayExercise.position,
		name: source.name,
		targetMuscleGroup: targetMuscleGroup(dayExercise, source),
		bodyweightFraction,
		setType: 'Straight',
		repRangeStart: Math.min(...reps),
		repRangeEnd: Math.max(...reps),
		sets: completedSets.map((set, setIndex) => ({
			setIndex,
			reps: Math.round(Number(set.reps)),
			load: externalLoad(set, day, source, bodyweight, mesocycle.unit),
			RIR: targetRir(mesocycle.microRirs, week),
			skipped: false
		}))
	};
}

function targetMuscleGroup(dayExercise: RpDayExercise, source: RpExercise): MuscleGroup {
	const muscleId = Number(dayExercise.muscleGroupId ?? source.muscleGroupId);
	const muscleGroup = MUSCLE_GROUPS[muscleId as keyof typeof MUSCLE_GROUPS];
	if (!muscleGroup) throw new Error(`Unsupported RP muscle group ${muscleId} for ${source.name}.`);
	return muscleGroup;
}

function externalLoad(
	set: RpSet,
	day: RpDay,
	exercise: RpExercise,
	fallbackBodyweight: number,
	mesocycleUnit: string | null | undefined
): number {
	const unit = sourceUnit(set.unit ?? day.unit ?? mesocycleUnit);
	const load = toPounds(isFiniteNumber(set.weight) ? Number(set.weight) : 0, unit);
	if (exercise.exerciseType === 'bodyweight-only') return 0;
	if (exercise.exerciseType !== 'bodyweight-loadable') return load;
	const bodyweight = isFiniteNumber(set.bodyweight)
		? toPounds(Number(set.bodyweight), unit)
		: isFiniteNumber(day.bodyweight)
			? toPounds(Number(day.bodyweight), sourceUnit(day.unit ?? mesocycleUnit))
			: fallbackBodyweight;
	return Math.max(0, load - bodyweight);
}

function nearestBodyweight(day: RpDay, values: Array<{ at: number; value: number }>): number {
	const at = dateValue(day.finishedAt);
	return values.reduce((nearest, candidate) =>
		Math.abs(candidate.at - at) < Math.abs(nearest.at - at) ? candidate : nearest
	).value;
}

function targetRir(value: number | string | null | undefined, week: number): number {
	const digit = Number(String(value ?? '')[week - 1]);
	return Number.isFinite(digit) ? Math.max(0, digit) : Math.max(0, 5 - week);
}

function dateInTimeZone(value: string): string {
	const date = validDate(value, 'timestamp');
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: TIME_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(date);
	const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
	return `${get('year')}-${get('month')}-${get('day')}`;
}

export function startOfDateInLosAngeles(value: string): Date {
	validateDate(value, 'date');
	const [year, month, day] = value.split('-').map(Number);
	const utcMidnight = Date.UTC(year, month - 1, day);
	let instant = utcMidnight;
	for (let attempt = 0; attempt < 2; attempt += 1) {
		instant = utcMidnight - timeZoneOffset(new Date(instant));
	}
	return new Date(instant);
}

function timeZoneOffset(date: Date): number {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: TIME_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23'
	}).formatToParts(date);
	const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
	return (
		Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')) - date.valueOf()
	);
}

function sourceUnit(value: string | null | undefined): 'lb' | 'kg' {
	if (value === 'lb' || value === 'lbs') return 'lb';
	if (value === 'kg') return 'kg';
	throw new Error(`Unsupported or missing RP weight unit: ${String(value)}.`);
}

function toPounds(value: number, unit: 'lb' | 'kg'): number {
	return unit === 'kg' ? value * KILOGRAMS_TO_POUNDS : value;
}

function validateDate(value: string, flag: string): void {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(new Date(`${value}T00:00:00Z`).valueOf())) {
		throw new Error(`${flag} must use YYYY-MM-DD.`);
	}
}

function validDate(value: string | null | undefined, label: string): Date {
	const date = new Date(value ?? '');
	if (Number.isNaN(date.valueOf())) throw new Error(`${label} is missing or invalid.`);
	return date;
}

function dateValue(value: string | null | undefined): number {
	return validDate(value, 'timestamp').valueOf();
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}
