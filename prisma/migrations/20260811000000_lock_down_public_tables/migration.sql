-- Liftosaurus uses Prisma on the server for all application data access.
-- RLS blocks the Supabase Data API anon/authenticated roles.
-- The server service_role/database access is intentionally preserved.

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'Account',
    'ExerciseSplit',
    'ExerciseSplitDay',
    'ExerciseTemplate',
    'Mesocycle',
    'MesocycleCyclicSetChange',
    'MesocycleExerciseSplitDay',
    'MesocycleExerciseTemplate',
    'Session',
    'User',
    'UserSettings',
    'VerificationToken',
    'Workout',
    'WorkoutExercise',
    'WorkoutExerciseMiniSet',
    'WorkoutExerciseSet',
    'WorkoutOfMesocycle'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', table_name);
  END LOOP;
END
$$;

-- Prisma's migration history is operational metadata, not API data.
ALTER TABLE public."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."_prisma_migrations" FROM anon, authenticated;

-- Do not expose future tables created by the server to the public API roles.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;

-- service_role is not revoked. Prisma uses server-side database credentials.
-- The application uses server-side Prisma, so no public API policies are needed.
-- RLS therefore denies all Data API reads/writes for anon/authenticated.
