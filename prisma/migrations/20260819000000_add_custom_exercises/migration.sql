-- CreateTable
CREATE TABLE "CustomExercise" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameNormalized" TEXT NOT NULL,
    "targetMuscleGroup" "MuscleGroup" NOT NULL,
    "customMuscleGroup" TEXT,
    "bodyweightFraction" DOUBLE PRECISION,
    "setType" "SetType" NOT NULL DEFAULT 'Straight',
    "repRangeStart" INTEGER NOT NULL,
    "repRangeEnd" INTEGER NOT NULL,
    "changeType" "ChangeType",
    "changeAmount" DOUBLE PRECISION,
    "note" TEXT,
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
