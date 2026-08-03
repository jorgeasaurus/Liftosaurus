-- CreateIndex
CREATE INDEX "Workout_userId_startedAt_id_idx" ON "Workout"("userId", "startedAt", "id");

-- CreateIndex
CREATE INDEX "WorkoutOfMesocycle_mesocycleId_splitDayIndex_workoutId_idx" ON "WorkoutOfMesocycle"("mesocycleId", "splitDayIndex", "workoutId");

-- CreateIndex
CREATE INDEX "WorkoutExercise_workoutId_exerciseIndex_idx" ON "WorkoutExercise"("workoutId", "exerciseIndex");

-- CreateIndex
CREATE INDEX "WorkoutExerciseSet_workoutExerciseId_setIndex_idx" ON "WorkoutExerciseSet"("workoutExerciseId", "setIndex");

-- CreateIndex
CREATE INDEX "WorkoutExerciseMiniSet_workoutExerciseSetId_miniSetIndex_idx" ON "WorkoutExerciseMiniSet"("workoutExerciseSetId", "miniSetIndex");
