ALTER TABLE "Workout" ADD COLUMN "completionId" TEXT;

CREATE UNIQUE INDEX "Workout_userId_completionId_key" ON "Workout"("userId", "completionId");
