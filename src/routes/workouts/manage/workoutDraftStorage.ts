import type { RouterOutputs } from '$lib/trpc/router';
import type { WorkoutExerciseInProgress } from '$lib/utils/workoutUtils';
import type { Prisma } from '@prisma/client';
import {
	MesocycleSchema,
	MuscleGroupSchema,
	WorkoutExerciseMiniSetSchema,
	WorkoutExerciseSchema,
	WorkoutExerciseSetSchema,
	WorkoutStatusSchema
} from '$lib/zodSchemas';
import { z } from 'zod';

export const WORKOUT_DRAFT_STORAGE_KEY = 'workoutRunes';
export const WORKOUT_DRAFT_STORAGE_VERSION = 2 as const;
export const WORKOUT_DRAFT_RECORD_VERSION = 1 as const;
export const WORKOUT_DRAFT_LOCK_PREFIX = 'liftosaurus:workout-draft:';

export type WorkoutDraftStorageKeys = {
	legacy: string;
	active: string;
	edit: string;
	mode: string;
};

export function workoutDraftStorageKeys(userId: string): WorkoutDraftStorageKeys {
	const namespace = `${WORKOUT_DRAFT_STORAGE_KEY}:user:${encodeURIComponent(userId)}`;
	return {
		legacy: namespace,
		active: `${namespace}:active`,
		edit: `${namespace}:edit`,
		mode: `${namespace}:mode`
	};
}

export type WorkoutData = RouterOutputs['workouts']['getTodaysWorkoutData'];
export type PreviousWorkoutData = NonNullable<
	RouterOutputs['workouts']['getWorkoutExercisesWithPreviousData']['previousWorkoutData']
>;

export type WorkoutDraft = {
	workoutData: WorkoutData;
	workoutExercises: WorkoutExerciseInProgress[] | null;
	previousWorkoutData: PreviousWorkoutData | null;
};

export type WorkoutEditDraft = {
	workoutId: string;
	workoutData: WorkoutData;
	workoutExercises: WorkoutExerciseInProgress[];
};

type WorkoutForEditDraft = {
	id: string;
	startedAt: Date;
	endedAt: Date;
	userBodyweight: number;
	note: string | null;
	workoutExercises: Prisma.WorkoutExerciseGetPayload<{
		include: { sets: { include: { miniSets: true } } };
	}>[];
};

export type WorkoutDraftStorage = {
	version: typeof WORKOUT_DRAFT_STORAGE_VERSION;
	mode: 'active' | 'edit';
	activeDraft: WorkoutDraft | null;
	editDraft: WorkoutEditDraft | null;
};

export type WorkoutDraftParseResult = {
	status: 'empty' | 'valid' | 'migrated' | 'unsupported' | 'corrupt';
	storage: WorkoutDraftStorage;
};

type DraftRecordStatus = 'empty' | 'valid' | 'unsupported' | 'corrupt';

export type WorkoutDraftRecord<T> = {
	raw: string | null;
	status: DraftRecordStatus;
	draft: T | null;
	ownsRaw: boolean;
};

export type WorkoutDraftRecords = {
	active: WorkoutDraftRecord<WorkoutDraft>;
	edit: WorkoutDraftRecord<WorkoutEditDraft>;
};

export type WorkoutDraftLoadResult = WorkoutDraftParseResult & {
	records: WorkoutDraftRecords;
	legacyRaw?: string;
};

export type WorkoutDraftLockManager = {
	request<T>(name: string, callback: () => T | PromiseLike<T>): Promise<T>;
};

export function createWorkoutEditDraft(workout: WorkoutForEditDraft): WorkoutEditDraft {
	return {
		workoutId: workout.id,
		workoutData: {
			startedAt: workout.startedAt,
			endedAt: workout.endedAt,
			userBodyweight: workout.userBodyweight,
			workoutExercises: [],
			note: workout.note,
			isLastWorkout: false
		},
		workoutExercises: workout.workoutExercises.map((exercise) => {
			const { id, workoutId, exerciseIndex, ...exerciseData } = exercise;
			return {
				...exerciseData,
				sets: exercise.sets.map((set) => {
					const { id, workoutExerciseId, setIndex, ...setData } = set;
					return {
						...setData,
						completed: true,
						miniSets: set.miniSets.map((miniSet) => {
							const { id, workoutExerciseSetId, miniSetIndex, ...miniSetData } = miniSet;
							return { ...miniSetData, completed: true };
						})
					};
				})
			};
		})
	};
}

type StorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export class WorkoutDraftPersistenceUnavailableError extends Error {
	constructor() {
		super('Workout draft persistence requires browser Web Locks support');
		this.name = 'WorkoutDraftPersistenceUnavailableError';
	}
}

function browserLockManager(): WorkoutDraftLockManager | undefined {
	return typeof navigator !== 'undefined' && navigator.locks ? (navigator.locks as WorkoutDraftLockManager) : undefined;
}

export function workoutDraftPersistenceAvailable() {
	return browserLockManager() !== undefined;
}

export function workoutDraftLockName(key: string) {
	return `${WORKOUT_DRAFT_LOCK_PREFIX}${key}`;
}

async function withWorkoutDraftLock<T>(
	key: string,
	callback: () => T,
	lockManager: WorkoutDraftLockManager | null | undefined = browserLockManager()
): Promise<T> {
	if (!lockManager) throw new WorkoutDraftPersistenceUnavailableError();
	return lockManager.request(workoutDraftLockName(key), callback);
}

async function withWorkoutDraftLocks<T>(
	keys: string[],
	callback: () => T,
	lockManager: WorkoutDraftLockManager
): Promise<T> {
	const sortedKeys = Array.from(new Set(keys)).sort();
	const acquire = (index: number): Promise<T> =>
		index === sortedKeys.length
			? Promise.resolve(callback())
			: lockManager.request(workoutDraftLockName(sortedKeys[index]), () => acquire(index + 1));
	return acquire(0);
}

type InProgressSet = WorkoutExerciseInProgress['sets'][number];
type InProgressMiniSet = InProgressSet['miniSets'][number];

const optionalNumber = z.number().optional();
const inProgressMiniSetSchema: z.ZodType<InProgressMiniSet, z.ZodTypeDef, unknown> = WorkoutExerciseMiniSetSchema.omit({
	id: true,
	miniSetIndex: true,
	workoutExerciseSetId: true
})
	.extend({
		reps: optionalNumber,
		load: optionalNumber,
		RIR: optionalNumber,
		completed: z.boolean()
	})
	.strict()
	.transform(
		(miniSet): InProgressMiniSet => ({
			...miniSet,
			reps: miniSet.reps,
			load: miniSet.load,
			RIR: miniSet.RIR
		})
	);

const inProgressSetSchema: z.ZodType<InProgressSet, z.ZodTypeDef, unknown> = WorkoutExerciseSetSchema.omit({
	id: true,
	setIndex: true,
	workoutExerciseId: true
})
	.extend({
		reps: optionalNumber,
		load: optionalNumber,
		RIR: optionalNumber,
		completed: z.boolean(),
		miniSets: z.array(inProgressMiniSetSchema)
	})
	.strict()
	.transform(
		(set): InProgressSet => ({
			...set,
			reps: set.reps,
			load: set.load,
			RIR: set.RIR
		})
	);

const inProgressExerciseSchema: z.ZodType<WorkoutExerciseInProgress, z.ZodTypeDef, unknown> =
	WorkoutExerciseSchema.omit({
		id: true,
		exerciseIndex: true,
		workoutId: true
	})
		.partial({
			customMuscleGroup: true,
			bodyweightFraction: true,
			changeType: true,
			changeAmount: true,
			note: true,
			overloadPercentage: true,
			lastSetToFailure: true,
			forceRIRMatching: true,
			minimumWeightChange: true,
			topRepRangeStart: true,
			topRepRangeEnd: true
		})
		.extend({
			sets: z.array(inProgressSetSchema)
		})
		.strict();

const workoutDataSchema: z.ZodType<WorkoutData> = z
	.object({
		startedAt: z.date(),
		endedAt: z.date().nullable(),
		userBodyweight: z.number().nullable(),
		workoutExercises: z.array(
			z
				.object({
					name: z.string(),
					targetMuscleGroup: MuscleGroupSchema,
					customMuscleGroup: z.string().nullable()
				})
				.strict()
		),
		workoutOfMesocycle: z
			.object({
				workoutStatus: WorkoutStatusSchema.nullable(),
				splitDayIndex: z.number().int(),
				mesocycle: MesocycleSchema.strict(),
				cycleNumber: z.number().int(),
				splitDayName: z.string()
			})
			.strict()
			.optional(),
		note: z.string().nullable(),
		isLastWorkout: z.boolean()
	})
	.strict();

const completedMiniSetSchema = WorkoutExerciseMiniSetSchema.strict();
const completedSetSchema = WorkoutExerciseSetSchema.extend({ miniSets: z.array(completedMiniSetSchema) }).strict();
const completedExerciseSchema = WorkoutExerciseSchema.extend({ sets: z.array(completedSetSchema) }).strict();
const previousWorkoutDataSchema: z.ZodType<PreviousWorkoutData> = z
	.object({
		exercises: z.array(completedExerciseSchema),
		userBodyweight: z.number()
	})
	.strict();

const activeDraftSchema: z.ZodType<WorkoutDraft, z.ZodTypeDef, unknown> = z
	.object({
		workoutData: workoutDataSchema,
		workoutExercises: z.array(inProgressExerciseSchema).nullable(),
		previousWorkoutData: previousWorkoutDataSchema.nullable()
	})
	.strict();

const editWorkoutDataSchema = workoutDataSchema.superRefine((workoutData, context) => {
	if (workoutData.endedAt === null) {
		context.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'A historical workout must be completed',
			path: ['endedAt']
		});
	} else if (workoutData.endedAt < workoutData.startedAt) {
		context.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'A historical workout cannot end before it starts',
			path: ['endedAt']
		});
	}
	if (workoutData.userBodyweight === null) {
		context.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'A historical workout must have bodyweight',
			path: ['userBodyweight']
		});
	}
	if (workoutData.workoutExercises.length !== 0) {
		context.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Edit exercise data must use the canonical workoutExercises field',
			path: ['workoutExercises']
		});
	}
	if (workoutData.workoutOfMesocycle !== undefined || workoutData.isLastWorkout) {
		context.addIssue({ code: z.ZodIssueCode.custom, message: 'Edit metadata must be canonical' });
	}
});

const editDraftSchema: z.ZodType<WorkoutEditDraft, z.ZodTypeDef, unknown> = z
	.object({
		workoutId: z.string().cuid2(),
		workoutData: editWorkoutDataSchema,
		workoutExercises: z.array(inProgressExerciseSchema)
	})
	.strict();

const activeDraftRecordSchema: z.ZodType<
	{
		version: typeof WORKOUT_DRAFT_RECORD_VERSION;
		draft: WorkoutDraft;
	},
	z.ZodTypeDef,
	unknown
> = z.object({ version: z.literal(WORKOUT_DRAFT_RECORD_VERSION), draft: activeDraftSchema }).strict();
const editDraftRecordSchema: z.ZodType<
	{
		version: typeof WORKOUT_DRAFT_RECORD_VERSION;
		draft: WorkoutEditDraft;
	},
	z.ZodTypeDef,
	unknown
> = z.object({ version: z.literal(WORKOUT_DRAFT_RECORD_VERSION), draft: editDraftSchema }).strict();

function stripDatabaseFields(workoutExercises: unknown): unknown {
	if (!Array.isArray(workoutExercises)) return workoutExercises;
	return workoutExercises.map((workoutExercise) => {
		if (!isObject(workoutExercise)) return workoutExercise;
		const { id, workoutId, exerciseIndex, sets, ...exercise } = workoutExercise;
		return {
			...exercise,
			sets: Array.isArray(sets)
				? sets.map((set) => {
						if (!isObject(set)) return set;
						const { id, workoutExerciseId, setIndex, miniSets, ...setData } = set;
						return {
							...setData,
							miniSets: Array.isArray(miniSets)
								? miniSets.map((miniSet) => {
										if (!isObject(miniSet)) return miniSet;
										const { id, workoutExerciseSetId, miniSetIndex, ...miniSetData } = miniSet;
										return miniSetData;
									})
								: miniSets
						};
					})
				: sets
		};
	});
}

const legacyStorageSchema = z
	.object({
		workoutData: workoutDataSchema.nullable(),
		workoutExercises: z.preprocess(stripDatabaseFields, z.array(inProgressExerciseSchema).nullable()),
		editingWorkoutId: z.string().min(1).nullable().optional(),
		previousWorkoutData: previousWorkoutDataSchema.nullable()
	})
	.strict();

export function emptyWorkoutDraftStorage(): WorkoutDraftStorage {
	return {
		version: WORKOUT_DRAFT_STORAGE_VERSION,
		mode: 'active',
		activeDraft: null,
		editDraft: null
	};
}

export function emptyWorkoutDraftRecords(): WorkoutDraftRecords {
	return {
		active: { raw: null, status: 'empty', draft: null, ownsRaw: true },
		edit: { raw: null, status: 'empty', draft: null, ownsRaw: true }
	};
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function reviveLegacyWorkoutDate(key: string, value: unknown) {
	if ((key !== 'startedAt' && key !== 'endedAt') || typeof value !== 'string') return value;

	// Legacy monolithic drafts predate the canonical record contract, so keep accepting parseable date strings during migration.
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date;
}

function reviveCurrentWorkoutDate(key: string, value: unknown) {
	const revived = reviveLegacyWorkoutDate(key, value);
	return revived instanceof Date && revived.toISOString() === value ? revived : value;
}

function parseJson(rawStorage: string, reviveDates: typeof reviveCurrentWorkoutDate): unknown {
	return JSON.parse(rawStorage, reviveDates);
}

function serializeDraftRecord<T>(draft: T) {
	return JSON.stringify({ version: WORKOUT_DRAFT_RECORD_VERSION, draft });
}

function parseDraftRecord<T>(
	rawStorage: string | null,
	schema: z.ZodType<{ version: 1; draft: T }, z.ZodTypeDef, unknown>
): WorkoutDraftRecord<T> {
	if (rawStorage === null) return { raw: null, status: 'empty', draft: null, ownsRaw: true };
	let parsed: unknown;
	try {
		parsed = parseJson(rawStorage, reviveCurrentWorkoutDate);
	} catch {
		return { raw: rawStorage, status: 'corrupt', draft: null, ownsRaw: false };
	}
	if (isObject(parsed) && typeof parsed.version === 'number' && parsed.version !== WORKOUT_DRAFT_RECORD_VERSION) {
		return { raw: rawStorage, status: 'unsupported', draft: null, ownsRaw: false };
	}
	const result = schema.safeParse(parsed);
	return result.success
		? { raw: rawStorage, status: 'valid', draft: result.data.draft, ownsRaw: true }
		: { raw: rawStorage, status: 'corrupt', draft: null, ownsRaw: false };
}

export function parseWorkoutDraftStorage(rawStorage: string | null): WorkoutDraftParseResult {
	const emptyStorage = emptyWorkoutDraftStorage();
	if (rawStorage === null) return { status: 'empty', storage: emptyStorage };

	let envelope: unknown;
	try {
		envelope = JSON.parse(rawStorage);
	} catch {
		return { status: 'corrupt', storage: emptyStorage };
	}
	if (!isObject(envelope)) return { status: 'corrupt', storage: emptyStorage };

	let parsed: unknown;
	try {
		parsed = parseJson(rawStorage, 'version' in envelope ? reviveCurrentWorkoutDate : reviveLegacyWorkoutDate);
	} catch {
		return { status: 'corrupt', storage: emptyStorage };
	}
	if (!isObject(parsed)) return { status: 'corrupt', storage: emptyStorage };

	if ('version' in parsed) {
		if (typeof parsed.version === 'number' && parsed.version !== WORKOUT_DRAFT_STORAGE_VERSION) {
			return { status: 'unsupported', storage: emptyStorage };
		}
		if (parsed.version !== WORKOUT_DRAFT_STORAGE_VERSION) return { status: 'corrupt', storage: emptyStorage };

		const activeResult = parsed.activeDraft === null ? null : activeDraftSchema.safeParse(parsed.activeDraft);
		const editResult = parsed.editDraft === null ? null : editDraftSchema.safeParse(parsed.editDraft);
		const activeDraft = activeResult?.success ? activeResult.data : null;
		const editDraft = editResult?.success ? editResult.data : null;
		const expectedKeys = ['version', 'mode', 'activeDraft', 'editDraft'];
		const envelopeCorrupt =
			!expectedKeys.every((key) => key in parsed) || Object.keys(parsed).some((key) => !expectedKeys.includes(key));
		const activeCorrupt = parsed.activeDraft !== null && activeDraft === null;
		const editCorrupt = parsed.editDraft !== null && editDraft === null;

		if (parsed.mode === 'edit' && editDraft) {
			return {
				status: envelopeCorrupt || activeCorrupt || editCorrupt ? 'corrupt' : 'valid',
				storage: { version: WORKOUT_DRAFT_STORAGE_VERSION, mode: 'edit', activeDraft, editDraft }
			};
		}

		const modeCorrupt = parsed.mode !== 'active' || parsed.editDraft !== null;
		return {
			status: envelopeCorrupt || activeCorrupt || editCorrupt || modeCorrupt ? 'corrupt' : 'valid',
			storage: { version: WORKOUT_DRAFT_STORAGE_VERSION, mode: 'active', activeDraft, editDraft: null }
		};
	}

	const legacyResult = legacyStorageSchema.safeParse(parsed);
	if (!legacyResult.success) return { status: 'corrupt', storage: emptyStorage };
	const { workoutData, workoutExercises, editingWorkoutId, previousWorkoutData } = legacyResult.data;
	if (workoutData === null) {
		const cleared = workoutExercises === null && previousWorkoutData === null && !editingWorkoutId;
		return { status: cleared ? 'migrated' : 'corrupt', storage: emptyStorage };
	}
	if (editingWorkoutId) {
		if (workoutExercises === null) return { status: 'corrupt', storage: emptyStorage };
		const editDraft = editDraftSchema.safeParse({ workoutId: editingWorkoutId, workoutData, workoutExercises });
		if (!editDraft.success) return { status: 'corrupt', storage: emptyStorage };
		return {
			status: 'migrated',
			storage: {
				version: WORKOUT_DRAFT_STORAGE_VERSION,
				mode: 'edit',
				activeDraft: null,
				editDraft: editDraft.data
			}
		};
	}
	return {
		status: 'migrated',
		storage: {
			version: WORKOUT_DRAFT_STORAGE_VERSION,
			mode: 'active',
			activeDraft: { workoutData, workoutExercises, previousWorkoutData },
			editDraft: null
		}
	};
}

export type DraftRecordMutation<T> = {
	record: WorkoutDraftRecord<T>;
	written: boolean;
	conflict: boolean;
};

function observeDraftRecord<T>(current: WorkoutDraftRecord<T>, parsed: WorkoutDraftRecord<T>) {
	return parsed.status === 'valid' || parsed.status === 'empty' ? parsed : { ...parsed, draft: current.draft };
}

async function saveDraftRecord<T extends { workoutExercises: unknown }>(
	storageAdapter: StorageAdapter,
	key: string,
	schema: z.ZodType<{ version: 1; draft: T }, z.ZodTypeDef, unknown>,
	ownedRecord: WorkoutDraftRecord<T>,
	draft: T | null,
	lockManager?: WorkoutDraftLockManager | null,
	mutationAllowed: () => boolean = () => true
): Promise<DraftRecordMutation<T>> {
	return withWorkoutDraftLock(
		key,
		() => {
			if (!mutationAllowed()) return { record: ownedRecord, written: false, conflict: false };
			const currentRaw = storageAdapter.getItem(key);
			const currentRecord = parseDraftRecord(currentRaw, schema);
			if (
				currentRaw !== ownedRecord.raw ||
				!ownedRecord.ownsRaw ||
				(currentRecord.status !== 'valid' && currentRecord.status !== 'empty')
			) {
				return {
					record: observeDraftRecord({ ...ownedRecord, draft }, currentRecord),
					written: false,
					conflict: currentRecord.status === 'corrupt' || currentRecord.status === 'unsupported'
				};
			}

			if (draft === null) {
				storageAdapter.removeItem(key);
				return { record: parseDraftRecord(null, schema), written: true, conflict: false };
			}

			const raw = serializeDraftRecord({
				...draft,
				workoutExercises: stripDatabaseFields(draft.workoutExercises)
			});
			storageAdapter.setItem(key, raw);
			return { record: parseDraftRecord(raw, schema), written: true, conflict: false };
		},
		lockManager
	);
}

export function saveActiveWorkoutDraft(
	storageAdapter: StorageAdapter,
	ownedRecord: WorkoutDraftRecord<WorkoutDraft>,
	draft: WorkoutDraft | null,
	keys: WorkoutDraftStorageKeys,
	lockManager?: WorkoutDraftLockManager | null,
	mutationAllowed?: () => boolean
) {
	return saveDraftRecord(
		storageAdapter,
		keys.active,
		activeDraftRecordSchema,
		ownedRecord,
		draft,
		lockManager,
		mutationAllowed
	);
}

export function saveEditWorkoutDraft(
	storageAdapter: StorageAdapter,
	ownedRecord: WorkoutDraftRecord<WorkoutEditDraft>,
	draft: WorkoutEditDraft | null,
	keys: WorkoutDraftStorageKeys,
	lockManager?: WorkoutDraftLockManager | null,
	mutationAllowed?: () => boolean
) {
	return saveDraftRecord(
		storageAdapter,
		keys.edit,
		editDraftRecordSchema,
		ownedRecord,
		draft,
		lockManager,
		mutationAllowed
	);
}

export function setWorkoutDraftMode(
	storageAdapter: Pick<StorageAdapter, 'setItem'>,
	keys: WorkoutDraftStorageKeys,
	mode: 'active' | 'edit'
) {
	storageAdapter.setItem(keys.mode, mode);
}

export function applyWorkoutDraftStorageEvent(
	current: WorkoutDraftRecords,
	key: string,
	newValue: string | null,
	keys: WorkoutDraftStorageKeys
): WorkoutDraftRecords {
	if (key === keys.active) {
		const parsed = parseDraftRecord(newValue, activeDraftRecordSchema);
		return { ...current, active: observeDraftRecord(current.active, parsed) };
	}
	if (key === keys.edit) {
		const parsed = parseDraftRecord(newValue, editDraftRecordSchema);
		return { ...current, edit: observeDraftRecord(current.edit, parsed) };
	}
	return current;
}

export function loadWorkoutDraftStorage(
	storageAdapter: StorageAdapter,
	modeStorageAdapter: Pick<StorageAdapter, 'getItem'>,
	keys: WorkoutDraftStorageKeys
): WorkoutDraftLoadResult {
	const activeRaw = storageAdapter.getItem(keys.active);
	const editRaw = storageAdapter.getItem(keys.edit);
	const legacyRaw = storageAdapter.getItem(keys.legacy);
	const legacyResult = parseWorkoutDraftStorage(legacyRaw);
	if (legacyResult.status === 'migrated' || legacyResult.status === 'valid') {
		const parsedActive = parseDraftRecord(activeRaw, activeDraftRecordSchema);
		const parsedEdit = parseDraftRecord(editRaw, editDraftRecordSchema);
		const activeResult =
			activeRaw === null ? { ...parsedActive, draft: legacyResult.storage.activeDraft } : parsedActive;
		const editResult = editRaw === null ? { ...parsedEdit, draft: legacyResult.storage.editDraft } : parsedEdit;
		const requestedMode = modeStorageAdapter.getItem(keys.mode);
		const mode =
			requestedMode === 'edit' && editResult.draft
				? 'edit'
				: requestedMode === 'active'
					? 'active'
					: legacyResult.storage.mode === 'edit' && editResult.draft
						? 'edit'
						: 'active';
		return {
			status: 'migrated',
			legacyRaw: legacyRaw ?? undefined,
			storage: {
				version: WORKOUT_DRAFT_STORAGE_VERSION,
				mode,
				activeDraft: activeResult.draft,
				editDraft: editResult.draft
			},
			records: { active: activeResult, edit: editResult }
		};
	}

	if (activeRaw !== null || editRaw !== null) {
		const activeResult = parseDraftRecord(activeRaw, activeDraftRecordSchema);
		const editResult = parseDraftRecord(editRaw, editDraftRecordSchema);
		const requestedMode = modeStorageAdapter.getItem(keys.mode);
		const mode = requestedMode === 'edit' && editResult.draft ? 'edit' : 'active';
		const statuses = [activeResult.status, editResult.status];
		const status = statuses.includes('unsupported')
			? 'unsupported'
			: statuses.includes('corrupt')
				? 'corrupt'
				: 'valid';
		return {
			status,
			records: { active: activeResult, edit: editResult },
			storage: {
				version: WORKOUT_DRAFT_STORAGE_VERSION,
				mode,
				activeDraft: activeResult.draft,
				editDraft: editResult.draft
			}
		};
	}

	return {
		...legacyResult,
		records: emptyWorkoutDraftRecords()
	};
}

export async function migrateWorkoutDraftStorage(
	storageAdapter: StorageAdapter,
	modeStorageAdapter: Pick<StorageAdapter, 'getItem' | 'setItem'>,
	loaded: WorkoutDraftLoadResult,
	keys: WorkoutDraftStorageKeys,
	lockManager?: WorkoutDraftLockManager | null,
	mutationAllowed: () => boolean = () => true
): Promise<WorkoutDraftLoadResult> {
	if (loaded.status !== 'migrated' || loaded.legacyRaw === undefined) return loaded;
	const resolvedLockManager = lockManager === undefined ? browserLockManager() : lockManager;
	if (!resolvedLockManager) throw new WorkoutDraftPersistenceUnavailableError();

	const migrate = () => {
		if (!mutationAllowed()) return loaded;
		const legacyRaw = storageAdapter.getItem(keys.legacy);
		if (legacyRaw !== loaded.legacyRaw) {
			return loadWorkoutDraftStorage(storageAdapter, modeStorageAdapter, keys);
		}

		const migratedActiveRaw = loaded.storage.activeDraft ? serializeDraftRecord(loaded.storage.activeDraft) : null;
		const migratedEditRaw = loaded.storage.editDraft ? serializeDraftRecord(loaded.storage.editDraft) : null;
		let activeRaw = storageAdapter.getItem(keys.active);
		let editRaw = storageAdapter.getItem(keys.edit);
		if (activeRaw === null && migratedActiveRaw !== null) {
			storageAdapter.setItem(keys.active, migratedActiveRaw);
			activeRaw = migratedActiveRaw;
		}
		if (editRaw === null && migratedEditRaw !== null) {
			storageAdapter.setItem(keys.edit, migratedEditRaw);
			editRaw = migratedEditRaw;
		}

		const activeReady = migratedActiveRaw === null || activeRaw === migratedActiveRaw;
		const editReady = migratedEditRaw === null || editRaw === migratedEditRaw;
		if (!activeReady || !editReady) {
			return loadWorkoutDraftStorage(storageAdapter, modeStorageAdapter, keys);
		}

		setWorkoutDraftMode(modeStorageAdapter, keys, loaded.storage.mode);
		storageAdapter.removeItem(keys.legacy);
		const completed = loadWorkoutDraftStorage(storageAdapter, modeStorageAdapter, keys);
		return { ...completed, status: 'migrated' as const };
	};

	return withWorkoutDraftLocks([keys.active, keys.edit, keys.legacy], migrate, resolvedLockManager);
}
