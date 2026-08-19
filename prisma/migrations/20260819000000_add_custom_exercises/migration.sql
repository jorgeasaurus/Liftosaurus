-- CreateTable
CREATE TABLE "CustomExercise" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "name" STRING NOT NULL,
    "nameNormalized" STRING NOT NULL,
    "targetMuscleGroup" "MuscleGroup" NOT NULL,
    "customMuscleGroup" STRING,
    "bodyweightFraction" FLOAT8,
    "setType" "SetType" NOT NULL DEFAULT 'Straight',
    "repRangeStart" INT4 NOT NULL,
    "repRangeEnd" INT4 NOT NULL,
    "changeType" "ChangeType",
    "changeAmount" FLOAT8,
    "note" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomExercise_userId_idx" ON "CustomExercise"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomExercise_userId_nameNormalized_key" ON "CustomExercise"("userId", "nameNormalized");

-- AddForeignKey
ALTER TABLE "CustomExercise" ADD CONSTRAINT "CustomExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
