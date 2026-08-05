CREATE UNIQUE INDEX "Mesocycle_one_active_per_user"
ON "Mesocycle" ("userId")
WHERE "startDate" IS NOT NULL AND "endDate" IS NULL;
