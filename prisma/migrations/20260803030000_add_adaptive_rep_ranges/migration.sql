-- CreateEnum
CREATE TYPE "RepRangeMode" AS ENUM ('Fixed', 'Adaptive');

-- AlterTable
ALTER TABLE "Mesocycle"
ADD COLUMN "repRangeMode" "RepRangeMode" NOT NULL DEFAULT 'Fixed';

-- AlterTable
ALTER TABLE "MesocycleExerciseTemplate"
ADD COLUMN "repRangeMode" "RepRangeMode",
ADD COLUMN "adaptiveRepRangeStart" INT4,
ADD COLUMN "adaptiveRepRangeEnd" INT4,
ADD COLUMN "adaptiveTopRepRangeStart" INT4,
ADD COLUMN "adaptiveTopRepRangeEnd" INT4,
ADD COLUMN "adaptiveRepRangeSourceId" STRING,
ADD COLUMN "adaptiveTopRepRangeSourceId" STRING,
ADD COLUMN "adaptiveRepRangeResetAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "WorkoutExercise"
ADD COLUMN "repRangeMode" "RepRangeMode",
ADD COLUMN "mesocycleExerciseTemplateId" STRING;

-- CreateIndex
CREATE INDEX "WorkoutExercise_mesocycleExerciseTemplateId_idx"
ON "WorkoutExercise"("mesocycleExerciseTemplateId");
