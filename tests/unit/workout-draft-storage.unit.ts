import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createId } from '@paralleldrive/cuid2';
import type { WorkoutExerciseInProgress } from '../../src/lib/utils/workoutUtils';
import { keyValueStorage } from './workout-draft-test-utils';
import {
	WORKOUT_DRAFT_STORAGE_KEY as ORIGIN_GLOBAL_WORKOUT_DRAFT_STORAGE_KEY,
	WORKOUT_DRAFT_RECORD_VERSION,
	WORKOUT_DRAFT_STORAGE_VERSION,
	WorkoutDraftPersistenceUnavailableError,
	applyWorkoutDraftStorageEvent as applyScopedWorkoutDraftStorageEvent,
	createWorkoutEditDraft,
	emptyWorkoutDraftStorage,
	loadWorkoutDraftStorage as loadScopedWorkoutDraftStorage,
	migrateWorkoutDraftStorage as migrateScopedWorkoutDraftStorage,
	parseWorkoutDraftStorage,
	saveActiveWorkoutDraft as saveScopedActiveWorkoutDraft,
	saveEditWorkoutDraft as saveScopedEditWorkoutDraft,
	workoutDraftStorageKeys,
	type WorkoutDraftLockManager
} from '../../src/routes/workouts/manage/workoutDraftStorage';

const STORAGE_KEYS = workoutDraftStorageKeys('unit-test-user');
const WORKOUT_DRAFT_STORAGE_KEY = STORAGE_KEYS.legacy;
const WORKOUT_ACTIVE_DRAFT_STORAGE_KEY = STORAGE_KEYS.active;
const WORKOUT_EDIT_DRAFT_STORAGE_KEY = STORAGE_KEYS.edit;
const WORKOUT_DRAFT_MODE_STORAGE_KEY = STORAGE_KEYS.mode;
type StorageAdapter = Parameters<typeof loadScopedWorkoutDraftStorage>[0];
type ModeStorageAdapter = Parameters<typeof loadScopedWorkoutDraftStorage>[1];
const immediateLockManager: WorkoutDraftLockManager = {
	async request(_name, callback) {
		return callback();
	}
};

function loadWorkoutDraftStorage(storage: StorageAdapter, modeStorage: ModeStorageAdapter = keyValueStorage()) {
	return loadScopedWorkoutDraftStorage(storage, modeStorage, STORAGE_KEYS);
}

function migrateWorkoutDraftStorage(
	storage: StorageAdapter,
	modeStorage: Parameters<typeof migrateScopedWorkoutDraftStorage>[1],
	loaded: ReturnType<typeof loadWorkoutDraftStorage>,
	lockManager: WorkoutDraftLockManager | null = immediateLockManager
) {
	return migrateScopedWorkoutDraftStorage(storage, modeStorage, loaded, STORAGE_KEYS, lockManager);
}

function saveActiveWorkoutDraft(
	storage: StorageAdapter,
	record: ReturnType<typeof loadWorkoutDraftStorage>['records']['active'],
	draft: Parameters<typeof saveScopedActiveWorkoutDraft>[2],
	lockManager: WorkoutDraftLockManager | null = immediateLockManager
) {
	return saveScopedActiveWorkoutDraft(storage, record, draft, STORAGE_KEYS, lockManager);
}

function saveEditWorkoutDraft(
	storage: StorageAdapter,
	record: ReturnType<typeof loadWorkoutDraftStorage>['records']['edit'],
	draft: Parameters<typeof saveScopedEditWorkoutDraft>[2],
	lockManager: WorkoutDraftLockManager | null = immediateLockManager
) {
	return saveScopedEditWorkoutDraft(storage, record, draft, STORAGE_KEYS, lockManager);
}

function applyWorkoutDraftStorageEvent(
	current: ReturnType<typeof loadWorkoutDraftStorage>['records'],
	key: string,
	newValue: string | null
) {
	return applyScopedWorkoutDraftStorageEvent(current, key, newValue, STORAGE_KEYS);
}

const HISTORICAL_WORKOUT_ID = createId();
const LEGACY_WORKOUT_ID = createId();
const NEWER_HISTORICAL_WORKOUT_ID = createId();

function workoutData(startedAt: string, userBodyweight: number) {
	return {
		startedAt,
		endedAt: null,
		userBodyweight,
		workoutExercises: [],
		note: null,
		isLastWorkout: false
	};
}

function completedWorkoutData(startedAt: string, userBodyweight: number) {
	return {
		...workoutData(startedAt, userBodyweight),
		endedAt: new Date(new Date(startedAt).getTime() + 60 * 60 * 1000).toISOString()
	};
}

function exercise(name: string): WorkoutExerciseInProgress {
	return {
		name,
		targetMuscleGroup: 'Chest' as const,
		customMuscleGroup: null,
		bodyweightFraction: null,
		setType: 'Straight' as const,
		changeType: null,
		changeAmount: null,
		repRangeStart: 5,
		repRangeEnd: 10,
		note: null,
		overloadPercentage: null,
		lastSetToFailure: null,
		forceRIRMatching: null,
		minimumWeightChange: null,
		topRepRangeStart: null,
		topRepRangeEnd: null,
		isDeload: false,
		sets: [{ reps: 9, plannedReps: 10, load: 135, RIR: 2, skipped: false, completed: true, miniSets: [] }]
	};
}

function completedExercise(name: string) {
	const workoutExercise = exercise(name);
	const workoutExerciseId = createId();
	return {
		...workoutExercise,
		id: workoutExerciseId,
		workoutId: LEGACY_WORKOUT_ID,
		exerciseIndex: 0,
		sets: workoutExercise.sets.map((set, setIndex) => {
			const { completed, plannedReps: _plannedReps, ...setData } = set;
			const setId = createId();
			return {
				...setData,
				id: setId,
				workoutExerciseId,
				setIndex,
				miniSets: set.miniSets.map((miniSet, miniSetIndex) => {
					const { completed, ...miniSetData } = miniSet;
					return {
						...miniSetData,
						id: createId(),
						workoutExerciseSetId: setId,
						miniSetIndex
					};
				})
			};
		})
	};
}

function activeDraft() {
	return {
		workoutData: workoutData('2026-08-02T17:00:00.000Z', 195),
		workoutExercises: [exercise('Active bench press')],
		previousWorkoutData: { exercises: [] }
	};
}

function memoryStorage(raw: string) {
	let value = raw;
	let writes = 0;
	return {
		getItem(key: string) {
			return key === WORKOUT_DRAFT_STORAGE_KEY ? value : null;
		},
		setItem(key: string, nextValue: string) {
			if (key === WORKOUT_DRAFT_STORAGE_KEY) {
				value = nextValue;
				writes++;
			}
		},
		removeItem() {},
		get value() {
			return value;
		},
		get writes() {
			return writes;
		}
	};
}

async function writeActiveDraft(
	storage: ReturnType<typeof keyValueStorage>,
	draft: ReturnType<typeof activeDraft> | null
) {
	const record = loadWorkoutDraftStorage(storage, keyValueStorage()).records.active;
	return saveActiveWorkoutDraft(storage, record, draft);
}

async function writeEditDraft(
	storage: ReturnType<typeof keyValueStorage>,
	draft: {
		workoutId: string;
		workoutData: ReturnType<typeof completedWorkoutData>;
		workoutExercises: WorkoutExerciseInProgress[];
	} | null
) {
	const record = loadWorkoutDraftStorage(storage, keyValueStorage()).records.edit;
	return saveEditWorkoutDraft(storage, record, draft);
}

describe('workout draft storage', () => {
	it('keeps the active workout separate while restoring an edit after reload', async () => {
		const restored = parseWorkoutDraftStorage(
			JSON.stringify({
				version: WORKOUT_DRAFT_STORAGE_VERSION,
				mode: 'edit',
				activeDraft: activeDraft(),
				editDraft: {
					workoutId: HISTORICAL_WORKOUT_ID,
					workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
					workoutExercises: [exercise('Historical squat')]
				}
			})
		);

		assert.equal(restored.status, 'valid');
		assert.equal(restored.storage.mode, 'edit');
		assert.equal(restored.storage.editDraft?.workoutId, HISTORICAL_WORKOUT_ID);
		assert.equal(restored.storage.editDraft?.workoutExercises[0].name, 'Historical squat');
		assert.equal(restored.storage.editDraft?.workoutExercises[0].preferredProgressionVariable, null);
		assert.equal(restored.storage.activeDraft?.workoutExercises?.[0].name, 'Active bench press');
		assert.equal(restored.storage.activeDraft?.workoutExercises?.[0].sets[0].plannedReps, 10);
		assert.ok(restored.storage.editDraft?.workoutData.startedAt instanceof Date);
	});

	it('defaults a missing progression preference in a legacy nested mesocycle', () => {
		const draft = activeDraft();
		const restored = parseWorkoutDraftStorage(
			JSON.stringify({
				version: WORKOUT_DRAFT_STORAGE_VERSION,
				mode: 'active',
				activeDraft: {
					...draft,
					workoutData: {
						...draft.workoutData,
						workoutOfMesocycle: {
							workoutStatus: null,
							splitDayIndex: 0,
							mesocycle: {
								id: createId(),
								name: 'Legacy progression',
								userId: createId(),
								exerciseSplitId: null,
								RIRProgression: [3, 2, 1],
								startDate: null,
								endDate: null,
								startOverloadPercentage: 1,
								lastSetToFailure: false,
								forceRIRMatching: false
							},
							cycleNumber: 1,
							splitDayName: 'Day 1'
						}
					}
				},
				editDraft: null
			})
		);

		assert.equal(restored.status, 'valid');
		assert.equal(
			restored.storage.activeDraft?.workoutData.workoutOfMesocycle?.mesocycle.preferredProgressionVariable,
			'Reps'
		);
	});

	it('round-trips a canonical historical edit draft while rejecting persisted database indexes', async () => {
		const historicalExercise = exercise('Historical squat');
		const editDraft = createWorkoutEditDraft({
			id: HISTORICAL_WORKOUT_ID,
			startedAt: new Date('2026-07-01T17:00:00.000Z'),
			endedAt: new Date('2026-07-01T18:00:00.000Z'),
			userBodyweight: 190,
			note: null,
			workoutExercises: [
				{
					...historicalExercise,
					isDeload: historicalExercise.isDeload ?? false,
					id: 'historical-exercise',
					workoutId: HISTORICAL_WORKOUT_ID,
					exerciseIndex: 0,
					customMuscleGroup: historicalExercise.customMuscleGroup ?? null,
					bodyweightFraction: historicalExercise.bodyweightFraction ?? null,
					changeType: historicalExercise.changeType ?? null,
					changeAmount: historicalExercise.changeAmount ?? null,
					note: historicalExercise.note ?? null,
					overloadPercentage: historicalExercise.overloadPercentage ?? null,
					lastSetToFailure: historicalExercise.lastSetToFailure ?? null,
					forceRIRMatching: historicalExercise.forceRIRMatching ?? null,
					minimumWeightChange: historicalExercise.minimumWeightChange ?? null,
					preferredProgressionVariable: historicalExercise.preferredProgressionVariable ?? null,
					repRangeMode: historicalExercise.repRangeMode ?? null,
					mesocycleExerciseTemplateId: historicalExercise.mesocycleExerciseTemplateId ?? null,
					topRepRangeStart: historicalExercise.topRepRangeStart ?? null,
					topRepRangeEnd: historicalExercise.topRepRangeEnd ?? null,
					sets: [
						{
							id: 'historical-set',
							workoutExerciseId: 'historical-exercise',
							setIndex: 0,
							reps: 9,
							load: 135,
							RIR: 2,
							skipped: false,
							miniSets: [
								{
									id: 'historical-mini-set',
									workoutExerciseSetId: 'historical-set',
									miniSetIndex: 0,
									reps: 3,
									load: 135,
									RIR: 0
								}
							]
						}
					]
				}
			]
		});

		const canonicalSet = editDraft.workoutExercises[0].sets[0];
		assert.equal(Object.hasOwn(editDraft.workoutExercises[0], 'exerciseIndex'), false);
		assert.equal(Object.hasOwn(canonicalSet, 'setIndex'), false);
		assert.equal(Object.hasOwn(canonicalSet.miniSets[0], 'miniSetIndex'), false);
		assert.equal(editDraft.workoutExercises[0].workStarted, true);

		const roundTrip = parseWorkoutDraftStorage(
			JSON.stringify({
				version: WORKOUT_DRAFT_STORAGE_VERSION,
				mode: 'edit',
				activeDraft: activeDraft(),
				editDraft
			})
		);
		assert.equal(roundTrip.status, 'valid');
		assert.equal(roundTrip.storage.mode, 'edit');
		assert.equal(roundTrip.storage.editDraft?.workoutExercises[0].name, 'Historical squat');

		const editDraftWithIndexes = {
			...editDraft,
			workoutExercises: editDraft.workoutExercises.map((workoutExercise) => ({
				...workoutExercise,
				exerciseIndex: 0,
				sets: workoutExercise.sets.map((set) => ({
					...set,
					setIndex: 0,
					miniSets: set.miniSets.map((miniSet) => ({ ...miniSet, miniSetIndex: 0 }))
				}))
			}))
		};
		const rejected = parseWorkoutDraftStorage(
			JSON.stringify({
				version: WORKOUT_DRAFT_STORAGE_VERSION,
				mode: 'edit',
				activeDraft: activeDraft(),
				editDraft: editDraftWithIndexes
			})
		);
		assert.equal(rejected.status, 'corrupt');
		assert.equal(rejected.storage.mode, 'active');
		assert.equal(rejected.storage.activeDraft?.workoutData.userBodyweight, 195);
	});

	it('falls back to a valid active draft when an edit draft is partially corrupt', async () => {
		const restored = parseWorkoutDraftStorage(
			JSON.stringify({
				version: WORKOUT_DRAFT_STORAGE_VERSION,
				mode: 'edit',
				activeDraft: activeDraft(),
				editDraft: { workoutId: HISTORICAL_WORKOUT_ID, workoutExercises: [] }
			})
		);

		assert.equal(restored.status, 'corrupt');
		assert.equal(restored.storage.mode, 'active');
		assert.equal(restored.storage.activeDraft?.workoutData.userBodyweight, 195);
		assert.equal(restored.storage.activeDraft?.workoutExercises?.[0].name, 'Active bench press');
		assert.equal(restored.storage.editDraft, null);
	});

	it('keeps a valid edit usable when only the active draft is corrupt', async () => {
		const restored = parseWorkoutDraftStorage(
			JSON.stringify({
				version: WORKOUT_DRAFT_STORAGE_VERSION,
				mode: 'edit',
				activeDraft: { workoutData: 'corrupt', workoutExercises: [], previousWorkoutData: null },
				editDraft: {
					workoutId: HISTORICAL_WORKOUT_ID,
					workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
					workoutExercises: [exercise('Historical squat')]
				}
			})
		);

		assert.equal(restored.status, 'corrupt');
		assert.equal(restored.storage.mode, 'edit');
		assert.equal(restored.storage.activeDraft, null);
		assert.equal(restored.storage.editDraft?.workoutId, HISTORICAL_WORKOUT_ID);
	});

	it('migrates legacy active and edit payloads without leaking comparison data', async () => {
		const active = parseWorkoutDraftStorage(
			JSON.stringify({
				workoutData: workoutData('2026-08-02T17:00:00.000Z', 195),
				workoutExercises: [exercise('Bench press')],
				editingWorkoutId: null,
				previousWorkoutData: { exercises: [], userBodyweight: 190 }
			})
		);
		assert.equal(active.status, 'migrated');
		assert.equal(active.storage.mode, 'active');
		const activeStartedAt = active.storage.activeDraft?.workoutData.startedAt;
		assert.ok(activeStartedAt instanceof Date);
		assert.equal(activeStartedAt.toISOString(), '2026-08-02T17:00:00.000Z');

		const edit = parseWorkoutDraftStorage(
			JSON.stringify({
				workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
				workoutExercises: [exercise('Squat')],
				editingWorkoutId: LEGACY_WORKOUT_ID,
				previousWorkoutData: { exercises: [], userBodyweight: 180 }
			})
		);
		assert.equal(edit.status, 'migrated');
		assert.equal(edit.storage.mode, 'edit');
		assert.equal(Object.hasOwn(edit.storage.editDraft ?? {}, 'previousWorkoutData'), false);
	});

	it('migrates legacy comparison bodyweight and missing manual-deload fields', () => {
		const previousExercise = completedExercise('Legacy pull-up') as Record<string, unknown>;
		delete previousExercise.isDeload;
		const currentExercise = exercise('Legacy bench press') as unknown as Record<string, unknown>;
		delete currentExercise.isDeload;
		delete currentExercise.workStarted;

		const restored = parseWorkoutDraftStorage(
			JSON.stringify({
				workoutData: workoutData('2026-08-02T17:00:00.000Z', 195),
				workoutExercises: [currentExercise],
				editingWorkoutId: null,
				previousWorkoutData: { exercises: [previousExercise], userBodyweight: 190 }
			})
		);

		assert.equal(restored.status, 'migrated');
		assert.equal(restored.storage.activeDraft?.workoutExercises?.[0].isDeload, false);
		assert.equal(restored.storage.activeDraft?.workoutExercises?.[0].workStarted, true);
		assert.equal(restored.storage.activeDraft?.previousWorkoutData?.exercises[0].isDeload, false);
		assert.equal(restored.storage.activeDraft?.previousWorkoutData?.exercises[0].userBodyweight, 190);
	});

	it('restores legacy drafts that predate previous-workout comparison data', () => {
		const restored = parseWorkoutDraftStorage(
			JSON.stringify({
				workoutData: workoutData('2026-08-02T17:00:00.000Z', 195),
				workoutExercises: [exercise('Bench press')],
				editingWorkoutId: null
			})
		);

		assert.equal(restored.status, 'migrated');
		assert.equal(restored.storage.activeDraft?.previousWorkoutData, null);
	});

	it('retains parseable noncanonical dates only for legacy migration', async () => {
		const restored = parseWorkoutDraftStorage(
			JSON.stringify({
				workoutData: workoutData('2026-08-02T10:00:00-07:00', 195),
				workoutExercises: [],
				editingWorkoutId: null,
				previousWorkoutData: null
			})
		);

		assert.equal(restored.status, 'migrated');
		const startedAt = restored.storage.activeDraft?.workoutData.startedAt;
		assert.ok(startedAt instanceof Date);
		assert.equal(startedAt.toISOString(), '2026-08-02T17:00:00.000Z');
	});

	it('falls back safely when a legacy edit cannot satisfy current identity or time invariants', async () => {
		const validWorkoutData = completedWorkoutData('2026-07-01T17:00:00.000Z', 190);
		for (const legacyEdit of [
			{ editingWorkoutId: 'not-a-cuid', workoutData: validWorkoutData },
			{
				editingWorkoutId: LEGACY_WORKOUT_ID,
				workoutData: { ...validWorkoutData, startedAt: '2026-07-01T19:00:00.000Z' }
			}
		]) {
			const restored = parseWorkoutDraftStorage(
				JSON.stringify({
					...legacyEdit,
					workoutExercises: [exercise('Legacy historical squat')],
					previousWorkoutData: null
				})
			);

			assert.equal(restored.status, 'corrupt');
			assert.deepEqual(restored.storage, emptyWorkoutDraftStorage());
		}
	});

	it('distinguishes corrupt and unsupported payloads', async () => {
		assert.equal(parseWorkoutDraftStorage('{not json').status, 'corrupt');
		assert.equal(
			parseWorkoutDraftStorage(JSON.stringify({ version: 999, mode: 'active', activeDraft: null, editDraft: null }))
				.status,
			'unsupported'
		);
		assert.equal(
			parseWorkoutDraftStorage(
				JSON.stringify({
					version: WORKOUT_DRAFT_STORAGE_VERSION,
					mode: 'active',
					activeDraft: { workoutData: 'wrong', workoutExercises: {}, previousWorkoutData: null },
					editDraft: null
				})
			).status,
			'corrupt'
		);
		assert.equal(
			parseWorkoutDraftStorage(
				JSON.stringify({
					version: WORKOUT_DRAFT_STORAGE_VERSION,
					mode: 'active',
					activeDraft: {
						...activeDraft(),
						workoutData: workoutData('not-a-date', 195)
					},
					editDraft: null
				})
			).status,
			'corrupt'
		);
	});

	it('does not rewrite future-version or corrupt payloads during initialization', async () => {
		for (const raw of [
			JSON.stringify({ version: 999, mode: 'active', activeDraft: activeDraft(), editDraft: null }),
			'{not json'
		]) {
			const storage = memoryStorage(raw);
			loadWorkoutDraftStorage(storage);
			assert.equal(storage.writes, 0);
			assert.equal(storage.value, raw);
		}
	});

	it('preserves an unreadable separate active record when historical editing snapshots the active draft', async () => {
		for (const raw of [JSON.stringify({ version: 999, draft: activeDraft() }), '{not json']) {
			const storage = keyValueStorage({ [WORKOUT_ACTIVE_DRAFT_STORAGE_KEY]: raw });

			const record = loadWorkoutDraftStorage(storage, keyValueStorage()).records.active;
			assert.equal((await saveActiveWorkoutDraft(storage, record, null)).written, false);
			assert.equal(storage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY), raw);
		}
	});

	it('rewrites a confirmed legacy migration into separate storage exactly once', async () => {
		const raw = JSON.stringify({
			workoutData: workoutData('2026-08-02T17:00:00.000Z', 195),
			workoutExercises: [exercise('Bench press')],
			editingWorkoutId: null,
			previousWorkoutData: null
		});
		const storage = keyValueStorage({ [WORKOUT_DRAFT_STORAGE_KEY]: raw });
		const sessionStorage = keyValueStorage();
		const loaded = loadWorkoutDraftStorage(storage, sessionStorage);
		const result = await migrateWorkoutDraftStorage(storage, sessionStorage, loaded);

		assert.equal(result.status, 'migrated');
		assert.equal(storage.getItem(WORKOUT_DRAFT_STORAGE_KEY), null);
		const firstVersionedDraft = storage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY);
		assert.equal(JSON.parse(firstVersionedDraft ?? '{}').version, WORKOUT_DRAFT_RECORD_VERSION);

		assert.equal(loadWorkoutDraftStorage(storage, sessionStorage).status, 'valid');
		assert.equal(storage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY), firstVersionedDraft);
	});

	it('resumes scoped legacy migration after every destination write failure', async () => {
		const legacyDrafts = [
			{
				raw: JSON.stringify({
					workoutData: workoutData('2026-08-02T17:00:00.000Z', 195),
					workoutExercises: [exercise('Legacy bench press')],
					editingWorkoutId: null,
					previousWorkoutData: null
				}),
				mode: 'active' as const,
				destinationKey: WORKOUT_ACTIVE_DRAFT_STORAGE_KEY
			},
			{
				raw: JSON.stringify({
					workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
					workoutExercises: [exercise('Historical squat')],
					editingWorkoutId: HISTORICAL_WORKOUT_ID,
					previousWorkoutData: null
				}),
				mode: 'edit' as const,
				destinationKey: WORKOUT_EDIT_DRAFT_STORAGE_KEY
			}
		];

		for (const legacy of legacyDrafts) {
			for (const failAfterWrite of [1, 2]) {
				const localStorage = keyValueStorage({ [WORKOUT_DRAFT_STORAGE_KEY]: legacy.raw });
				const sessionStorage = keyValueStorage();
				let writes = 0;
				const failAfterSetItem = () => {
					writes += 1;
					if (writes === failAfterWrite) throw new Error(`injected failure after write ${writes}`);
				};
				const faultingLocalStorage = {
					getItem: localStorage.getItem,
					removeItem: localStorage.removeItem,
					setItem(key: string, value: string) {
						localStorage.setItem(key, value);
						failAfterSetItem();
					}
				};
				const faultingSessionStorage = {
					getItem: sessionStorage.getItem,
					setItem(key: string, value: string) {
						sessionStorage.setItem(key, value);
						failAfterSetItem();
					}
				};

				const loaded = loadWorkoutDraftStorage(localStorage, sessionStorage);
				await assert.rejects(
					migrateScopedWorkoutDraftStorage(
						faultingLocalStorage,
						faultingSessionStorage,
						loaded,
						STORAGE_KEYS,
						immediateLockManager
					),
					/injected failure/
				);
				assert.equal(localStorage.getItem(WORKOUT_DRAFT_STORAGE_KEY), legacy.raw);

				const interrupted = loadWorkoutDraftStorage(localStorage, sessionStorage);
				assert.equal(interrupted.status, 'migrated');
				const resumed = await migrateWorkoutDraftStorage(localStorage, sessionStorage, interrupted);

				assert.equal(resumed.status, 'migrated');
				assert.equal(resumed.storage.mode, legacy.mode);
				assert.equal(localStorage.getItem(WORKOUT_DRAFT_STORAGE_KEY), null);
				assert.equal(
					JSON.parse(localStorage.getItem(legacy.destinationKey) ?? '{}').version,
					WORKOUT_DRAFT_RECORD_VERSION
				);
			}
		}
	});

	it('does not read or claim an origin-global legacy draft', () => {
		const originGlobalRaw = JSON.stringify({
			workoutData: workoutData('2026-08-02T17:00:00.000Z', 195),
			workoutExercises: [exercise('Bench press')],
			editingWorkoutId: null,
			previousWorkoutData: null
		});
		const storage = keyValueStorage({ [ORIGIN_GLOBAL_WORKOUT_DRAFT_STORAGE_KEY]: originGlobalRaw });
		const sessionStorage = keyValueStorage();
		const loaded = loadWorkoutDraftStorage(storage, sessionStorage);

		assert.equal(loaded.status, 'empty');
		assert.equal(loaded.storage.activeDraft, null);
		assert.equal(loaded.storage.editDraft, null);
		assert.equal(storage.getItem(ORIGIN_GLOBAL_WORKOUT_DRAFT_STORAGE_KEY), originGlobalRaw);
		assert.equal(storage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY), null);
		assert.equal(storage.getItem(WORKOUT_EDIT_DRAFT_STORAGE_KEY), null);
	});

	it('returns an empty outcome for missing storage', async () => {
		assert.deepEqual(parseWorkoutDraftStorage(null), { status: 'empty', storage: emptyWorkoutDraftStorage() });
	});

	it('migrates and strips legitimate database-only indexes before initialization', async () => {
		const legacyExercise = exercise('Legacy bench press');
		legacyExercise.sets[0].miniSets.push({
			reps: 3,
			load: 135,
			RIR: 0,
			completed: true
		});
		const rawLegacy = JSON.stringify({
			workoutData: workoutData('2026-08-02T17:00:00.000Z', 195),
			workoutExercises: [
				{
					...legacyExercise,
					id: 'legacy-exercise-id',
					workoutId: LEGACY_WORKOUT_ID,
					exerciseIndex: 0,
					sets: legacyExercise.sets.map((set) => ({
						...set,
						id: 'legacy-set-id',
						workoutExerciseId: 'legacy-exercise-id',
						setIndex: 0,
						miniSets: set.miniSets.map((miniSet) => ({
							...miniSet,
							id: 'legacy-mini-set-id',
							workoutExerciseSetId: 'legacy-set-id',
							miniSetIndex: 0
						}))
					}))
				}
			],
			editingWorkoutId: null,
			previousWorkoutData: null
		});
		const localStorage = keyValueStorage({ [WORKOUT_DRAFT_STORAGE_KEY]: rawLegacy });
		const sessionStorage = keyValueStorage();

		const loaded = loadWorkoutDraftStorage(localStorage, sessionStorage);
		const restored = await migrateWorkoutDraftStorage(localStorage, sessionStorage, loaded);

		assert.equal(restored.status, 'migrated');
		assert.equal(localStorage.getItem(WORKOUT_DRAFT_STORAGE_KEY), null);
		assert.equal(sessionStorage.getItem(WORKOUT_DRAFT_MODE_STORAGE_KEY), 'active');
		const persisted = JSON.parse(localStorage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY) ?? '{}');
		assert.equal(persisted.version, WORKOUT_DRAFT_RECORD_VERSION);
		assert.equal(Object.hasOwn(persisted.draft.workoutExercises[0], 'exerciseIndex'), false);
		assert.equal(Object.hasOwn(persisted.draft.workoutExercises[0].sets[0], 'setIndex'), false);
		assert.equal(Object.hasOwn(persisted.draft.workoutExercises[0].sets[0].miniSets[0], 'miniSetIndex'), false);
	});

	it('keeps the current versioned record schema strict outside migration', async () => {
		const draft = activeDraft();
		const localStorage = keyValueStorage({
			[WORKOUT_ACTIVE_DRAFT_STORAGE_KEY]: JSON.stringify({
				version: WORKOUT_DRAFT_RECORD_VERSION,
				draft: {
					...draft,
					workoutExercises: draft.workoutExercises?.map((workoutExercise) => ({
						...workoutExercise,
						sets: workoutExercise.sets.map((set) => ({ ...set, setIndex: 0 }))
					}))
				}
			})
		});

		const restored = loadWorkoutDraftStorage(localStorage, keyValueStorage());

		assert.equal(restored.status, 'corrupt');
		assert.equal(restored.storage.activeDraft, null);
	});

	it('rejects noncanonical timestamps in current records instead of normalizing them', async () => {
		for (const startedAt of ['2026-02-30T17:00:00.000Z', '2026-08-02T10:00:00-07:00', '2026-08-02T17:00:00Z']) {
			const draft = activeDraft();
			const localStorage = keyValueStorage({
				[WORKOUT_ACTIVE_DRAFT_STORAGE_KEY]: JSON.stringify({
					version: WORKOUT_DRAFT_RECORD_VERSION,
					draft: { ...draft, workoutData: { ...draft.workoutData, startedAt } }
				})
			});

			const restored = loadWorkoutDraftStorage(localStorage, keyValueStorage());

			assert.equal(restored.status, 'corrupt');
			assert.equal(restored.storage.activeDraft, null);
		}
	});

	it('rejects current edit records that cannot represent a completed historical workout', async () => {
		const completedWorkout = completedWorkoutData('2026-07-01T17:00:00.000Z', 190);
		const invalidWorkoutData = [
			{ ...completedWorkout, endedAt: null },
			{ ...completedWorkout, userBodyweight: null },
			{ ...completedWorkout, isLastWorkout: true },
			{
				...completedWorkout,
				workoutExercises: [{ name: 'Duplicate exercise data', targetMuscleGroup: 'Chest', customMuscleGroup: null }]
			}
		];

		for (const workoutData of invalidWorkoutData) {
			const localStorage = keyValueStorage();
			await writeActiveDraft(localStorage, activeDraft());
			localStorage.setItem(
				WORKOUT_EDIT_DRAFT_STORAGE_KEY,
				JSON.stringify({
					version: WORKOUT_DRAFT_RECORD_VERSION,
					draft: {
						workoutId: HISTORICAL_WORKOUT_ID,
						workoutData,
						workoutExercises: [exercise('Historical squat')]
					}
				})
			);

			const restored = loadWorkoutDraftStorage(
				localStorage,
				keyValueStorage({ [WORKOUT_DRAFT_MODE_STORAGE_KEY]: 'edit' })
			);

			assert.equal(restored.status, 'corrupt');
			assert.equal(restored.storage.mode, 'active');
			assert.equal(restored.storage.activeDraft?.workoutData.userBodyweight, 195);
			assert.equal(restored.storage.editDraft, null);
		}
	});

	it('rejects a current edit record whose workout id cannot be submitted to the edit API', async () => {
		const localStorage = keyValueStorage();
		await writeActiveDraft(localStorage, activeDraft());
		localStorage.setItem(
			WORKOUT_EDIT_DRAFT_STORAGE_KEY,
			JSON.stringify({
				version: WORKOUT_DRAFT_RECORD_VERSION,
				draft: {
					workoutId: 'not-a-cuid',
					workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
					workoutExercises: [exercise('Historical squat')]
				}
			})
		);

		const restored = loadWorkoutDraftStorage(
			localStorage,
			keyValueStorage({ [WORKOUT_DRAFT_MODE_STORAGE_KEY]: 'edit' })
		);

		assert.equal(restored.status, 'corrupt');
		assert.equal(restored.storage.mode, 'active');
		assert.equal(restored.storage.activeDraft?.workoutData.userBodyweight, 195);
		assert.equal(restored.storage.editDraft, null);
	});

	it('rejects a current edit record that ends before it starts', async () => {
		const reversedWorkoutData = {
			...completedWorkoutData('2026-07-01T18:00:00.000Z', 190),
			endedAt: '2026-07-01T17:00:00.000Z'
		};
		const localStorage = keyValueStorage();
		await writeActiveDraft(localStorage, activeDraft());
		localStorage.setItem(
			WORKOUT_EDIT_DRAFT_STORAGE_KEY,
			JSON.stringify({
				version: WORKOUT_DRAFT_RECORD_VERSION,
				draft: {
					workoutId: HISTORICAL_WORKOUT_ID,
					workoutData: reversedWorkoutData,
					workoutExercises: [exercise('Historical squat')]
				}
			})
		);

		const restored = loadWorkoutDraftStorage(
			localStorage,
			keyValueStorage({ [WORKOUT_DRAFT_MODE_STORAGE_KEY]: 'edit' })
		);

		assert.equal(restored.status, 'corrupt');
		assert.equal(restored.storage.mode, 'active');
		assert.equal(restored.storage.activeDraft?.workoutData.userBodyweight, 195);
		assert.equal(restored.storage.editDraft, null);
	});

	it('strips runtime ordering fields before writing a current record', async () => {
		const draft = JSON.parse(JSON.stringify(activeDraft()));
		draft.workoutExercises[0].id = 'runtime-exercise-id';
		draft.workoutExercises[0].workoutId = 'runtime-workout-id';
		draft.workoutExercises[0].exerciseIndex = 0;
		draft.workoutExercises[0].sets[0].id = 'runtime-set-id';
		draft.workoutExercises[0].sets[0].workoutExerciseId = 'runtime-exercise-id';
		draft.workoutExercises[0].sets[0].setIndex = 0;
		draft.workoutExercises[0].sets[0].miniSets = [
			{
				id: 'runtime-mini-set-id',
				workoutExerciseSetId: 'runtime-set-id',
				miniSetIndex: 0,
				reps: 3,
				load: 135,
				RIR: 0,
				completed: true
			}
		];
		const localStorage = keyValueStorage();

		await writeActiveDraft(localStorage, draft);

		const persisted = JSON.parse(localStorage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY) ?? '{}');
		assert.equal(Object.hasOwn(persisted.draft.workoutExercises[0], 'exerciseIndex'), false);
		assert.equal(Object.hasOwn(persisted.draft.workoutExercises[0].sets[0], 'setIndex'), false);
		assert.equal(Object.hasOwn(persisted.draft.workoutExercises[0].sets[0].miniSets[0], 'miniSetIndex'), false);
		assert.equal(loadWorkoutDraftStorage(localStorage, keyValueStorage()).status, 'valid');
	});

	it('separate keys prevent active and edit tabs from erasing each other newer drafts', async () => {
		const sharedStorage = keyValueStorage();
		const firstActive = activeDraft();
		const newerActive = {
			...activeDraft(),
			workoutData: workoutData('2026-08-03T17:00:00.000Z', 196)
		};
		const editDraft = {
			workoutId: HISTORICAL_WORKOUT_ID,
			workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
			workoutExercises: [exercise('Historical squat')]
		};

		await writeActiveDraft(sharedStorage, firstActive);
		await writeEditDraft(sharedStorage, editDraft);
		await writeActiveDraft(sharedStorage, newerActive);

		let restored = loadWorkoutDraftStorage(
			sharedStorage,
			keyValueStorage({ [WORKOUT_DRAFT_MODE_STORAGE_KEY]: 'edit' })
		);
		assert.equal(restored.storage.editDraft?.workoutId, HISTORICAL_WORKOUT_ID);
		assert.equal(restored.storage.activeDraft?.workoutData.userBodyweight, 196);

		await writeEditDraft(sharedStorage, null);
		restored = loadWorkoutDraftStorage(sharedStorage, keyValueStorage());
		assert.equal(restored.storage.activeDraft?.workoutData.userBodyweight, 196);
	});

	it('preserves unreadable edit records when a stale owner cancels its edit', async () => {
		for (const unreadableRecord of [JSON.stringify({ version: 999, draft: { important: 'future edit' } }), '{bad']) {
			const storage = keyValueStorage();
			const editDraft = {
				workoutId: HISTORICAL_WORKOUT_ID,
				workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
				workoutExercises: [exercise('Historical squat')]
			};
			await writeEditDraft(storage, editDraft);
			const ownedEditRecord = loadWorkoutDraftStorage(storage, keyValueStorage()).records.edit;
			storage.setItem(WORKOUT_EDIT_DRAFT_STORAGE_KEY, unreadableRecord);

			const result = await saveEditWorkoutDraft(storage, ownedEditRecord, null);

			assert.equal(result.written, false);
			assert.equal(result.conflict, true);
			assert.equal(storage.getItem(WORKOUT_EDIT_DRAFT_STORAGE_KEY), unreadableRecord);
		}
	});

	it('preserves unreadable active records across repeated save and reset attempts', async () => {
		for (const unreadableRecord of [JSON.stringify({ version: 999, draft: { important: 'future active' } }), '{bad']) {
			const storage = keyValueStorage();
			await writeActiveDraft(storage, activeDraft());
			const ownedRecord = loadWorkoutDraftStorage(storage, keyValueStorage()).records.active;
			storage.setItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY, unreadableRecord);

			const saveResult = await saveActiveWorkoutDraft(storage, ownedRecord, {
				...activeDraft(),
				workoutData: workoutData('2026-08-03T17:00:00.000Z', 196)
			});
			const resetResult = await saveActiveWorkoutDraft(storage, saveResult.record, null);

			assert.equal(saveResult.written, false);
			assert.equal(saveResult.conflict, true);
			assert.equal(resetResult.written, false);
			assert.equal(resetResult.conflict, true);
			assert.equal(storage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY), unreadableRecord);
		}
	});

	it('preserves a future edit record after its storage event and repeated cancel or new attempts', async () => {
		const storage = keyValueStorage();
		const initialEdit = {
			workoutId: HISTORICAL_WORKOUT_ID,
			workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
			workoutExercises: [exercise('Historical squat')]
		};
		await writeEditDraft(storage, initialEdit);
		const records = loadWorkoutDraftStorage(storage, keyValueStorage()).records;
		const futureRecord = JSON.stringify({ version: 999, draft: { important: 'future edit' } });
		storage.setItem(WORKOUT_EDIT_DRAFT_STORAGE_KEY, futureRecord);
		const observed = applyWorkoutDraftStorageEvent(records, WORKOUT_EDIT_DRAFT_STORAGE_KEY, futureRecord);

		const cancelResult = await saveEditWorkoutDraft(storage, observed.edit, null);
		const newWorkoutResult = await saveEditWorkoutDraft(storage, cancelResult.record, null);

		assert.equal(cancelResult.written, false);
		assert.equal(newWorkoutResult.written, false);
		assert.equal(storage.getItem(WORKOUT_EDIT_DRAFT_STORAGE_KEY), futureRecord);
	});

	it('does not let a stale owner overwrite or delete a newer valid record', async () => {
		const storage = keyValueStorage();
		await writeActiveDraft(storage, activeDraft());
		const staleRecord = loadWorkoutDraftStorage(storage, keyValueStorage()).records.active;
		const newerDraft = {
			...activeDraft(),
			workoutData: workoutData('2026-08-03T17:00:00.000Z', 197)
		};
		await writeActiveDraft(storage, newerDraft);

		const staleSave = await saveActiveWorkoutDraft(storage, staleRecord, activeDraft());
		const staleReset = await saveActiveWorkoutDraft(storage, staleRecord, null);

		assert.equal(staleSave.written, false);
		assert.equal(staleReset.written, false);
		assert.equal(
			loadWorkoutDraftStorage(storage, keyValueStorage()).storage.activeDraft?.workoutData.userBodyweight,
			197
		);

		const initialEdit = {
			workoutId: HISTORICAL_WORKOUT_ID,
			workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
			workoutExercises: [exercise('Historical squat')]
		};
		await writeEditDraft(storage, initialEdit);
		const staleEditRecord = loadWorkoutDraftStorage(storage, keyValueStorage()).records.edit;
		const newerEdit = {
			...initialEdit,
			workoutId: NEWER_HISTORICAL_WORKOUT_ID,
			workoutData: completedWorkoutData('2026-07-02T17:00:00.000Z', 191)
		};
		await writeEditDraft(storage, newerEdit);

		const staleCancel = await saveEditWorkoutDraft(storage, staleEditRecord, null);

		assert.equal(staleCancel.written, false);
		assert.equal(
			loadWorkoutDraftStorage(storage, keyValueStorage({ [WORKOUT_DRAFT_MODE_STORAGE_KEY]: 'edit' })).storage.editDraft
				?.workoutId,
			NEWER_HISTORICAL_WORKOUT_ID
		);
	});

	it('fails closed without Web Locks and preserves every raw record byte-for-byte', async () => {
		const activeRaw = JSON.stringify({ version: WORKOUT_DRAFT_RECORD_VERSION, draft: activeDraft() });
		const editRaw = '{future edit bytes';
		const originGlobalRaw = '{unowned origin-global bytes';
		const storage = keyValueStorage({
			[WORKOUT_ACTIVE_DRAFT_STORAGE_KEY]: activeRaw,
			[WORKOUT_EDIT_DRAFT_STORAGE_KEY]: editRaw,
			[ORIGIN_GLOBAL_WORKOUT_DRAFT_STORAGE_KEY]: originGlobalRaw
		});
		const ownedRecord = loadWorkoutDraftStorage(storage).records.active;

		await assert.rejects(
			saveActiveWorkoutDraft(storage, ownedRecord, null, null),
			WorkoutDraftPersistenceUnavailableError
		);

		assert.equal(storage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY), activeRaw);
		assert.equal(storage.getItem(WORKOUT_EDIT_DRAFT_STORAGE_KEY), editRaw);
		assert.equal(storage.getItem(ORIGIN_GLOBAL_WORKOUT_DRAFT_STORAGE_KEY), originGlobalRaw);
	});

	it('does not migrate or claim scoped or origin-global legacy raw without Web Locks', async () => {
		const scopedLegacyRaw = JSON.stringify({
			workoutData: workoutData('2026-08-02T17:00:00.000Z', 195),
			workoutExercises: [exercise('Legacy bench press')],
			editingWorkoutId: null,
			previousWorkoutData: null
		});
		const originGlobalRaw = JSON.stringify({ private: 'another account draft' });
		const storage = keyValueStorage({
			[WORKOUT_DRAFT_STORAGE_KEY]: scopedLegacyRaw,
			[ORIGIN_GLOBAL_WORKOUT_DRAFT_STORAGE_KEY]: originGlobalRaw
		});
		const modeStorage = keyValueStorage({ [WORKOUT_DRAFT_MODE_STORAGE_KEY]: 'untouched-mode' });
		const loaded = loadWorkoutDraftStorage(storage, modeStorage);

		await assert.rejects(
			migrateWorkoutDraftStorage(storage, modeStorage, loaded, null),
			WorkoutDraftPersistenceUnavailableError
		);

		assert.equal(storage.getItem(WORKOUT_DRAFT_STORAGE_KEY), scopedLegacyRaw);
		assert.equal(storage.getItem(ORIGIN_GLOBAL_WORKOUT_DRAFT_STORAGE_KEY), originGlobalRaw);
		assert.equal(storage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY), null);
		assert.equal(storage.getItem(WORKOUT_EDIT_DRAFT_STORAGE_KEY), null);
		assert.equal(modeStorage.getItem(WORKOUT_DRAFT_MODE_STORAGE_KEY), 'untouched-mode');
	});

	it('storage events update only their draft and preserve the other mode', async () => {
		const initialEdit = {
			workoutId: HISTORICAL_WORKOUT_ID,
			workoutData: completedWorkoutData('2026-07-01T17:00:00.000Z', 190),
			workoutExercises: [exercise('Historical squat')]
		};
		const newerActive = {
			...activeDraft(),
			workoutData: workoutData('2026-08-03T17:00:00.000Z', 197)
		};
		const localStorage = keyValueStorage();
		await writeActiveDraft(localStorage, activeDraft());
		await writeEditDraft(localStorage, initialEdit);
		const current = loadWorkoutDraftStorage(localStorage, keyValueStorage()).records;
		await writeActiveDraft(localStorage, newerActive);

		let reconciled = applyWorkoutDraftStorageEvent(
			current,
			WORKOUT_ACTIVE_DRAFT_STORAGE_KEY,
			localStorage.getItem(WORKOUT_ACTIVE_DRAFT_STORAGE_KEY)
		);

		assert.equal(reconciled.active.draft?.workoutData.userBodyweight, 197);
		assert.equal(reconciled.edit.draft?.workoutId, HISTORICAL_WORKOUT_ID);

		const newerEdit = {
			workoutId: NEWER_HISTORICAL_WORKOUT_ID,
			workoutData: completedWorkoutData('2026-07-02T17:00:00.000Z', 191),
			workoutExercises: [exercise('Newer historical squat')]
		};
		await writeEditDraft(localStorage, newerEdit);
		reconciled = applyWorkoutDraftStorageEvent(
			reconciled,
			WORKOUT_EDIT_DRAFT_STORAGE_KEY,
			localStorage.getItem(WORKOUT_EDIT_DRAFT_STORAGE_KEY)
		);
		assert.equal(reconciled.active.draft?.workoutData.userBodyweight, 197);
		assert.equal(reconciled.edit.draft?.workoutId, NEWER_HISTORICAL_WORKOUT_ID);

		reconciled = applyWorkoutDraftStorageEvent(reconciled, WORKOUT_EDIT_DRAFT_STORAGE_KEY, null);
		assert.equal(reconciled.active.draft?.workoutData.userBodyweight, 197);
		assert.equal(reconciled.edit.draft, null);
	});
});
