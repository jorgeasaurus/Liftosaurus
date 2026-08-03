-- CreateIndex
CREATE INDEX "WorkoutOfMesocycle_mesocycleId_splitDayIndex_workoutId_idx" ON "WorkoutOfMesocycle"("mesocycleId", "splitDayIndex", "workoutId");

-- CreateIndex
CREATE INDEX "WorkoutExercise_workoutId_exerciseIndex_idx" ON "WorkoutExercise"("workoutId", "exerciseIndex");
