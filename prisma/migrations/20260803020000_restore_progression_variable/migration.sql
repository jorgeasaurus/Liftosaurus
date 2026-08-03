CREATE TYPE "ProgressionVariable" AS ENUM ('Reps', 'Load');

ALTER TABLE "Mesocycle"
ADD COLUMN "preferredProgressionVariable" "ProgressionVariable" NOT NULL DEFAULT 'Reps';

ALTER TABLE "MesocycleExerciseTemplate"
ADD COLUMN "preferredProgressionVariable" "ProgressionVariable";

ALTER TABLE "WorkoutExercise"
ADD COLUMN "preferredProgressionVariable" "ProgressionVariable";
