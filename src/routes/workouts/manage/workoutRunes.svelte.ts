import type { MesocycleExerciseTemplateWithoutIdsOrIndex } from '$lib/components/mesocycleAndExerciseSplit/commonTypes';
import {
	type WorkoutExerciseInProgress,
	createWorkoutExerciseInProgressFromMesocycleExerciseTemplate
} from '$lib/utils/workoutUtils';
import type { Prisma } from '@prisma/client';
import type { FullWorkoutWithMesoData } from '../[workoutId]/+page.server';
import {
	applyWorkoutDraftStorageEvent,
	createWorkoutEditDraft,
	emptyWorkoutDraftRecords,
	loadWorkoutDraftStorage,
	migrateWorkoutDraftStorage,
	saveActiveWorkoutDraft,
	saveEditWorkoutDraft,
	setWorkoutDraftMode,
	workoutDraftPersistenceAvailable,
	workoutDraftStorageKeys,
	type PreviousWorkoutData,
	type WorkoutData,
	type WorkoutDraft,
	type WorkoutDraftStorageKeys
} from './workoutDraftStorage';

export type { PreviousWorkoutData } from './workoutDraftStorage';

type SessionBinding = { userId: string; epoch: number; keys: WorkoutDraftStorageKeys };

class StaleWorkoutSessionError extends Error {}

function createWorkoutRunes() {
	let workoutData: WorkoutData | null = $state(null);
	let workoutExercises: WorkoutExerciseInProgress[] | null = $state(null);
	let editingWorkoutId: string | null = $state(null);
	let previousWorkoutData: PreviousWorkoutData | null = $state(null);
	let externalStorageRevision = $state(0);
	let persistenceUnavailable = $state(false);
	let persistenceConflict = $state(false);
	let draftRecords = emptyWorkoutDraftRecords();
	let storageReady = Promise.resolve();
	let mutationTail = Promise.resolve();
	let initializedUserId: string | null = null;
	let storageKeys: WorkoutDraftStorageKeys | null = null;
	let sessionEpoch = 0;

	let editingExerciseIndex: number | undefined = $state();
	let editingExercise: MesocycleExerciseTemplateWithoutIdsOrIndex | undefined = $state();

	let exerciseHistorySheetOpen = $state(false);
	let exerciseHistorySheetName: string | undefined = $state();
	let exerciseWarmUpDialogOpen = $state(false);
	let exerciseWarmUpDialogExercise: WorkoutExerciseInProgress | undefined = $state();

	function clearRuntimeState(userId: string | null) {
		initializedUserId = userId;
		storageKeys = userId === null ? null : workoutDraftStorageKeys(userId);
		workoutData = null;
		workoutExercises = null;
		editingWorkoutId = null;
		previousWorkoutData = null;
		externalStorageRevision = 0;
		persistenceUnavailable = false;
		persistenceConflict = false;
		draftRecords = emptyWorkoutDraftRecords();
		storageReady = Promise.resolve();
		mutationTail = Promise.resolve();
		editingExerciseIndex = undefined;
		editingExercise = undefined;
		exerciseHistorySheetOpen = false;
		exerciseHistorySheetName = undefined;
		exerciseWarmUpDialogOpen = false;
		exerciseWarmUpDialogExercise = undefined;
	}

	function isCurrent(binding: SessionBinding) {
		return initializedUserId === binding.userId && sessionEpoch === binding.epoch && storageKeys === binding.keys;
	}

	function bindSession(userId: string | null) {
		if (initializedUserId === userId && (userId === null || storageKeys !== null)) return;
		sessionEpoch += 1;
		clearRuntimeState(userId);
		if (userId === null || !globalThis.localStorage || !storageKeys) return;

		const binding: SessionBinding = { userId, epoch: sessionEpoch, keys: storageKeys };
		persistenceUnavailable = !workoutDraftPersistenceAvailable();

		const saved = loadWorkoutDraftStorage(localStorage, sessionStorage, binding.keys);
		draftRecords = saved.records;
		if (saved.storage.mode === 'edit' && draftRecords.edit.draft) {
			({ workoutData, workoutExercises } = draftRecords.edit.draft);
			previousWorkoutData = null;
			editingWorkoutId = draftRecords.edit.draft.workoutId;
		} else if (draftRecords.active.draft) {
			({ workoutData, workoutExercises, previousWorkoutData } = draftRecords.active.draft);
		}
		if (!persistenceUnavailable) {
			storageReady = migrateWorkoutDraftStorage(localStorage, sessionStorage, saved, binding.keys, undefined, () =>
				isCurrent(binding)
			)
				.then((migrated) => {
					if (!isCurrent(binding)) return;
					if (saved.status === 'migrated' && migrated.status === 'migrated') {
						if (draftRecords.active === saved.records.active)
							Object.assign(saved.records.active, migrated.records.active);
						if (draftRecords.edit === saved.records.edit) Object.assign(saved.records.edit, migrated.records.edit);
						return;
					}
					draftRecords = migrated.records;
					if (saved.status !== 'migrated') return;
					if (migrated.storage.mode === 'edit' && migrated.records.edit.draft) restoreEditDraft();
					else restoreActiveDraft();
					externalStorageRevision += 1;
				})
				.catch(() => {
					if (isCurrent(binding)) persistenceUnavailable = true;
				});
		}
	}

	function currentBinding(): SessionBinding | null {
		if (!initializedUserId || !storageKeys) return null;
		const binding = { userId: initializedUserId, epoch: sessionEpoch, keys: storageKeys };
		if (persistenceConflict) return null;
		if (persistenceUnavailable || !workoutDraftPersistenceAvailable()) {
			if (isCurrent(binding)) persistenceUnavailable = true;
			return null;
		}
		return binding;
	}

	function currentDraft(): WorkoutDraft | null {
		if (workoutData === null) return null;
		return { workoutData, workoutExercises, previousWorkoutData };
	}

	function enqueueMutation<T>(binding: SessionBinding, mutation: () => Promise<T>): Promise<T> {
		const previous = mutationTail;
		const ready = storageReady;
		const result = previous
			.then(() => ready)
			.then(() => {
				if (!isCurrent(binding)) throw new StaleWorkoutSessionError();
				return mutation();
			});
		mutationTail = result.then(
			() => undefined,
			() => undefined
		);
		return result;
	}

	function persistCurrentDraft() {
		if (!globalThis.localStorage) return Promise.resolve();
		const binding = currentBinding();
		if (!binding) return Promise.resolve();
		const { keys } = binding;
		const activeMode = editingWorkoutId === null;
		const requestedExternalRevision = externalStorageRevision;
		const draft = currentDraft();
		const activeDraft = activeMode && draft ? structuredClone($state.snapshot(draft)) : null;
		const editDraft =
			!activeMode && draft && workoutExercises
				? structuredClone(
						$state.snapshot({ workoutData: draft.workoutData, workoutExercises, workoutId: editingWorkoutId! })
					)
				: null;

		return enqueueMutation(binding, async () => {
			if (externalStorageRevision !== requestedExternalRevision) return;
			if (activeMode) {
				const previousActiveRecord = draftRecords.active;
				const result = await saveActiveWorkoutDraft(
					localStorage,
					previousActiveRecord,
					activeDraft,
					keys,
					undefined,
					() => isCurrent(binding)
				);
				if (!isCurrent(binding)) return;
				draftRecords.active = result.record;
				if (result.conflict) {
					persistenceConflict = true;
					return;
				}
				setWorkoutDraftMode(sessionStorage, keys, 'active');
				if (!result.written && result.record.raw !== previousActiveRecord.raw && result.record.ownsRaw) {
					restoreActiveDraft();
					externalStorageRevision += 1;
				}
				return;
			}

			const previousEditRecord = draftRecords.edit;
			const result = await saveEditWorkoutDraft(localStorage, previousEditRecord, editDraft, keys, undefined, () =>
				isCurrent(binding)
			);
			if (!isCurrent(binding)) return;
			draftRecords.edit = result.record;
			if (result.conflict) {
				persistenceConflict = true;
				return;
			}
			setWorkoutDraftMode(sessionStorage, keys, 'edit');
			if (!result.written && result.record.raw !== previousEditRecord.raw && result.record.ownsRaw) {
				restoreEditDraft();
				externalStorageRevision += 1;
			}
		}).catch((error) => {
			if (error instanceof StaleWorkoutSessionError || !isCurrent(binding)) return;
			persistenceUnavailable = true;
		});
	}

	function saveStoresToLocalStorage() {
		return persistCurrentDraft();
	}

	function restoreActiveDraft() {
		workoutData = draftRecords.active.draft?.workoutData ?? null;
		workoutExercises = draftRecords.active.draft?.workoutExercises ?? null;
		previousWorkoutData = draftRecords.active.draft?.previousWorkoutData ?? null;
		editingWorkoutId = null;
	}

	function restoreEditDraft() {
		const editDraft = draftRecords.edit.draft;
		if (!editDraft) {
			restoreActiveDraft();
			const binding = currentBinding();
			if (binding) setWorkoutDraftMode(sessionStorage, binding.keys, 'active');
			return;
		}
		editingWorkoutId = editDraft.workoutId;
		workoutData = editDraft.workoutData;
		workoutExercises = editDraft.workoutExercises;
		previousWorkoutData = null;
	}

	function cancelEdit(): Promise<string | null> {
		if (editingWorkoutId === null) return Promise.resolve(null);
		const canceledWorkoutId = editingWorkoutId;
		if (!globalThis.localStorage) {
			restoreActiveDraft();
			return Promise.resolve(canceledWorkoutId);
		}
		const binding = currentBinding();
		if (!binding) {
			restoreActiveDraft();
			return Promise.resolve(canceledWorkoutId);
		}
		const { keys } = binding;
		const requestedExternalRevision = externalStorageRevision;

		return enqueueMutation(binding, async () => {
			if (externalStorageRevision !== requestedExternalRevision) return null;
			const previousRecord = draftRecords.edit;
			const result = await saveEditWorkoutDraft(localStorage, previousRecord, null, keys, undefined, () =>
				isCurrent(binding)
			);
			if (!isCurrent(binding)) return null;
			draftRecords.edit = result.record;
			if (result.conflict) {
				persistenceConflict = true;
				return null;
			}
			if (!result.written && result.record.ownsRaw && result.record.draft) {
				restoreEditDraft();
				setWorkoutDraftMode(sessionStorage, keys, 'edit');
				externalStorageRevision += 1;
				return null;
			}
			restoreActiveDraft();
			setWorkoutDraftMode(sessionStorage, keys, 'active');
			return canceledWorkoutId;
		}).catch((error) => {
			if (error instanceof StaleWorkoutSessionError || !isCurrent(binding)) return null;
			persistenceUnavailable = true;
			restoreActiveDraft();
			return canceledWorkoutId;
		});
	}

	async function beginNewWorkout() {
		if (editingWorkoutId === null) return true;
		return (await cancelEdit()) !== null;
	}

	async function resetStores() {
		if (editingWorkoutId !== null) {
			await cancelEdit();
			return;
		}

		workoutData = null;
		workoutExercises = null;
		previousWorkoutData = null;
		await persistCurrentDraft();
	}

	function exerciseNameExists(exerciseName: string, exceptIndex?: number) {
		if (!workoutExercises) return;
		const exercise = workoutExercises.find((ex, idx) => ex.name === exerciseName && idx !== exceptIndex);
		return exercise !== undefined;
	}

	async function addExercise(exercise: MesocycleExerciseTemplateWithoutIdsOrIndex) {
		if (workoutExercises === null) return false;
		if (exerciseNameExists(exercise.name)) return false;
		workoutExercises.push(createWorkoutExerciseInProgressFromMesocycleExerciseTemplate(exercise));
		await saveStoresToLocalStorage();
		return true;
	}

	async function editExercise(exercise: MesocycleExerciseTemplateWithoutIdsOrIndex) {
		if (!editingExercise || editingExerciseIndex === undefined || workoutExercises === null) return false;
		if (exerciseNameExists(exercise.name, editingExerciseIndex)) return false;
		workoutExercises[editingExerciseIndex] = createWorkoutExerciseInProgressFromMesocycleExerciseTemplate(
			exercise,
			workoutExercises[editingExerciseIndex].sets
		);
		await saveStoresToLocalStorage();
		return true;
	}

	function setEditingExercise(exercise: WorkoutExerciseInProgress | undefined) {
		if (exercise === undefined) {
			editingExercise = undefined;
		} else {
			const { sets, ...restOfTheExercise } = exercise;
			editingExerciseIndex = workoutExercises?.findIndex((ex) => ex.name === exercise.name);
			editingExercise = { ...restOfTheExercise, sets: sets.length };
		}
	}

	async function deleteExercise(exerciseIdx: number) {
		if (workoutExercises === null) return;
		workoutExercises.splice(exerciseIdx, 1);
		await saveStoresToLocalStorage();
	}

	function openExerciseHistorySheet(exerciseName: string) {
		exerciseHistorySheetName = exerciseName;
		exerciseHistorySheetOpen = true;
	}

	function openExerciseWarmupDialog(exercise: WorkoutExerciseInProgress) {
		if (workoutExercises === null) return;
		exerciseWarmUpDialogOpen = true;
		exerciseWarmUpDialogExercise = exercise;
	}

	async function copyExerciseSetNumbersFromHistory(
		exerciseFromHistory: Prisma.WorkoutExerciseGetPayload<{
			include: { sets: { include: { miniSets: true } } };
		}>
	) {
		const exerciseToEdit = workoutExercises?.find((ex) => ex.name === exerciseHistorySheetName);
		if (!exerciseToEdit) return;

		for (let i = 0; i < exerciseToEdit.sets.length; i++) {
			if (!exerciseFromHistory.sets[i]) break;
			const { id, workoutExerciseId, setIndex, ...historySet } = exerciseFromHistory.sets[i];
			exerciseToEdit.sets[i] = {
				...historySet,
				completed: false,
				miniSets: historySet.miniSets.map((miniSet) => {
					const { id, workoutExerciseSetId, miniSetIndex, ...restOfTheMiniSet } = miniSet;
					return { ...restOfTheMiniSet, completed: false };
				})
			};
		}

		exerciseHistorySheetOpen = false;
		await saveStoresToLocalStorage();
	}

	function loadWorkout(workout: FullWorkoutWithMesoData) {
		const shouldSnapshotActive = editingWorkoutId === null;
		const currentActiveDraft = shouldSnapshotActive ? currentDraft() : null;
		const activeDraft = currentActiveDraft ? structuredClone($state.snapshot(currentActiveDraft)) : null;
		const editRecord = draftRecords.edit;
		const requestedExternalRevision = externalStorageRevision;
		const editDraft = createWorkoutEditDraft(workout);
		editingWorkoutId = editDraft.workoutId;
		workoutData = editDraft.workoutData;
		previousWorkoutData = null;
		workoutExercises = editDraft.workoutExercises;
		if (!globalThis.localStorage) return Promise.resolve();
		const binding = currentBinding();
		if (!binding) return Promise.resolve();
		const { keys } = binding;

		return enqueueMutation(binding, async () => {
			if (shouldSnapshotActive && globalThis.localStorage && externalStorageRevision === requestedExternalRevision) {
				const activeRecord = draftRecords.active;
				const result = await saveActiveWorkoutDraft(localStorage, activeRecord, activeDraft, keys, undefined, () =>
					isCurrent(binding)
				);
				if (!isCurrent(binding)) return;
				draftRecords.active = result.record;
				if (result.conflict) {
					persistenceConflict = true;
					return;
				}
			}
			const result = await saveEditWorkoutDraft(localStorage, editRecord, editDraft, keys, undefined, () =>
				isCurrent(binding)
			);
			if (!isCurrent(binding)) return;
			draftRecords.edit = result.record;
			if (result.conflict) {
				persistenceConflict = true;
				return;
			}
			if (!result.written && result.record.raw !== editRecord.raw && result.record.ownsRaw) {
				restoreEditDraft();
				externalStorageRevision += 1;
			}
			if (globalThis.sessionStorage) setWorkoutDraftMode(sessionStorage, keys, 'edit');
		}).catch((error) => {
			if (error instanceof StaleWorkoutSessionError || !isCurrent(binding)) return;
			persistenceUnavailable = true;
		});
	}

	if (globalThis.addEventListener) {
		globalThis.addEventListener('storage', (event) => {
			const keys = storageKeys;
			if (!keys || (event.key !== keys.active && event.key !== keys.edit)) return;
			const reconciled = applyWorkoutDraftStorageEvent(draftRecords, event.key, event.newValue, keys);
			const activeDraftChanged = reconciled.active.draft !== draftRecords.active.draft;
			const editDraftChanged = reconciled.edit.draft !== draftRecords.edit.draft;
			draftRecords = reconciled;

			if (event.key === keys.active && editingWorkoutId === null && activeDraftChanged) {
				restoreActiveDraft();
				externalStorageRevision += 1;
			} else if (event.key === keys.edit && editingWorkoutId !== null && editDraftChanged) {
				restoreEditDraft();
				externalStorageRevision += 1;
			}
		});
	}

	return {
		bindSession,
		get ownerUserId() {
			return initializedUserId;
		},
		get workoutData() {
			return workoutData;
		},
		set workoutData(value) {
			workoutData = value;
		},
		get workoutExercises() {
			return workoutExercises;
		},
		set workoutExercises(value) {
			workoutExercises = value;
		},
		get editingExercise() {
			return editingExercise;
		},
		set editingExercise(value) {
			editingExercise = value;
		},
		get editingWorkoutId() {
			return editingWorkoutId;
		},
		get externalStorageRevision() {
			return externalStorageRevision;
		},
		get persistenceUnavailable() {
			return persistenceUnavailable;
		},
		get persistenceConflict() {
			return persistenceConflict;
		},
		get previousWorkoutData() {
			return previousWorkoutData;
		},
		set previousWorkoutData(value) {
			previousWorkoutData = value;
		},
		get exerciseHistorySheetName() {
			return exerciseHistorySheetName;
		},
		set exerciseHistorySheetName(value) {
			exerciseHistorySheetName = value;
		},
		get exerciseHistorySheetOpen() {
			return exerciseHistorySheetOpen;
		},
		set exerciseHistorySheetOpen(value) {
			exerciseHistorySheetOpen = value;
		},
		get exerciseWarmUpDialogOpen() {
			return exerciseWarmUpDialogOpen;
		},
		set exerciseWarmUpDialogOpen(value) {
			exerciseWarmUpDialogOpen = value;
		},
		get exerciseWarmUpDialogExercise() {
			return exerciseWarmUpDialogExercise;
		},
		set exerciseWarmUpDialogExercise(value) {
			exerciseWarmUpDialogExercise = value;
		},
		saveStoresToLocalStorage,
		resetStores,
		addExercise,
		setEditingExercise,
		editExercise,
		deleteExercise,
		loadWorkout,
		openExerciseHistorySheet,
		openExerciseWarmupDialog,
		copyExerciseSetNumbersFromHistory,
		beginNewWorkout,
		cancelEdit
	};
}

export const workoutRunes = createWorkoutRunes();
