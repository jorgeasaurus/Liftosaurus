WITH "ActiveMesocycles" AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "userId"
            ORDER BY "startDate" DESC, "id" DESC
        ) AS "rowNumber"
    FROM "Mesocycle"
    WHERE "startDate" IS NOT NULL AND "endDate" IS NULL
)
UPDATE "Mesocycle"
SET "endDate" = "startDate"
WHERE "id" IN (
    SELECT "id"
    FROM "ActiveMesocycles"
    WHERE "rowNumber" > 1
);

CREATE UNIQUE INDEX "Mesocycle_one_active_per_user"
ON "Mesocycle" ("userId")
WHERE "startDate" IS NOT NULL AND "endDate" IS NULL;
