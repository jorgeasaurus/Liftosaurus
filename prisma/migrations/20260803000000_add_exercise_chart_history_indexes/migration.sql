CREATE INDEX "Workout_userId_startedAt_id_idx" ON "Workout"("userId", "startedAt", "id");

CREATE INDEX "WorkoutExercise_name_workoutId_id_idx" ON "WorkoutExercise"("name", "workoutId", "id");

CREATE INDEX "WorkoutExerciseSet_workoutExerciseId_setIndex_idx" ON "WorkoutExerciseSet"("workoutExerciseId", "setIndex");

CREATE INDEX "WorkoutExerciseMiniSet_workoutExerciseSetId_miniSetIndex_idx" ON "WorkoutExerciseMiniSet"("workoutExerciseSetId", "miniSetIndex");
