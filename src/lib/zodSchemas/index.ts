import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const ExerciseSplitScalarFieldEnumSchema = z.enum(['id','name','userId']);

export const ExerciseSplitDayScalarFieldEnumSchema = z.enum(['id','name','dayIndex','isRestDay','exerciseSplitId']);

export const ExerciseTemplateScalarFieldEnumSchema = z.enum(['id','name','exerciseIndex','targetMuscleGroup','customMuscleGroup','bodyweightFraction','setType','repRangeStart','repRangeEnd','changeType','changeAmount','note','exerciseSplitDayId','topRepRangeStart','topRepRangeEnd']);

export const MesocycleScalarFieldEnumSchema = z.enum(['id','name','userId','exerciseSplitId','RIRProgression','startDate','endDate','startOverloadPercentage','preferredProgressionVariable','repRangeMode','lastSetToFailure','forceRIRMatching']);

export const MesocycleCyclicSetChangeScalarFieldEnumSchema = z.enum(['id','mesocycleId','muscleGroup','customMuscleGroup','regardlessOfProgress','setIncreaseAmount','maxVolume']);

export const MesocycleExerciseSplitDayScalarFieldEnumSchema = z.enum(['id','name','dayIndex','isRestDay','mesocycleId']);

export const MesocycleExerciseTemplateScalarFieldEnumSchema = z.enum(['id','name','exerciseIndex','targetMuscleGroup','customMuscleGroup','bodyweightFraction','sets','setType','repRangeStart','repRangeEnd','changeType','changeAmount','note','mesocycleExerciseSplitDayId','overloadPercentage','lastSetToFailure','forceRIRMatching','minimumWeightChange','preferredProgressionVariable','repRangeMode','adaptiveRepRangeStart','adaptiveRepRangeEnd','adaptiveTopRepRangeStart','adaptiveTopRepRangeEnd','adaptiveRepRangeSourceId','adaptiveTopRepRangeSourceId','adaptiveRepRangeResetAt','topRepRangeStart','topRepRangeEnd']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','createdAt','updatedAt','migratedFromV2']);

export const AccountScalarFieldEnumSchema = z.enum(['userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state','createdAt','updatedAt']);

export const SessionScalarFieldEnumSchema = z.enum(['sessionToken','userId','expires','createdAt','updatedAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const UserSettingsScalarFieldEnumSchema = z.enum(['id','userId','motivationalQuotesEnabled','quotesDisplayModes']);

export const WorkoutOfMesocycleScalarFieldEnumSchema = z.enum(['id','workoutId','mesocycleId','splitDayIndex','workoutStatus']);

export const WorkoutScalarFieldEnumSchema = z.enum(['id','userBodyweight','startedAt','endedAt','userId','note']);

export const WorkoutExerciseScalarFieldEnumSchema = z.enum(['id','exerciseIndex','name','workoutId','targetMuscleGroup','customMuscleGroup','bodyweightFraction','setType','changeType','changeAmount','repRangeStart','repRangeEnd','note','overloadPercentage','lastSetToFailure','forceRIRMatching','minimumWeightChange','preferredProgressionVariable','repRangeMode','mesocycleExerciseTemplateId','topRepRangeStart','topRepRangeEnd','isDeload']);

export const WorkoutExerciseSetScalarFieldEnumSchema = z.enum(['id','setIndex','workoutExerciseId','reps','load','RIR','skipped']);

export const WorkoutExerciseMiniSetScalarFieldEnumSchema = z.enum(['id','miniSetIndex','reps','load','RIR','workoutExerciseSetId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const MuscleGroupSchema = z.enum(['Chest','FrontDelts','SideDelts','RearDelts','Lats','Traps','Triceps','Biceps','Forearms','Quads','Hamstrings','Glutes','Calves','Abs','Neck','Adductors','Abductors','Custom']);

export type MuscleGroupType = `${z.infer<typeof MuscleGroupSchema>}`

export const SetTypeSchema = z.enum(['Straight','V2','Drop','Down','Myorep','MyorepMatch','MyorepMatchDown','TopBackoff']);

export type SetTypeType = `${z.infer<typeof SetTypeSchema>}`

export const ChangeTypeSchema = z.enum(['Percentage','AbsoluteLoad']);

export type ChangeTypeType = `${z.infer<typeof ChangeTypeSchema>}`

export const ProgressionVariableSchema = z.enum(['Reps','Load']);

export type ProgressionVariableType = `${z.infer<typeof ProgressionVariableSchema>}`

export const RepRangeModeSchema = z.enum(['Fixed','Adaptive']);

export type RepRangeModeType = `${z.infer<typeof RepRangeModeSchema>}`

export const WorkoutStatusSchema = z.enum(['Skipped','RestDay']);

export type WorkoutStatusType = `${z.infer<typeof WorkoutStatusSchema>}`

export const QuotesDisplayModeSchema = z.enum(['PRE_WORKOUT','POST_WORKOUT','BETWEEN_SETS']);

export type QuotesDisplayModeType = `${z.infer<typeof QuotesDisplayModeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// EXERCISE SPLIT SCHEMA
/////////////////////////////////////////

export const ExerciseSplitSchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  userId: z.string(),
})

export type ExerciseSplit = z.infer<typeof ExerciseSplitSchema>

/////////////////////////////////////////
// EXERCISE SPLIT DAY SCHEMA
/////////////////////////////////////////

export const ExerciseSplitDaySchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  exerciseSplitId: z.string(),
})

export type ExerciseSplitDay = z.infer<typeof ExerciseSplitDaySchema>

/////////////////////////////////////////
// EXERCISE TEMPLATE SCHEMA
/////////////////////////////////////////

export const ExerciseTemplateSchema = z.object({
  targetMuscleGroup: MuscleGroupSchema,
  setType: SetTypeSchema,
  changeType: ChangeTypeSchema.nullable(),
  id: z.cuid2(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  customMuscleGroup: z.string().nullable(),
  bodyweightFraction: z.number().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeAmount: z.number().nullable(),
  note: z.string().nullable(),
  exerciseSplitDayId: z.string(),
  topRepRangeStart: z.number().int().nullable(),
  topRepRangeEnd: z.number().int().nullable(),
})

export type ExerciseTemplate = z.infer<typeof ExerciseTemplateSchema>

/////////////////////////////////////////
// MESOCYCLE SCHEMA
/////////////////////////////////////////

export const MesocycleSchema = z.object({
  preferredProgressionVariable: ProgressionVariableSchema,
  repRangeMode: RepRangeModeSchema,
  id: z.cuid2(),
  name: z.string(),
  userId: z.string(),
  exerciseSplitId: z.string().nullable(),
  RIRProgression: z.number().int().array(),
  startDate: z.coerce.date().nullable(),
  endDate: z.coerce.date().nullable(),
  startOverloadPercentage: z.number(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
})

export type Mesocycle = z.infer<typeof MesocycleSchema>

/////////////////////////////////////////
// MESOCYCLE CYCLIC SET CHANGE SCHEMA
/////////////////////////////////////////

export const MesocycleCyclicSetChangeSchema = z.object({
  muscleGroup: MuscleGroupSchema,
  id: z.cuid2(),
  mesocycleId: z.string(),
  customMuscleGroup: z.string().nullable(),
  regardlessOfProgress: z.boolean(),
  setIncreaseAmount: z.number().int(),
  maxVolume: z.number().int(),
})

export type MesocycleCyclicSetChange = z.infer<typeof MesocycleCyclicSetChangeSchema>

/////////////////////////////////////////
// MESOCYCLE EXERCISE SPLIT DAY SCHEMA
/////////////////////////////////////////

export const MesocycleExerciseSplitDaySchema = z.object({
  id: z.cuid2(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  mesocycleId: z.string(),
})

export type MesocycleExerciseSplitDay = z.infer<typeof MesocycleExerciseSplitDaySchema>

/////////////////////////////////////////
// MESOCYCLE EXERCISE TEMPLATE SCHEMA
/////////////////////////////////////////

export const MesocycleExerciseTemplateSchema = z.object({
  targetMuscleGroup: MuscleGroupSchema,
  setType: SetTypeSchema,
  changeType: ChangeTypeSchema.nullable(),
  preferredProgressionVariable: ProgressionVariableSchema.nullable(),
  repRangeMode: RepRangeModeSchema.nullable(),
  id: z.cuid2(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  customMuscleGroup: z.string().nullable(),
  bodyweightFraction: z.number().nullable(),
  sets: z.number().int(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeAmount: z.number().nullable(),
  note: z.string().nullable(),
  mesocycleExerciseSplitDayId: z.string(),
  overloadPercentage: z.number().nullable(),
  lastSetToFailure: z.boolean().nullable(),
  forceRIRMatching: z.boolean().nullable(),
  minimumWeightChange: z.number().nullable(),
  adaptiveRepRangeStart: z.number().int().nullable(),
  adaptiveRepRangeEnd: z.number().int().nullable(),
  adaptiveTopRepRangeStart: z.number().int().nullable(),
  adaptiveTopRepRangeEnd: z.number().int().nullable(),
  adaptiveRepRangeSourceId: z.string().nullable(),
  adaptiveTopRepRangeSourceId: z.string().nullable(),
  adaptiveRepRangeResetAt: z.coerce.date().nullable(),
  topRepRangeStart: z.number().int().nullable(),
  topRepRangeEnd: z.number().int().nullable(),
})

export type MesocycleExerciseTemplate = z.infer<typeof MesocycleExerciseTemplateSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.cuid2(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  migratedFromV2: z.boolean().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// USER SETTINGS SCHEMA
/////////////////////////////////////////

export const UserSettingsSchema = z.object({
  quotesDisplayModes: QuotesDisplayModeSchema.array(),
  id: z.cuid(),
  userId: z.string(),
  motivationalQuotesEnabled: z.boolean(),
})

export type UserSettings = z.infer<typeof UserSettingsSchema>

/////////////////////////////////////////
// WORKOUT OF MESOCYCLE SCHEMA
/////////////////////////////////////////

export const WorkoutOfMesocycleSchema = z.object({
  workoutStatus: WorkoutStatusSchema.nullable(),
  id: z.cuid2(),
  workoutId: z.string(),
  mesocycleId: z.string(),
  splitDayIndex: z.number().int(),
})

export type WorkoutOfMesocycle = z.infer<typeof WorkoutOfMesocycleSchema>

/////////////////////////////////////////
// WORKOUT SCHEMA
/////////////////////////////////////////

export const WorkoutSchema = z.object({
  id: z.cuid2(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  userId: z.string(),
  note: z.string().nullable(),
})

export type Workout = z.infer<typeof WorkoutSchema>

/////////////////////////////////////////
// WORKOUT EXERCISE SCHEMA
/////////////////////////////////////////

export const WorkoutExerciseSchema = z.object({
  targetMuscleGroup: MuscleGroupSchema,
  setType: SetTypeSchema,
  changeType: ChangeTypeSchema.nullable(),
  preferredProgressionVariable: ProgressionVariableSchema.nullable(),
  repRangeMode: RepRangeModeSchema.nullable(),
  id: z.cuid2(),
  exerciseIndex: z.number().int(),
  name: z.string(),
  workoutId: z.string(),
  customMuscleGroup: z.string().nullable(),
  bodyweightFraction: z.number().nullable(),
  changeAmount: z.number().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  note: z.string().nullable(),
  overloadPercentage: z.number().nullable(),
  lastSetToFailure: z.boolean().nullable(),
  forceRIRMatching: z.boolean().nullable(),
  minimumWeightChange: z.number().nullable(),
  mesocycleExerciseTemplateId: z.string().nullable(),
  topRepRangeStart: z.number().int().nullable(),
  topRepRangeEnd: z.number().int().nullable(),
  isDeload: z.boolean(),
})

export type WorkoutExercise = z.infer<typeof WorkoutExerciseSchema>

/////////////////////////////////////////
// WORKOUT EXERCISE SET SCHEMA
/////////////////////////////////////////

export const WorkoutExerciseSetSchema = z.object({
  id: z.cuid2(),
  setIndex: z.number().int(),
  workoutExerciseId: z.string(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  skipped: z.boolean(),
})

export type WorkoutExerciseSet = z.infer<typeof WorkoutExerciseSetSchema>

/////////////////////////////////////////
// WORKOUT EXERCISE MINI SET SCHEMA
/////////////////////////////////////////

export const WorkoutExerciseMiniSetSchema = z.object({
  id: z.cuid2(),
  miniSetIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  workoutExerciseSetId: z.string(),
})

export type WorkoutExerciseMiniSet = z.infer<typeof WorkoutExerciseMiniSetSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// EXERCISE SPLIT
//------------------------------------------------------

export const ExerciseSplitIncludeSchema: z.ZodType<Prisma.ExerciseSplitInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  exerciseSplitDays: z.union([z.boolean(),z.lazy(() => ExerciseSplitDayFindManyArgsSchema)]).optional(),
  usedByMesocycles: z.union([z.boolean(),z.lazy(() => MesocycleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExerciseSplitCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ExerciseSplitArgsSchema: z.ZodType<Prisma.ExerciseSplitDefaultArgs> = z.object({
  select: z.lazy(() => ExerciseSplitSelectSchema).optional(),
  include: z.lazy(() => ExerciseSplitIncludeSchema).optional(),
}).strict();

export const ExerciseSplitCountOutputTypeArgsSchema: z.ZodType<Prisma.ExerciseSplitCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ExerciseSplitCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ExerciseSplitCountOutputTypeSelectSchema: z.ZodType<Prisma.ExerciseSplitCountOutputTypeSelect> = z.object({
  exerciseSplitDays: z.boolean().optional(),
  usedByMesocycles: z.boolean().optional(),
}).strict();

export const ExerciseSplitSelectSchema: z.ZodType<Prisma.ExerciseSplitSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  exerciseSplitDays: z.union([z.boolean(),z.lazy(() => ExerciseSplitDayFindManyArgsSchema)]).optional(),
  usedByMesocycles: z.union([z.boolean(),z.lazy(() => MesocycleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExerciseSplitCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EXERCISE SPLIT DAY
//------------------------------------------------------

export const ExerciseSplitDayIncludeSchema: z.ZodType<Prisma.ExerciseSplitDayInclude> = z.object({
  exercises: z.union([z.boolean(),z.lazy(() => ExerciseTemplateFindManyArgsSchema)]).optional(),
  exerciseSplit: z.union([z.boolean(),z.lazy(() => ExerciseSplitArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExerciseSplitDayCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ExerciseSplitDayArgsSchema: z.ZodType<Prisma.ExerciseSplitDayDefaultArgs> = z.object({
  select: z.lazy(() => ExerciseSplitDaySelectSchema).optional(),
  include: z.lazy(() => ExerciseSplitDayIncludeSchema).optional(),
}).strict();

export const ExerciseSplitDayCountOutputTypeArgsSchema: z.ZodType<Prisma.ExerciseSplitDayCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ExerciseSplitDayCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ExerciseSplitDayCountOutputTypeSelectSchema: z.ZodType<Prisma.ExerciseSplitDayCountOutputTypeSelect> = z.object({
  exercises: z.boolean().optional(),
}).strict();

export const ExerciseSplitDaySelectSchema: z.ZodType<Prisma.ExerciseSplitDaySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  dayIndex: z.boolean().optional(),
  isRestDay: z.boolean().optional(),
  exerciseSplitId: z.boolean().optional(),
  exercises: z.union([z.boolean(),z.lazy(() => ExerciseTemplateFindManyArgsSchema)]).optional(),
  exerciseSplit: z.union([z.boolean(),z.lazy(() => ExerciseSplitArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExerciseSplitDayCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EXERCISE TEMPLATE
//------------------------------------------------------

export const ExerciseTemplateIncludeSchema: z.ZodType<Prisma.ExerciseTemplateInclude> = z.object({
  exerciseSplitDay: z.union([z.boolean(),z.lazy(() => ExerciseSplitDayArgsSchema)]).optional(),
}).strict();

export const ExerciseTemplateArgsSchema: z.ZodType<Prisma.ExerciseTemplateDefaultArgs> = z.object({
  select: z.lazy(() => ExerciseTemplateSelectSchema).optional(),
  include: z.lazy(() => ExerciseTemplateIncludeSchema).optional(),
}).strict();

export const ExerciseTemplateSelectSchema: z.ZodType<Prisma.ExerciseTemplateSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  exerciseIndex: z.boolean().optional(),
  targetMuscleGroup: z.boolean().optional(),
  customMuscleGroup: z.boolean().optional(),
  bodyweightFraction: z.boolean().optional(),
  setType: z.boolean().optional(),
  repRangeStart: z.boolean().optional(),
  repRangeEnd: z.boolean().optional(),
  changeType: z.boolean().optional(),
  changeAmount: z.boolean().optional(),
  note: z.boolean().optional(),
  exerciseSplitDayId: z.boolean().optional(),
  topRepRangeStart: z.boolean().optional(),
  topRepRangeEnd: z.boolean().optional(),
  exerciseSplitDay: z.union([z.boolean(),z.lazy(() => ExerciseSplitDayArgsSchema)]).optional(),
}).strict()

// MESOCYCLE
//------------------------------------------------------

export const MesocycleIncludeSchema: z.ZodType<Prisma.MesocycleInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  exerciseSplit: z.union([z.boolean(),z.lazy(() => ExerciseSplitArgsSchema)]).optional(),
  mesocycleExerciseSplitDays: z.union([z.boolean(),z.lazy(() => MesocycleExerciseSplitDayFindManyArgsSchema)]).optional(),
  mesocycleCyclicSetChanges: z.union([z.boolean(),z.lazy(() => MesocycleCyclicSetChangeFindManyArgsSchema)]).optional(),
  workoutsOfMesocycle: z.union([z.boolean(),z.lazy(() => WorkoutOfMesocycleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MesocycleCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const MesocycleArgsSchema: z.ZodType<Prisma.MesocycleDefaultArgs> = z.object({
  select: z.lazy(() => MesocycleSelectSchema).optional(),
  include: z.lazy(() => MesocycleIncludeSchema).optional(),
}).strict();

export const MesocycleCountOutputTypeArgsSchema: z.ZodType<Prisma.MesocycleCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MesocycleCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MesocycleCountOutputTypeSelectSchema: z.ZodType<Prisma.MesocycleCountOutputTypeSelect> = z.object({
  mesocycleExerciseSplitDays: z.boolean().optional(),
  mesocycleCyclicSetChanges: z.boolean().optional(),
  workoutsOfMesocycle: z.boolean().optional(),
}).strict();

export const MesocycleSelectSchema: z.ZodType<Prisma.MesocycleSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  userId: z.boolean().optional(),
  exerciseSplitId: z.boolean().optional(),
  RIRProgression: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  startOverloadPercentage: z.boolean().optional(),
  preferredProgressionVariable: z.boolean().optional(),
  repRangeMode: z.boolean().optional(),
  lastSetToFailure: z.boolean().optional(),
  forceRIRMatching: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  exerciseSplit: z.union([z.boolean(),z.lazy(() => ExerciseSplitArgsSchema)]).optional(),
  mesocycleExerciseSplitDays: z.union([z.boolean(),z.lazy(() => MesocycleExerciseSplitDayFindManyArgsSchema)]).optional(),
  mesocycleCyclicSetChanges: z.union([z.boolean(),z.lazy(() => MesocycleCyclicSetChangeFindManyArgsSchema)]).optional(),
  workoutsOfMesocycle: z.union([z.boolean(),z.lazy(() => WorkoutOfMesocycleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MesocycleCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MESOCYCLE CYCLIC SET CHANGE
//------------------------------------------------------

export const MesocycleCyclicSetChangeIncludeSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeInclude> = z.object({
  mesocycle: z.union([z.boolean(),z.lazy(() => MesocycleArgsSchema)]).optional(),
}).strict();

export const MesocycleCyclicSetChangeArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeDefaultArgs> = z.object({
  select: z.lazy(() => MesocycleCyclicSetChangeSelectSchema).optional(),
  include: z.lazy(() => MesocycleCyclicSetChangeIncludeSchema).optional(),
}).strict();

export const MesocycleCyclicSetChangeSelectSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeSelect> = z.object({
  id: z.boolean().optional(),
  mesocycleId: z.boolean().optional(),
  muscleGroup: z.boolean().optional(),
  customMuscleGroup: z.boolean().optional(),
  regardlessOfProgress: z.boolean().optional(),
  setIncreaseAmount: z.boolean().optional(),
  maxVolume: z.boolean().optional(),
  mesocycle: z.union([z.boolean(),z.lazy(() => MesocycleArgsSchema)]).optional(),
}).strict()

// MESOCYCLE EXERCISE SPLIT DAY
//------------------------------------------------------

export const MesocycleExerciseSplitDayIncludeSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayInclude> = z.object({
  mesocycle: z.union([z.boolean(),z.lazy(() => MesocycleArgsSchema)]).optional(),
  mesocycleSplitDayExercises: z.union([z.boolean(),z.lazy(() => MesocycleExerciseTemplateFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MesocycleExerciseSplitDayCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const MesocycleExerciseSplitDayArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayDefaultArgs> = z.object({
  select: z.lazy(() => MesocycleExerciseSplitDaySelectSchema).optional(),
  include: z.lazy(() => MesocycleExerciseSplitDayIncludeSchema).optional(),
}).strict();

export const MesocycleExerciseSplitDayCountOutputTypeArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MesocycleExerciseSplitDayCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MesocycleExerciseSplitDayCountOutputTypeSelectSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCountOutputTypeSelect> = z.object({
  mesocycleSplitDayExercises: z.boolean().optional(),
}).strict();

export const MesocycleExerciseSplitDaySelectSchema: z.ZodType<Prisma.MesocycleExerciseSplitDaySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  dayIndex: z.boolean().optional(),
  isRestDay: z.boolean().optional(),
  mesocycleId: z.boolean().optional(),
  mesocycle: z.union([z.boolean(),z.lazy(() => MesocycleArgsSchema)]).optional(),
  mesocycleSplitDayExercises: z.union([z.boolean(),z.lazy(() => MesocycleExerciseTemplateFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MesocycleExerciseSplitDayCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MESOCYCLE EXERCISE TEMPLATE
//------------------------------------------------------

export const MesocycleExerciseTemplateIncludeSchema: z.ZodType<Prisma.MesocycleExerciseTemplateInclude> = z.object({
  mesocycleExerciseSplitDay: z.union([z.boolean(),z.lazy(() => MesocycleExerciseSplitDayArgsSchema)]).optional(),
}).strict();

export const MesocycleExerciseTemplateArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateDefaultArgs> = z.object({
  select: z.lazy(() => MesocycleExerciseTemplateSelectSchema).optional(),
  include: z.lazy(() => MesocycleExerciseTemplateIncludeSchema).optional(),
}).strict();

export const MesocycleExerciseTemplateSelectSchema: z.ZodType<Prisma.MesocycleExerciseTemplateSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  exerciseIndex: z.boolean().optional(),
  targetMuscleGroup: z.boolean().optional(),
  customMuscleGroup: z.boolean().optional(),
  bodyweightFraction: z.boolean().optional(),
  sets: z.boolean().optional(),
  setType: z.boolean().optional(),
  repRangeStart: z.boolean().optional(),
  repRangeEnd: z.boolean().optional(),
  changeType: z.boolean().optional(),
  changeAmount: z.boolean().optional(),
  note: z.boolean().optional(),
  mesocycleExerciseSplitDayId: z.boolean().optional(),
  overloadPercentage: z.boolean().optional(),
  lastSetToFailure: z.boolean().optional(),
  forceRIRMatching: z.boolean().optional(),
  minimumWeightChange: z.boolean().optional(),
  preferredProgressionVariable: z.boolean().optional(),
  repRangeMode: z.boolean().optional(),
  adaptiveRepRangeStart: z.boolean().optional(),
  adaptiveRepRangeEnd: z.boolean().optional(),
  adaptiveTopRepRangeStart: z.boolean().optional(),
  adaptiveTopRepRangeEnd: z.boolean().optional(),
  adaptiveRepRangeSourceId: z.boolean().optional(),
  adaptiveTopRepRangeSourceId: z.boolean().optional(),
  adaptiveRepRangeResetAt: z.boolean().optional(),
  topRepRangeStart: z.boolean().optional(),
  topRepRangeEnd: z.boolean().optional(),
  mesocycleExerciseSplitDay: z.union([z.boolean(),z.lazy(() => MesocycleExerciseSplitDayArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  exerciseSplits: z.union([z.boolean(),z.lazy(() => ExerciseSplitFindManyArgsSchema)]).optional(),
  mesocycles: z.union([z.boolean(),z.lazy(() => MesocycleFindManyArgsSchema)]).optional(),
  workouts: z.union([z.boolean(),z.lazy(() => WorkoutFindManyArgsSchema)]).optional(),
  settings: z.union([z.boolean(),z.lazy(() => UserSettingsArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  accounts: z.boolean().optional(),
  sessions: z.boolean().optional(),
  exerciseSplits: z.boolean().optional(),
  mesocycles: z.boolean().optional(),
  workouts: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  migratedFromV2: z.boolean().optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  exerciseSplits: z.union([z.boolean(),z.lazy(() => ExerciseSplitFindManyArgsSchema)]).optional(),
  mesocycles: z.union([z.boolean(),z.lazy(() => MesocycleFindManyArgsSchema)]).optional(),
  workouts: z.union([z.boolean(),z.lazy(() => WorkoutFindManyArgsSchema)]).optional(),
  settings: z.union([z.boolean(),z.lazy(() => UserSettingsArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  provider: z.boolean().optional(),
  providerAccountId: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  access_token: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  token_type: z.boolean().optional(),
  scope: z.boolean().optional(),
  id_token: z.boolean().optional(),
  session_state: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> = z.object({
  identifier: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict()

// USER SETTINGS
//------------------------------------------------------

export const UserSettingsIncludeSchema: z.ZodType<Prisma.UserSettingsInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const UserSettingsArgsSchema: z.ZodType<Prisma.UserSettingsDefaultArgs> = z.object({
  select: z.lazy(() => UserSettingsSelectSchema).optional(),
  include: z.lazy(() => UserSettingsIncludeSchema).optional(),
}).strict();

export const UserSettingsSelectSchema: z.ZodType<Prisma.UserSettingsSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  motivationalQuotesEnabled: z.boolean().optional(),
  quotesDisplayModes: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// WORKOUT OF MESOCYCLE
//------------------------------------------------------

export const WorkoutOfMesocycleIncludeSchema: z.ZodType<Prisma.WorkoutOfMesocycleInclude> = z.object({
  workout: z.union([z.boolean(),z.lazy(() => WorkoutArgsSchema)]).optional(),
  mesocycle: z.union([z.boolean(),z.lazy(() => MesocycleArgsSchema)]).optional(),
}).strict();

export const WorkoutOfMesocycleArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutOfMesocycleSelectSchema).optional(),
  include: z.lazy(() => WorkoutOfMesocycleIncludeSchema).optional(),
}).strict();

export const WorkoutOfMesocycleSelectSchema: z.ZodType<Prisma.WorkoutOfMesocycleSelect> = z.object({
  id: z.boolean().optional(),
  workoutId: z.boolean().optional(),
  mesocycleId: z.boolean().optional(),
  splitDayIndex: z.boolean().optional(),
  workoutStatus: z.boolean().optional(),
  workout: z.union([z.boolean(),z.lazy(() => WorkoutArgsSchema)]).optional(),
  mesocycle: z.union([z.boolean(),z.lazy(() => MesocycleArgsSchema)]).optional(),
}).strict()

// WORKOUT
//------------------------------------------------------

export const WorkoutIncludeSchema: z.ZodType<Prisma.WorkoutInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  workoutOfMesocycle: z.union([z.boolean(),z.lazy(() => WorkoutOfMesocycleArgsSchema)]).optional(),
  workoutExercises: z.union([z.boolean(),z.lazy(() => WorkoutExerciseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const WorkoutArgsSchema: z.ZodType<Prisma.WorkoutDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutSelectSchema).optional(),
  include: z.lazy(() => WorkoutIncludeSchema).optional(),
}).strict();

export const WorkoutCountOutputTypeArgsSchema: z.ZodType<Prisma.WorkoutCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WorkoutCountOutputTypeSelectSchema: z.ZodType<Prisma.WorkoutCountOutputTypeSelect> = z.object({
  workoutExercises: z.boolean().optional(),
}).strict();

export const WorkoutSelectSchema: z.ZodType<Prisma.WorkoutSelect> = z.object({
  id: z.boolean().optional(),
  userBodyweight: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  endedAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  note: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  workoutOfMesocycle: z.union([z.boolean(),z.lazy(() => WorkoutOfMesocycleArgsSchema)]).optional(),
  workoutExercises: z.union([z.boolean(),z.lazy(() => WorkoutExerciseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WORKOUT EXERCISE
//------------------------------------------------------

export const WorkoutExerciseIncludeSchema: z.ZodType<Prisma.WorkoutExerciseInclude> = z.object({
  workout: z.union([z.boolean(),z.lazy(() => WorkoutArgsSchema)]).optional(),
  sets: z.union([z.boolean(),z.lazy(() => WorkoutExerciseSetFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutExerciseCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const WorkoutExerciseArgsSchema: z.ZodType<Prisma.WorkoutExerciseDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutExerciseSelectSchema).optional(),
  include: z.lazy(() => WorkoutExerciseIncludeSchema).optional(),
}).strict();

export const WorkoutExerciseCountOutputTypeArgsSchema: z.ZodType<Prisma.WorkoutExerciseCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutExerciseCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WorkoutExerciseCountOutputTypeSelectSchema: z.ZodType<Prisma.WorkoutExerciseCountOutputTypeSelect> = z.object({
  sets: z.boolean().optional(),
}).strict();

export const WorkoutExerciseSelectSchema: z.ZodType<Prisma.WorkoutExerciseSelect> = z.object({
  id: z.boolean().optional(),
  exerciseIndex: z.boolean().optional(),
  name: z.boolean().optional(),
  workoutId: z.boolean().optional(),
  targetMuscleGroup: z.boolean().optional(),
  customMuscleGroup: z.boolean().optional(),
  bodyweightFraction: z.boolean().optional(),
  setType: z.boolean().optional(),
  changeType: z.boolean().optional(),
  changeAmount: z.boolean().optional(),
  repRangeStart: z.boolean().optional(),
  repRangeEnd: z.boolean().optional(),
  note: z.boolean().optional(),
  overloadPercentage: z.boolean().optional(),
  lastSetToFailure: z.boolean().optional(),
  forceRIRMatching: z.boolean().optional(),
  minimumWeightChange: z.boolean().optional(),
  preferredProgressionVariable: z.boolean().optional(),
  repRangeMode: z.boolean().optional(),
  mesocycleExerciseTemplateId: z.boolean().optional(),
  topRepRangeStart: z.boolean().optional(),
  topRepRangeEnd: z.boolean().optional(),
  isDeload: z.boolean().optional(),
  workout: z.union([z.boolean(),z.lazy(() => WorkoutArgsSchema)]).optional(),
  sets: z.union([z.boolean(),z.lazy(() => WorkoutExerciseSetFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutExerciseCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WORKOUT EXERCISE SET
//------------------------------------------------------

export const WorkoutExerciseSetIncludeSchema: z.ZodType<Prisma.WorkoutExerciseSetInclude> = z.object({
  workoutExercise: z.union([z.boolean(),z.lazy(() => WorkoutExerciseArgsSchema)]).optional(),
  miniSets: z.union([z.boolean(),z.lazy(() => WorkoutExerciseMiniSetFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutExerciseSetCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const WorkoutExerciseSetArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutExerciseSetSelectSchema).optional(),
  include: z.lazy(() => WorkoutExerciseSetIncludeSchema).optional(),
}).strict();

export const WorkoutExerciseSetCountOutputTypeArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutExerciseSetCountOutputTypeSelectSchema).nullish(),
}).strict();

export const WorkoutExerciseSetCountOutputTypeSelectSchema: z.ZodType<Prisma.WorkoutExerciseSetCountOutputTypeSelect> = z.object({
  miniSets: z.boolean().optional(),
}).strict();

export const WorkoutExerciseSetSelectSchema: z.ZodType<Prisma.WorkoutExerciseSetSelect> = z.object({
  id: z.boolean().optional(),
  setIndex: z.boolean().optional(),
  workoutExerciseId: z.boolean().optional(),
  reps: z.boolean().optional(),
  load: z.boolean().optional(),
  RIR: z.boolean().optional(),
  skipped: z.boolean().optional(),
  workoutExercise: z.union([z.boolean(),z.lazy(() => WorkoutExerciseArgsSchema)]).optional(),
  miniSets: z.union([z.boolean(),z.lazy(() => WorkoutExerciseMiniSetFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => WorkoutExerciseSetCountOutputTypeArgsSchema)]).optional(),
}).strict()

// WORKOUT EXERCISE MINI SET
//------------------------------------------------------

export const WorkoutExerciseMiniSetIncludeSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetInclude> = z.object({
  parentSet: z.union([z.boolean(),z.lazy(() => WorkoutExerciseSetArgsSchema)]).optional(),
}).strict();

export const WorkoutExerciseMiniSetArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetDefaultArgs> = z.object({
  select: z.lazy(() => WorkoutExerciseMiniSetSelectSchema).optional(),
  include: z.lazy(() => WorkoutExerciseMiniSetIncludeSchema).optional(),
}).strict();

export const WorkoutExerciseMiniSetSelectSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetSelect> = z.object({
  id: z.boolean().optional(),
  miniSetIndex: z.boolean().optional(),
  reps: z.boolean().optional(),
  load: z.boolean().optional(),
  RIR: z.boolean().optional(),
  workoutExerciseSetId: z.boolean().optional(),
  parentSet: z.union([z.boolean(),z.lazy(() => WorkoutExerciseSetArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ExerciseSplitWhereInputSchema: z.ZodType<Prisma.ExerciseSplitWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseSplitWhereInputSchema), z.lazy(() => ExerciseSplitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseSplitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseSplitWhereInputSchema), z.lazy(() => ExerciseSplitWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayListRelationFilterSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleListRelationFilterSchema).optional(),
});

export const ExerciseSplitOrderByWithRelationInputSchema: z.ZodType<Prisma.ExerciseSplitOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayOrderByRelationAggregateInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleOrderByRelationAggregateInputSchema).optional(),
});

export const ExerciseSplitWhereUniqueInputSchema: z.ZodType<Prisma.ExerciseSplitWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => ExerciseSplitWhereInputSchema), z.lazy(() => ExerciseSplitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseSplitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseSplitWhereInputSchema), z.lazy(() => ExerciseSplitWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayListRelationFilterSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleListRelationFilterSchema).optional(),
}));

export const ExerciseSplitOrderByWithAggregationInputSchema: z.ZodType<Prisma.ExerciseSplitOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ExerciseSplitCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ExerciseSplitMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ExerciseSplitMinOrderByAggregateInputSchema).optional(),
});

export const ExerciseSplitScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ExerciseSplitScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseSplitScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseSplitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseSplitScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseSplitScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseSplitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ExerciseSplitDayWhereInputSchema: z.ZodType<Prisma.ExerciseSplitDayWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseSplitDayWhereInputSchema), z.lazy(() => ExerciseSplitDayWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseSplitDayWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseSplitDayWhereInputSchema), z.lazy(() => ExerciseSplitDayWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  dayIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isRestDay: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  exerciseSplitId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exercises: z.lazy(() => ExerciseTemplateListRelationFilterSchema).optional(),
  exerciseSplit: z.union([ z.lazy(() => ExerciseSplitScalarRelationFilterSchema), z.lazy(() => ExerciseSplitWhereInputSchema) ]).optional(),
});

export const ExerciseSplitDayOrderByWithRelationInputSchema: z.ZodType<Prisma.ExerciseSplitDayOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.lazy(() => SortOrderSchema).optional(),
  exercises: z.lazy(() => ExerciseTemplateOrderByRelationAggregateInputSchema).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitOrderByWithRelationInputSchema).optional(),
});

export const ExerciseSplitDayWhereUniqueInputSchema: z.ZodType<Prisma.ExerciseSplitDayWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => ExerciseSplitDayWhereInputSchema), z.lazy(() => ExerciseSplitDayWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseSplitDayWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseSplitDayWhereInputSchema), z.lazy(() => ExerciseSplitDayWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  dayIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  isRestDay: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  exerciseSplitId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exercises: z.lazy(() => ExerciseTemplateListRelationFilterSchema).optional(),
  exerciseSplit: z.union([ z.lazy(() => ExerciseSplitScalarRelationFilterSchema), z.lazy(() => ExerciseSplitWhereInputSchema) ]).optional(),
}));

export const ExerciseSplitDayOrderByWithAggregationInputSchema: z.ZodType<Prisma.ExerciseSplitDayOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ExerciseSplitDayCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ExerciseSplitDayAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ExerciseSplitDayMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ExerciseSplitDayMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ExerciseSplitDaySumOrderByAggregateInputSchema).optional(),
});

export const ExerciseSplitDayScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ExerciseSplitDayScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseSplitDayScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseSplitDayScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseSplitDayScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseSplitDayScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseSplitDayScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  dayIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  isRestDay: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  exerciseSplitId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ExerciseTemplateWhereInputSchema: z.ZodType<Prisma.ExerciseTemplateWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseTemplateWhereInputSchema), z.lazy(() => ExerciseTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseTemplateWhereInputSchema), z.lazy(() => ExerciseTemplateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  setType: z.union([ z.lazy(() => EnumSetTypeFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  repRangeStart: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  exerciseSplitDayId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  exerciseSplitDay: z.union([ z.lazy(() => ExerciseSplitDayScalarRelationFilterSchema), z.lazy(() => ExerciseSplitDayWhereInputSchema) ]).optional(),
});

export const ExerciseTemplateOrderByWithRelationInputSchema: z.ZodType<Prisma.ExerciseTemplateOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  bodyweightFraction: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  changeAmount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  exerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  exerciseSplitDay: z.lazy(() => ExerciseSplitDayOrderByWithRelationInputSchema).optional(),
});

export const ExerciseTemplateWhereUniqueInputSchema: z.ZodType<Prisma.ExerciseTemplateWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => ExerciseTemplateWhereInputSchema), z.lazy(() => ExerciseTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseTemplateWhereInputSchema), z.lazy(() => ExerciseTemplateWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  setType: z.union([ z.lazy(() => EnumSetTypeFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  repRangeStart: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  exerciseSplitDayId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  exerciseSplitDay: z.union([ z.lazy(() => ExerciseSplitDayScalarRelationFilterSchema), z.lazy(() => ExerciseSplitDayWhereInputSchema) ]).optional(),
}));

export const ExerciseTemplateOrderByWithAggregationInputSchema: z.ZodType<Prisma.ExerciseTemplateOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  bodyweightFraction: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  changeAmount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  exerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ExerciseTemplateCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ExerciseTemplateAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ExerciseTemplateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ExerciseTemplateMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ExerciseTemplateSumOrderByAggregateInputSchema).optional(),
});

export const ExerciseTemplateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ExerciseTemplateScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseTemplateScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseTemplateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseTemplateScalarWhereWithAggregatesInputSchema), z.lazy(() => ExerciseTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupWithAggregatesFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  setType: z.union([ z.lazy(() => EnumSetTypeWithAggregatesFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  repRangeStart: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableWithAggregatesFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  exerciseSplitDayId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const MesocycleWhereInputSchema: z.ZodType<Prisma.MesocycleWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleWhereInputSchema), z.lazy(() => MesocycleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleWhereInputSchema), z.lazy(() => MesocycleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseSplitId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  RIRProgression: z.lazy(() => IntNullableListFilterSchema).optional(),
  startDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  endDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional(),
  lastSetToFailure: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  forceRIRMatching: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  exerciseSplit: z.union([ z.lazy(() => ExerciseSplitNullableScalarRelationFilterSchema), z.lazy(() => ExerciseSplitWhereInputSchema) ]).optional().nullable(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayListRelationFilterSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeListRelationFilterSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleListRelationFilterSchema).optional(),
});

export const MesocycleOrderByWithRelationInputSchema: z.ZodType<Prisma.MesocycleOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  RIRProgression: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  endDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  startOverloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitOrderByWithRelationInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayOrderByRelationAggregateInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeOrderByRelationAggregateInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleOrderByRelationAggregateInputSchema).optional(),
});

export const MesocycleWhereUniqueInputSchema: z.ZodType<Prisma.MesocycleWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => MesocycleWhereInputSchema), z.lazy(() => MesocycleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleWhereInputSchema), z.lazy(() => MesocycleWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseSplitId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  RIRProgression: z.lazy(() => IntNullableListFilterSchema).optional(),
  startDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  endDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional(),
  lastSetToFailure: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  forceRIRMatching: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  exerciseSplit: z.union([ z.lazy(() => ExerciseSplitNullableScalarRelationFilterSchema), z.lazy(() => ExerciseSplitWhereInputSchema) ]).optional().nullable(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayListRelationFilterSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeListRelationFilterSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleListRelationFilterSchema).optional(),
}));

export const MesocycleOrderByWithAggregationInputSchema: z.ZodType<Prisma.MesocycleOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  RIRProgression: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  endDate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  startOverloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MesocycleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MesocycleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MesocycleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MesocycleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MesocycleSumOrderByAggregateInputSchema).optional(),
});

export const MesocycleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MesocycleScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleScalarWhereWithAggregatesInputSchema), z.lazy(() => MesocycleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleScalarWhereWithAggregatesInputSchema), z.lazy(() => MesocycleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  exerciseSplitId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  RIRProgression: z.lazy(() => IntNullableListFilterSchema).optional(),
  startDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  endDate: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableWithAggregatesFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeWithAggregatesFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional(),
  lastSetToFailure: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  forceRIRMatching: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
});

export const MesocycleCyclicSetChangeWhereInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  muscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  setIncreaseAmount: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  maxVolume: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  mesocycle: z.union([ z.lazy(() => MesocycleScalarRelationFilterSchema), z.lazy(() => MesocycleWhereInputSchema) ]).optional(),
});

export const MesocycleCyclicSetChangeOrderByWithRelationInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  regardlessOfProgress: z.lazy(() => SortOrderSchema).optional(),
  setIncreaseAmount: z.lazy(() => SortOrderSchema).optional(),
  maxVolume: z.lazy(() => SortOrderSchema).optional(),
  mesocycle: z.lazy(() => MesocycleOrderByWithRelationInputSchema).optional(),
});

export const MesocycleCyclicSetChangeWhereUniqueInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema).array() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  muscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  setIncreaseAmount: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  maxVolume: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  mesocycle: z.union([ z.lazy(() => MesocycleScalarRelationFilterSchema), z.lazy(() => MesocycleWhereInputSchema) ]).optional(),
}));

export const MesocycleCyclicSetChangeOrderByWithAggregationInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  regardlessOfProgress: z.lazy(() => SortOrderSchema).optional(),
  setIncreaseAmount: z.lazy(() => SortOrderSchema).optional(),
  maxVolume: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MesocycleCyclicSetChangeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MesocycleCyclicSetChangeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MesocycleCyclicSetChangeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MesocycleCyclicSetChangeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MesocycleCyclicSetChangeSumOrderByAggregateInputSchema).optional(),
});

export const MesocycleCyclicSetChangeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleCyclicSetChangeScalarWhereWithAggregatesInputSchema), z.lazy(() => MesocycleCyclicSetChangeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleCyclicSetChangeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleCyclicSetChangeScalarWhereWithAggregatesInputSchema), z.lazy(() => MesocycleCyclicSetChangeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  muscleGroup: z.union([ z.lazy(() => EnumMuscleGroupWithAggregatesFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  setIncreaseAmount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  maxVolume: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const MesocycleExerciseSplitDayWhereInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  dayIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isRestDay: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  mesocycle: z.union([ z.lazy(() => MesocycleScalarRelationFilterSchema), z.lazy(() => MesocycleWhereInputSchema) ]).optional(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateListRelationFilterSchema).optional(),
});

export const MesocycleExerciseSplitDayOrderByWithRelationInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  mesocycle: z.lazy(() => MesocycleOrderByWithRelationInputSchema).optional(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateOrderByRelationAggregateInputSchema).optional(),
});

export const MesocycleExerciseSplitDayWhereUniqueInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  dayIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  isRestDay: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  mesocycle: z.union([ z.lazy(() => MesocycleScalarRelationFilterSchema), z.lazy(() => MesocycleWhereInputSchema) ]).optional(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateListRelationFilterSchema).optional(),
}));

export const MesocycleExerciseSplitDayOrderByWithAggregationInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MesocycleExerciseSplitDayCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MesocycleExerciseSplitDayAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MesocycleExerciseSplitDayMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MesocycleExerciseSplitDayMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MesocycleExerciseSplitDaySumOrderByAggregateInputSchema).optional(),
});

export const MesocycleExerciseSplitDayScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleExerciseSplitDayScalarWhereWithAggregatesInputSchema), z.lazy(() => MesocycleExerciseSplitDayScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleExerciseSplitDayScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleExerciseSplitDayScalarWhereWithAggregatesInputSchema), z.lazy(() => MesocycleExerciseSplitDayScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  dayIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  isRestDay: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const MesocycleExerciseTemplateWhereInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleExerciseTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  sets: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  setType: z.union([ z.lazy(() => EnumSetTypeFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  repRangeStart: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  mesocycleExerciseSplitDayId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  overloadPercentage: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  lastSetToFailure: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  forceRIRMatching: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  minimumWeightChange: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableNullableFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeNullableFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  mesocycleExerciseSplitDay: z.union([ z.lazy(() => MesocycleExerciseSplitDayScalarRelationFilterSchema), z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema) ]).optional(),
});

export const MesocycleExerciseTemplateOrderByWithRelationInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  bodyweightFraction: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  sets: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  changeAmount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  mesocycleExerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  minimumWeightChange: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveTopRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveTopRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveRepRangeSourceId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveTopRepRangeSourceId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveRepRangeResetAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  mesocycleExerciseSplitDay: z.lazy(() => MesocycleExerciseSplitDayOrderByWithRelationInputSchema).optional(),
});

export const MesocycleExerciseTemplateWhereUniqueInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleExerciseTemplateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  sets: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  setType: z.union([ z.lazy(() => EnumSetTypeFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  repRangeStart: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  mesocycleExerciseSplitDayId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  overloadPercentage: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  lastSetToFailure: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  forceRIRMatching: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  minimumWeightChange: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableNullableFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeNullableFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  mesocycleExerciseSplitDay: z.union([ z.lazy(() => MesocycleExerciseSplitDayScalarRelationFilterSchema), z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema) ]).optional(),
}));

export const MesocycleExerciseTemplateOrderByWithAggregationInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  bodyweightFraction: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  sets: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  changeAmount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  mesocycleExerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  minimumWeightChange: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveTopRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveTopRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveRepRangeSourceId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveTopRepRangeSourceId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  adaptiveRepRangeResetAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => MesocycleExerciseTemplateCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MesocycleExerciseTemplateAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MesocycleExerciseTemplateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MesocycleExerciseTemplateMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MesocycleExerciseTemplateSumOrderByAggregateInputSchema).optional(),
});

export const MesocycleExerciseTemplateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleExerciseTemplateScalarWhereWithAggregatesInputSchema), z.lazy(() => MesocycleExerciseTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleExerciseTemplateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleExerciseTemplateScalarWhereWithAggregatesInputSchema), z.lazy(() => MesocycleExerciseTemplateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupWithAggregatesFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  sets: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  setType: z.union([ z.lazy(() => EnumSetTypeWithAggregatesFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  repRangeStart: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableWithAggregatesFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  mesocycleExerciseSplitDayId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  overloadPercentage: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  lastSetToFailure: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema), z.boolean() ]).optional().nullable(),
  forceRIRMatching: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema), z.boolean() ]).optional().nullable(),
  minimumWeightChange: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableNullableWithAggregatesFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeNullableWithAggregatesFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  migratedFromV2: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitListRelationFilterSchema).optional(),
  mesocycles: z.lazy(() => MesocycleListRelationFilterSchema).optional(),
  workouts: z.lazy(() => WorkoutListRelationFilterSchema).optional(),
  settings: z.union([ z.lazy(() => UserSettingsNullableScalarRelationFilterSchema), z.lazy(() => UserSettingsWhereInputSchema) ]).optional().nullable(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  migratedFromV2: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitOrderByRelationAggregateInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleOrderByRelationAggregateInputSchema).optional(),
  workouts: z.lazy(() => WorkoutOrderByRelationAggregateInputSchema).optional(),
  settings: z.lazy(() => UserSettingsOrderByWithRelationInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.cuid2(),
    email: z.string(),
  }),
  z.object({
    id: z.cuid2(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.cuid2().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  migratedFromV2: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitListRelationFilterSchema).optional(),
  mesocycles: z.lazy(() => MesocycleListRelationFilterSchema).optional(),
  workouts: z.lazy(() => WorkoutListRelationFilterSchema).optional(),
  settings: z.union([ z.lazy(() => UserSettingsNullableScalarRelationFilterSchema), z.lazy(() => UserSettingsWhereInputSchema) ]).optional().nullable(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  migratedFromV2: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  migratedFromV2: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema), z.boolean() ]).optional().nullable(),
});

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.object({
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema),
})
.and(z.strictObject({
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional(),
});

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema), z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema), z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.strictObject({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.object({
  sessionToken: z.string(),
})
.and(z.strictObject({
  sessionToken: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.strictObject({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional(),
});

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema), z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema), z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const VerificationTokenWhereInputSchema: z.ZodType<Prisma.VerificationTokenWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema), z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema), z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const VerificationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithRelationInput> = z.strictObject({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
});

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.VerificationTokenWhereUniqueInput> = z.object({
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema),
})
.and(z.strictObject({
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema), z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema), z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}));

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput> = z.strictObject({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VerificationTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationTokenMinOrderByAggregateInputSchema).optional(),
});

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const UserSettingsWhereInputSchema: z.ZodType<Prisma.UserSettingsWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserSettingsWhereInputSchema), z.lazy(() => UserSettingsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserSettingsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserSettingsWhereInputSchema), z.lazy(() => UserSettingsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  motivationalQuotesEnabled: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  quotesDisplayModes: z.lazy(() => EnumQuotesDisplayModeNullableListFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const UserSettingsOrderByWithRelationInputSchema: z.ZodType<Prisma.UserSettingsOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  motivationalQuotesEnabled: z.lazy(() => SortOrderSchema).optional(),
  quotesDisplayModes: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const UserSettingsWhereUniqueInputSchema: z.ZodType<Prisma.UserSettingsWhereUniqueInput> = z.union([
  z.object({
    id: z.cuid(),
    userId: z.string(),
  }),
  z.object({
    id: z.cuid(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.strictObject({
  id: z.cuid().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => UserSettingsWhereInputSchema), z.lazy(() => UserSettingsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserSettingsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserSettingsWhereInputSchema), z.lazy(() => UserSettingsWhereInputSchema).array() ]).optional(),
  motivationalQuotesEnabled: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  quotesDisplayModes: z.lazy(() => EnumQuotesDisplayModeNullableListFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const UserSettingsOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserSettingsOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  motivationalQuotesEnabled: z.lazy(() => SortOrderSchema).optional(),
  quotesDisplayModes: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserSettingsCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserSettingsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserSettingsMinOrderByAggregateInputSchema).optional(),
});

export const UserSettingsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserSettingsScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema), z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema), z.lazy(() => UserSettingsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  motivationalQuotesEnabled: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  quotesDisplayModes: z.lazy(() => EnumQuotesDisplayModeNullableListFilterSchema).optional(),
});

export const WorkoutOfMesocycleWhereInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutOfMesocycleWhereInputSchema), z.lazy(() => WorkoutOfMesocycleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutOfMesocycleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutOfMesocycleWhereInputSchema), z.lazy(() => WorkoutOfMesocycleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  splitDayIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutStatus: z.union([ z.lazy(() => EnumWorkoutStatusNullableFilterSchema), z.lazy(() => WorkoutStatusSchema) ]).optional().nullable(),
  workout: z.union([ z.lazy(() => WorkoutScalarRelationFilterSchema), z.lazy(() => WorkoutWhereInputSchema) ]).optional(),
  mesocycle: z.union([ z.lazy(() => MesocycleScalarRelationFilterSchema), z.lazy(() => MesocycleWhereInputSchema) ]).optional(),
});

export const WorkoutOfMesocycleOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  splitDayIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutStatus: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  workout: z.lazy(() => WorkoutOrderByWithRelationInputSchema).optional(),
  mesocycle: z.lazy(() => MesocycleOrderByWithRelationInputSchema).optional(),
});

export const WorkoutOfMesocycleWhereUniqueInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleWhereUniqueInput> = z.union([
  z.object({
    id: z.cuid2(),
    workoutId: z.string(),
  }),
  z.object({
    id: z.cuid2(),
  }),
  z.object({
    workoutId: z.string(),
  }),
])
.and(z.strictObject({
  id: z.cuid2().optional(),
  workoutId: z.string().optional(),
  AND: z.union([ z.lazy(() => WorkoutOfMesocycleWhereInputSchema), z.lazy(() => WorkoutOfMesocycleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutOfMesocycleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutOfMesocycleWhereInputSchema), z.lazy(() => WorkoutOfMesocycleWhereInputSchema).array() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  splitDayIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  workoutStatus: z.union([ z.lazy(() => EnumWorkoutStatusNullableFilterSchema), z.lazy(() => WorkoutStatusSchema) ]).optional().nullable(),
  workout: z.union([ z.lazy(() => WorkoutScalarRelationFilterSchema), z.lazy(() => WorkoutWhereInputSchema) ]).optional(),
  mesocycle: z.union([ z.lazy(() => MesocycleScalarRelationFilterSchema), z.lazy(() => MesocycleWhereInputSchema) ]).optional(),
}));

export const WorkoutOfMesocycleOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  splitDayIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutStatus: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => WorkoutOfMesocycleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WorkoutOfMesocycleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkoutOfMesocycleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkoutOfMesocycleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WorkoutOfMesocycleSumOrderByAggregateInputSchema).optional(),
});

export const WorkoutOfMesocycleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutOfMesocycleScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutOfMesocycleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutOfMesocycleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutOfMesocycleScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutOfMesocycleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  splitDayIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  workoutStatus: z.union([ z.lazy(() => EnumWorkoutStatusNullableWithAggregatesFilterSchema), z.lazy(() => WorkoutStatusSchema) ]).optional().nullable(),
});

export const WorkoutWhereInputSchema: z.ZodType<Prisma.WorkoutWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutWhereInputSchema), z.lazy(() => WorkoutWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutWhereInputSchema), z.lazy(() => WorkoutWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userBodyweight: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  workoutOfMesocycle: z.union([ z.lazy(() => WorkoutOfMesocycleNullableScalarRelationFilterSchema), z.lazy(() => WorkoutOfMesocycleWhereInputSchema) ]).optional().nullable(),
  workoutExercises: z.lazy(() => WorkoutExerciseListRelationFilterSchema).optional(),
});

export const WorkoutOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkoutOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userBodyweight: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  endedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleOrderByWithRelationInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseOrderByRelationAggregateInputSchema).optional(),
});

export const WorkoutWhereUniqueInputSchema: z.ZodType<Prisma.WorkoutWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => WorkoutWhereInputSchema), z.lazy(() => WorkoutWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutWhereInputSchema), z.lazy(() => WorkoutWhereInputSchema).array() ]).optional(),
  userBodyweight: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  workoutOfMesocycle: z.union([ z.lazy(() => WorkoutOfMesocycleNullableScalarRelationFilterSchema), z.lazy(() => WorkoutOfMesocycleWhereInputSchema) ]).optional().nullable(),
  workoutExercises: z.lazy(() => WorkoutExerciseListRelationFilterSchema).optional(),
}));

export const WorkoutOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkoutOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userBodyweight: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  endedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => WorkoutCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WorkoutAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkoutMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkoutMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WorkoutSumOrderByAggregateInputSchema).optional(),
});

export const WorkoutScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkoutScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userBodyweight: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  endedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const WorkoutExerciseWhereInputSchema: z.ZodType<Prisma.WorkoutExerciseWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseWhereInputSchema), z.lazy(() => WorkoutExerciseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseWhereInputSchema), z.lazy(() => WorkoutExerciseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  setType: z.union([ z.lazy(() => EnumSetTypeFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  repRangeStart: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  overloadPercentage: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  lastSetToFailure: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  forceRIRMatching: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  minimumWeightChange: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableNullableFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeNullableFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  isDeload: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  workout: z.union([ z.lazy(() => WorkoutScalarRelationFilterSchema), z.lazy(() => WorkoutWhereInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutExerciseSetListRelationFilterSchema).optional(),
});

export const WorkoutExerciseOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkoutExerciseOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  bodyweightFraction: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  changeAmount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  overloadPercentage: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  minimumWeightChange: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  mesocycleExerciseTemplateId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  isDeload: z.lazy(() => SortOrderSchema).optional(),
  workout: z.lazy(() => WorkoutOrderByWithRelationInputSchema).optional(),
  sets: z.lazy(() => WorkoutExerciseSetOrderByRelationAggregateInputSchema).optional(),
});

export const WorkoutExerciseWhereUniqueInputSchema: z.ZodType<Prisma.WorkoutExerciseWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => WorkoutExerciseWhereInputSchema), z.lazy(() => WorkoutExerciseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseWhereInputSchema), z.lazy(() => WorkoutExerciseWhereInputSchema).array() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  setType: z.union([ z.lazy(() => EnumSetTypeFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  repRangeStart: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  overloadPercentage: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  lastSetToFailure: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  forceRIRMatching: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  minimumWeightChange: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableNullableFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeNullableFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  isDeload: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  workout: z.union([ z.lazy(() => WorkoutScalarRelationFilterSchema), z.lazy(() => WorkoutWhereInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutExerciseSetListRelationFilterSchema).optional(),
}));

export const WorkoutExerciseOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkoutExerciseOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  bodyweightFraction: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  changeAmount: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  note: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  overloadPercentage: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  minimumWeightChange: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  mesocycleExerciseTemplateId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeStart: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  topRepRangeEnd: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  isDeload: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkoutExerciseCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WorkoutExerciseAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkoutExerciseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkoutExerciseMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WorkoutExerciseSumOrderByAggregateInputSchema).optional(),
});

export const WorkoutExerciseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkoutExerciseScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutExerciseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupWithAggregatesFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  setType: z.union([ z.lazy(() => EnumSetTypeWithAggregatesFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableWithAggregatesFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  repRangeStart: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  overloadPercentage: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  lastSetToFailure: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema), z.boolean() ]).optional().nullable(),
  forceRIRMatching: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema), z.boolean() ]).optional().nullable(),
  minimumWeightChange: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableNullableWithAggregatesFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeNullableWithAggregatesFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  isDeload: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
});

export const WorkoutExerciseSetWhereInputSchema: z.ZodType<Prisma.WorkoutExerciseSetWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseSetWhereInputSchema), z.lazy(() => WorkoutExerciseSetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseSetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseSetWhereInputSchema), z.lazy(() => WorkoutExerciseSetWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  setIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutExerciseId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  reps: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  load: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  RIR: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  skipped: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  workoutExercise: z.union([ z.lazy(() => WorkoutExerciseScalarRelationFilterSchema), z.lazy(() => WorkoutExerciseWhereInputSchema) ]).optional(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetListRelationFilterSchema).optional(),
});

export const WorkoutExerciseSetOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkoutExerciseSetOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  skipped: z.lazy(() => SortOrderSchema).optional(),
  workoutExercise: z.lazy(() => WorkoutExerciseOrderByWithRelationInputSchema).optional(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetOrderByRelationAggregateInputSchema).optional(),
});

export const WorkoutExerciseSetWhereUniqueInputSchema: z.ZodType<Prisma.WorkoutExerciseSetWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => WorkoutExerciseSetWhereInputSchema), z.lazy(() => WorkoutExerciseSetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseSetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseSetWhereInputSchema), z.lazy(() => WorkoutExerciseSetWhereInputSchema).array() ]).optional(),
  setIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  workoutExerciseId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  reps: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  load: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  RIR: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  skipped: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  workoutExercise: z.union([ z.lazy(() => WorkoutExerciseScalarRelationFilterSchema), z.lazy(() => WorkoutExerciseWhereInputSchema) ]).optional(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetListRelationFilterSchema).optional(),
}));

export const WorkoutExerciseSetOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkoutExerciseSetOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  skipped: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkoutExerciseSetCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WorkoutExerciseSetAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkoutExerciseSetMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkoutExerciseSetMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WorkoutExerciseSetSumOrderByAggregateInputSchema).optional(),
});

export const WorkoutExerciseSetScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkoutExerciseSetScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseSetScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutExerciseSetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseSetScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseSetScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutExerciseSetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  setIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  workoutExerciseId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  reps: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  load: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  RIR: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  skipped: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
});

export const WorkoutExerciseMiniSetWhereInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  miniSetIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  reps: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  load: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  RIR: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutExerciseSetId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  parentSet: z.union([ z.lazy(() => WorkoutExerciseSetScalarRelationFilterSchema), z.lazy(() => WorkoutExerciseSetWhereInputSchema) ]).optional(),
});

export const WorkoutExerciseMiniSetOrderByWithRelationInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  miniSetIndex: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseSetId: z.lazy(() => SortOrderSchema).optional(),
  parentSet: z.lazy(() => WorkoutExerciseSetOrderByWithRelationInputSchema).optional(),
});

export const WorkoutExerciseMiniSetWhereUniqueInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetWhereUniqueInput> = z.object({
  id: z.cuid2(),
})
.and(z.strictObject({
  id: z.cuid2().optional(),
  AND: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema).array() ]).optional(),
  miniSetIndex: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  reps: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  load: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  RIR: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  workoutExerciseSetId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  parentSet: z.union([ z.lazy(() => WorkoutExerciseSetScalarRelationFilterSchema), z.lazy(() => WorkoutExerciseSetWhereInputSchema) ]).optional(),
}));

export const WorkoutExerciseMiniSetOrderByWithAggregationInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  miniSetIndex: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseSetId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => WorkoutExerciseMiniSetCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => WorkoutExerciseMiniSetAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => WorkoutExerciseMiniSetMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => WorkoutExerciseMiniSetMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => WorkoutExerciseMiniSetSumOrderByAggregateInputSchema).optional(),
});

export const WorkoutExerciseMiniSetScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseMiniSetScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutExerciseMiniSetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseMiniSetScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseMiniSetScalarWhereWithAggregatesInputSchema), z.lazy(() => WorkoutExerciseMiniSetScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  miniSetIndex: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  reps: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  load: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  RIR: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  workoutExerciseSetId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ExerciseSplitCreateInputSchema: z.ZodType<Prisma.ExerciseSplitCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutExerciseSplitsInputSchema),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
});

export const ExerciseSplitUncheckedCreateInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayUncheckedCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleUncheckedCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
});

export const ExerciseSplitUpdateInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutExerciseSplitsNestedInputSchema).optional(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
});

export const ExerciseSplitUncheckedUpdateInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayUncheckedUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleUncheckedUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
});

export const ExerciseSplitCreateManyInputSchema: z.ZodType<Prisma.ExerciseSplitCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
});

export const ExerciseSplitUpdateManyMutationInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseSplitUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseSplitDayCreateInputSchema: z.ZodType<Prisma.ExerciseSplitDayCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  exercises: z.lazy(() => ExerciseTemplateCreateNestedManyWithoutExerciseSplitDayInputSchema).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitCreateNestedOneWithoutExerciseSplitDaysInputSchema),
});

export const ExerciseSplitDayUncheckedCreateInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  exerciseSplitId: z.string(),
  exercises: z.lazy(() => ExerciseTemplateUncheckedCreateNestedManyWithoutExerciseSplitDayInputSchema).optional(),
});

export const ExerciseSplitDayUpdateInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  exercises: z.lazy(() => ExerciseTemplateUpdateManyWithoutExerciseSplitDayNestedInputSchema).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitUpdateOneRequiredWithoutExerciseSplitDaysNestedInputSchema).optional(),
});

export const ExerciseSplitDayUncheckedUpdateInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exercises: z.lazy(() => ExerciseTemplateUncheckedUpdateManyWithoutExerciseSplitDayNestedInputSchema).optional(),
});

export const ExerciseSplitDayCreateManyInputSchema: z.ZodType<Prisma.ExerciseSplitDayCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  exerciseSplitId: z.string(),
});

export const ExerciseSplitDayUpdateManyMutationInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseSplitDayUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseTemplateCreateInputSchema: z.ZodType<Prisma.ExerciseTemplateCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  exerciseSplitDay: z.lazy(() => ExerciseSplitDayCreateNestedOneWithoutExercisesInputSchema),
});

export const ExerciseTemplateUncheckedCreateInputSchema: z.ZodType<Prisma.ExerciseTemplateUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  exerciseSplitDayId: z.string(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const ExerciseTemplateUpdateInputSchema: z.ZodType<Prisma.ExerciseTemplateUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  exerciseSplitDay: z.lazy(() => ExerciseSplitDayUpdateOneRequiredWithoutExercisesNestedInputSchema).optional(),
});

export const ExerciseTemplateUncheckedUpdateInputSchema: z.ZodType<Prisma.ExerciseTemplateUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  exerciseSplitDayId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ExerciseTemplateCreateManyInputSchema: z.ZodType<Prisma.ExerciseTemplateCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  exerciseSplitDayId: z.string(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const ExerciseTemplateUpdateManyMutationInputSchema: z.ZodType<Prisma.ExerciseTemplateUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ExerciseTemplateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ExerciseTemplateUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  exerciseSplitDayId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MesocycleCreateInputSchema: z.ZodType<Prisma.MesocycleCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  user: z.lazy(() => UserCreateNestedOneWithoutMesocyclesInputSchema),
  exerciseSplit: z.lazy(() => ExerciseSplitCreateNestedOneWithoutUsedByMesocyclesInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayCreateNestedManyWithoutMesocycleInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleUncheckedCreateInputSchema: z.ZodType<Prisma.MesocycleUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  exerciseSplitId: z.string().optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleUpdateInputSchema: z.ZodType<Prisma.MesocycleUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMesocyclesNestedInputSchema).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitUpdateOneWithoutUsedByMesocyclesNestedInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleUncheckedUpdateInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleCreateManyInputSchema: z.ZodType<Prisma.MesocycleCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  exerciseSplitId: z.string().optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
});

export const MesocycleUpdateManyMutationInputSchema: z.ZodType<Prisma.MesocycleUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleCyclicSetChangeCreateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  muscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  regardlessOfProgress: z.boolean(),
  setIncreaseAmount: z.number().int(),
  maxVolume: z.number().int(),
  mesocycle: z.lazy(() => MesocycleCreateNestedOneWithoutMesocycleCyclicSetChangesInputSchema),
});

export const MesocycleCyclicSetChangeUncheckedCreateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  mesocycleId: z.string(),
  muscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  regardlessOfProgress: z.boolean(),
  setIncreaseAmount: z.number().int(),
  maxVolume: z.number().int(),
});

export const MesocycleCyclicSetChangeUpdateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  setIncreaseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxVolume: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycle: z.lazy(() => MesocycleUpdateOneRequiredWithoutMesocycleCyclicSetChangesNestedInputSchema).optional(),
});

export const MesocycleCyclicSetChangeUncheckedUpdateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  setIncreaseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxVolume: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleCyclicSetChangeCreateManyInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  mesocycleId: z.string(),
  muscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  regardlessOfProgress: z.boolean(),
  setIncreaseAmount: z.number().int(),
  maxVolume: z.number().int(),
});

export const MesocycleCyclicSetChangeUpdateManyMutationInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  setIncreaseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxVolume: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleCyclicSetChangeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  setIncreaseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxVolume: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleExerciseSplitDayCreateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  mesocycle: z.lazy(() => MesocycleCreateNestedOneWithoutMesocycleExerciseSplitDaysInputSchema),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateCreateNestedManyWithoutMesocycleExerciseSplitDayInputSchema).optional(),
});

export const MesocycleExerciseSplitDayUncheckedCreateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  mesocycleId: z.string(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateUncheckedCreateNestedManyWithoutMesocycleExerciseSplitDayInputSchema).optional(),
});

export const MesocycleExerciseSplitDayUpdateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycle: z.lazy(() => MesocycleUpdateOneRequiredWithoutMesocycleExerciseSplitDaysNestedInputSchema).optional(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateUpdateManyWithoutMesocycleExerciseSplitDayNestedInputSchema).optional(),
});

export const MesocycleExerciseSplitDayUncheckedUpdateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateUncheckedUpdateManyWithoutMesocycleExerciseSplitDayNestedInputSchema).optional(),
});

export const MesocycleExerciseSplitDayCreateManyInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  mesocycleId: z.string(),
});

export const MesocycleExerciseSplitDayUpdateManyMutationInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleExerciseSplitDayUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleExerciseTemplateCreateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  sets: z.number().int(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  adaptiveRepRangeStart: z.number().int().optional().nullable(),
  adaptiveRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveTopRepRangeStart: z.number().int().optional().nullable(),
  adaptiveTopRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveRepRangeSourceId: z.string().optional().nullable(),
  adaptiveTopRepRangeSourceId: z.string().optional().nullable(),
  adaptiveRepRangeResetAt: z.coerce.date().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  mesocycleExerciseSplitDay: z.lazy(() => MesocycleExerciseSplitDayCreateNestedOneWithoutMesocycleSplitDayExercisesInputSchema),
});

export const MesocycleExerciseTemplateUncheckedCreateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  sets: z.number().int(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  mesocycleExerciseSplitDayId: z.string(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  adaptiveRepRangeStart: z.number().int().optional().nullable(),
  adaptiveRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveTopRepRangeStart: z.number().int().optional().nullable(),
  adaptiveTopRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveRepRangeSourceId: z.string().optional().nullable(),
  adaptiveTopRepRangeSourceId: z.string().optional().nullable(),
  adaptiveRepRangeResetAt: z.coerce.date().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const MesocycleExerciseTemplateUpdateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseSplitDay: z.lazy(() => MesocycleExerciseSplitDayUpdateOneRequiredWithoutMesocycleSplitDayExercisesNestedInputSchema).optional(),
});

export const MesocycleExerciseTemplateUncheckedUpdateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseSplitDayId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MesocycleExerciseTemplateCreateManyInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  sets: z.number().int(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  mesocycleExerciseSplitDayId: z.string(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  adaptiveRepRangeStart: z.number().int().optional().nullable(),
  adaptiveRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveTopRepRangeStart: z.number().int().optional().nullable(),
  adaptiveTopRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveRepRangeSourceId: z.string().optional().nullable(),
  adaptiveTopRepRangeSourceId: z.string().optional().nullable(),
  adaptiveRepRangeResetAt: z.coerce.date().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const MesocycleExerciseTemplateUpdateManyMutationInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MesocycleExerciseTemplateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseSplitDayId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.strictObject({
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema),
});

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.strictObject({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.strictObject({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional(),
});

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.strictObject({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.strictObject({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.strictObject({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.strictObject({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.strictObject({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema),
});

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.strictObject({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.strictObject({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional(),
});

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.strictObject({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.strictObject({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.strictObject({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.strictObject({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VerificationTokenCreateInputSchema: z.ZodType<Prisma.VerificationTokenCreateInput> = z.strictObject({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
});

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedCreateInput> = z.strictObject({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
});

export const VerificationTokenUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUpdateInput> = z.strictObject({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput> = z.strictObject({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VerificationTokenCreateManyInputSchema: z.ZodType<Prisma.VerificationTokenCreateManyInput> = z.strictObject({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
});

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput> = z.strictObject({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput> = z.strictObject({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserSettingsCreateInputSchema: z.ZodType<Prisma.UserSettingsCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  motivationalQuotesEnabled: z.boolean().optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsCreatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSettingsInputSchema),
});

export const UserSettingsUncheckedCreateInputSchema: z.ZodType<Prisma.UserSettingsUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  motivationalQuotesEnabled: z.boolean().optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsCreatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const UserSettingsUpdateInputSchema: z.ZodType<Prisma.UserSettingsUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  motivationalQuotesEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsUpdatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSettingsNestedInputSchema).optional(),
});

export const UserSettingsUncheckedUpdateInputSchema: z.ZodType<Prisma.UserSettingsUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  motivationalQuotesEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsUpdatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const UserSettingsCreateManyInputSchema: z.ZodType<Prisma.UserSettingsCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  userId: z.string(),
  motivationalQuotesEnabled: z.boolean().optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsCreatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const UserSettingsUpdateManyMutationInputSchema: z.ZodType<Prisma.UserSettingsUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  motivationalQuotesEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsUpdatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const UserSettingsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserSettingsUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  motivationalQuotesEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsUpdatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const WorkoutOfMesocycleCreateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  splitDayIndex: z.number().int(),
  workoutStatus: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
  workout: z.lazy(() => WorkoutCreateNestedOneWithoutWorkoutOfMesocycleInputSchema),
  mesocycle: z.lazy(() => MesocycleCreateNestedOneWithoutWorkoutsOfMesocycleInputSchema),
});

export const WorkoutOfMesocycleUncheckedCreateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  workoutId: z.string(),
  mesocycleId: z.string(),
  splitDayIndex: z.number().int(),
  workoutStatus: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
});

export const WorkoutOfMesocycleUpdateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  splitDayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutStatus: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workout: z.lazy(() => WorkoutUpdateOneRequiredWithoutWorkoutOfMesocycleNestedInputSchema).optional(),
  mesocycle: z.lazy(() => MesocycleUpdateOneRequiredWithoutWorkoutsOfMesocycleNestedInputSchema).optional(),
});

export const WorkoutOfMesocycleUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  splitDayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutStatus: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const WorkoutOfMesocycleCreateManyInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  workoutId: z.string(),
  mesocycleId: z.string(),
  splitDayIndex: z.number().int(),
  workoutStatus: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
});

export const WorkoutOfMesocycleUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  splitDayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutStatus: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const WorkoutOfMesocycleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  splitDayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutStatus: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const WorkoutCreateInputSchema: z.ZodType<Prisma.WorkoutCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  note: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutWorkoutsInputSchema),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleCreateNestedOneWithoutWorkoutInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutUncheckedCreateInputSchema: z.ZodType<Prisma.WorkoutUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  userId: z.string(),
  note: z.string().optional().nullable(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedCreateNestedOneWithoutWorkoutInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutUpdateInputSchema: z.ZodType<Prisma.WorkoutUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutWorkoutsNestedInputSchema).optional(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleUpdateOneWithoutWorkoutNestedInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedUpdateOneWithoutWorkoutNestedInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutCreateManyInputSchema: z.ZodType<Prisma.WorkoutCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  userId: z.string(),
  note: z.string().optional().nullable(),
});

export const WorkoutUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkoutUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const WorkoutUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const WorkoutExerciseCreateInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  exerciseIndex: z.number().int(),
  name: z.string(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  mesocycleExerciseTemplateId: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  isDeload: z.boolean().optional(),
  workout: z.lazy(() => WorkoutCreateNestedOneWithoutWorkoutExercisesInputSchema),
  sets: z.lazy(() => WorkoutExerciseSetCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseUncheckedCreateInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  exerciseIndex: z.number().int(),
  name: z.string(),
  workoutId: z.string(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  mesocycleExerciseTemplateId: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  isDeload: z.boolean().optional(),
  sets: z.lazy(() => WorkoutExerciseSetUncheckedCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseUpdateInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeload: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  workout: z.lazy(() => WorkoutUpdateOneRequiredWithoutWorkoutExercisesNestedInputSchema).optional(),
  sets: z.lazy(() => WorkoutExerciseSetUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeload: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutExerciseSetUncheckedUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseCreateManyInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  exerciseIndex: z.number().int(),
  name: z.string(),
  workoutId: z.string(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  mesocycleExerciseTemplateId: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  isDeload: z.boolean().optional(),
});

export const WorkoutExerciseUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeload: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeload: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseSetCreateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  setIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  skipped: z.boolean(),
  workoutExercise: z.lazy(() => WorkoutExerciseCreateNestedOneWithoutSetsInputSchema),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetCreateNestedManyWithoutParentSetInputSchema).optional(),
});

export const WorkoutExerciseSetUncheckedCreateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  setIndex: z.number().int(),
  workoutExerciseId: z.string(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  skipped: z.boolean(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateNestedManyWithoutParentSetInputSchema).optional(),
});

export const WorkoutExerciseSetUpdateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  skipped: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExercise: z.lazy(() => WorkoutExerciseUpdateOneRequiredWithoutSetsNestedInputSchema).optional(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetUpdateManyWithoutParentSetNestedInputSchema).optional(),
});

export const WorkoutExerciseSetUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  skipped: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetUncheckedUpdateManyWithoutParentSetNestedInputSchema).optional(),
});

export const WorkoutExerciseSetCreateManyInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  setIndex: z.number().int(),
  workoutExerciseId: z.string(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  skipped: z.boolean(),
});

export const WorkoutExerciseSetUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  skipped: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseSetUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  skipped: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseMiniSetCreateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  miniSetIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  parentSet: z.lazy(() => WorkoutExerciseSetCreateNestedOneWithoutMiniSetsInputSchema),
});

export const WorkoutExerciseMiniSetUncheckedCreateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUncheckedCreateInput> = z.strictObject({
  id: z.cuid2().optional(),
  miniSetIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  workoutExerciseSetId: z.string(),
});

export const WorkoutExerciseMiniSetUpdateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  miniSetIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  parentSet: z.lazy(() => WorkoutExerciseSetUpdateOneRequiredWithoutMiniSetsNestedInputSchema).optional(),
});

export const WorkoutExerciseMiniSetUncheckedUpdateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  miniSetIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExerciseSetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseMiniSetCreateManyInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateManyInput> = z.strictObject({
  id: z.cuid2().optional(),
  miniSetIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  workoutExerciseSetId: z.string(),
});

export const WorkoutExerciseMiniSetUpdateManyMutationInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  miniSetIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseMiniSetUncheckedUpdateManyInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  miniSetIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExerciseSetId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const ExerciseSplitDayListRelationFilterSchema: z.ZodType<Prisma.ExerciseSplitDayListRelationFilter> = z.strictObject({
  every: z.lazy(() => ExerciseSplitDayWhereInputSchema).optional(),
  some: z.lazy(() => ExerciseSplitDayWhereInputSchema).optional(),
  none: z.lazy(() => ExerciseSplitDayWhereInputSchema).optional(),
});

export const MesocycleListRelationFilterSchema: z.ZodType<Prisma.MesocycleListRelationFilter> = z.strictObject({
  every: z.lazy(() => MesocycleWhereInputSchema).optional(),
  some: z.lazy(() => MesocycleWhereInputSchema).optional(),
  none: z.lazy(() => MesocycleWhereInputSchema).optional(),
});

export const ExerciseSplitDayOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitDayOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MesocycleOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSplitCountOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSplitMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSplitMinOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const ExerciseTemplateListRelationFilterSchema: z.ZodType<Prisma.ExerciseTemplateListRelationFilter> = z.strictObject({
  every: z.lazy(() => ExerciseTemplateWhereInputSchema).optional(),
  some: z.lazy(() => ExerciseTemplateWhereInputSchema).optional(),
  none: z.lazy(() => ExerciseTemplateWhereInputSchema).optional(),
});

export const ExerciseSplitScalarRelationFilterSchema: z.ZodType<Prisma.ExerciseSplitScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ExerciseSplitWhereInputSchema).optional(),
  isNot: z.lazy(() => ExerciseSplitWhereInputSchema).optional(),
});

export const ExerciseTemplateOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ExerciseTemplateOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSplitDayCountOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitDayCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSplitDayAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitDayAvgOrderByAggregateInput> = z.strictObject({
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSplitDayMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitDayMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSplitDayMinOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitDayMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSplitDaySumOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitDaySumOrderByAggregateInput> = z.strictObject({
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const EnumMuscleGroupFilterSchema: z.ZodType<Prisma.EnumMuscleGroupFilter> = z.strictObject({
  equals: z.lazy(() => MuscleGroupSchema).optional(),
  in: z.lazy(() => MuscleGroupSchema).array().optional(),
  notIn: z.lazy(() => MuscleGroupSchema).array().optional(),
  not: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => NestedEnumMuscleGroupFilterSchema) ]).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const EnumSetTypeFilterSchema: z.ZodType<Prisma.EnumSetTypeFilter> = z.strictObject({
  equals: z.lazy(() => SetTypeSchema).optional(),
  in: z.lazy(() => SetTypeSchema).array().optional(),
  notIn: z.lazy(() => SetTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => NestedEnumSetTypeFilterSchema) ]).optional(),
});

export const EnumChangeTypeNullableFilterSchema: z.ZodType<Prisma.EnumChangeTypeNullableFilter> = z.strictObject({
  equals: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  in: z.lazy(() => ChangeTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => ChangeTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NestedEnumChangeTypeNullableFilterSchema) ]).optional().nullable(),
});

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const ExerciseSplitDayScalarRelationFilterSchema: z.ZodType<Prisma.ExerciseSplitDayScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ExerciseSplitDayWhereInputSchema).optional(),
  isNot: z.lazy(() => ExerciseSplitDayWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const ExerciseTemplateCountOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseTemplateCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseTemplateAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseTemplateAvgOrderByAggregateInput> = z.strictObject({
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseTemplateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseTemplateMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseTemplateMinOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseTemplateMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseTemplateSumOrderByAggregateInputSchema: z.ZodType<Prisma.ExerciseTemplateSumOrderByAggregateInput> = z.strictObject({
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumMuscleGroupWithAggregatesFilterSchema: z.ZodType<Prisma.EnumMuscleGroupWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => MuscleGroupSchema).optional(),
  in: z.lazy(() => MuscleGroupSchema).array().optional(),
  notIn: z.lazy(() => MuscleGroupSchema).array().optional(),
  not: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => NestedEnumMuscleGroupWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMuscleGroupFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMuscleGroupFilterSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const EnumSetTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSetTypeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => SetTypeSchema).optional(),
  in: z.lazy(() => SetTypeSchema).array().optional(),
  notIn: z.lazy(() => SetTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => NestedEnumSetTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSetTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSetTypeFilterSchema).optional(),
});

export const EnumChangeTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumChangeTypeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  in: z.lazy(() => ChangeTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => ChangeTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NestedEnumChangeTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumChangeTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumChangeTypeNullableFilterSchema).optional(),
});

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const IntNullableListFilterSchema: z.ZodType<Prisma.IntNullableListFilter> = z.strictObject({
  equals: z.number().array().optional().nullable(),
  has: z.number().optional().nullable(),
  hasEvery: z.number().array().optional(),
  hasSome: z.number().array().optional(),
  isEmpty: z.boolean().optional(),
});

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const EnumProgressionVariableFilterSchema: z.ZodType<Prisma.EnumProgressionVariableFilter> = z.strictObject({
  equals: z.lazy(() => ProgressionVariableSchema).optional(),
  in: z.lazy(() => ProgressionVariableSchema).array().optional(),
  notIn: z.lazy(() => ProgressionVariableSchema).array().optional(),
  not: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NestedEnumProgressionVariableFilterSchema) ]).optional(),
});

export const EnumRepRangeModeFilterSchema: z.ZodType<Prisma.EnumRepRangeModeFilter> = z.strictObject({
  equals: z.lazy(() => RepRangeModeSchema).optional(),
  in: z.lazy(() => RepRangeModeSchema).array().optional(),
  notIn: z.lazy(() => RepRangeModeSchema).array().optional(),
  not: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NestedEnumRepRangeModeFilterSchema) ]).optional(),
});

export const ExerciseSplitNullableScalarRelationFilterSchema: z.ZodType<Prisma.ExerciseSplitNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ExerciseSplitWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ExerciseSplitWhereInputSchema).optional().nullable(),
});

export const MesocycleExerciseSplitDayListRelationFilterSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayListRelationFilter> = z.strictObject({
  every: z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).optional(),
  some: z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).optional(),
  none: z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).optional(),
});

export const MesocycleCyclicSetChangeListRelationFilterSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeListRelationFilter> = z.strictObject({
  every: z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema).optional(),
  some: z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema).optional(),
  none: z.lazy(() => MesocycleCyclicSetChangeWhereInputSchema).optional(),
});

export const WorkoutOfMesocycleListRelationFilterSchema: z.ZodType<Prisma.WorkoutOfMesocycleListRelationFilter> = z.strictObject({
  every: z.lazy(() => WorkoutOfMesocycleWhereInputSchema).optional(),
  some: z.lazy(() => WorkoutOfMesocycleWhereInputSchema).optional(),
  none: z.lazy(() => WorkoutOfMesocycleWhereInputSchema).optional(),
});

export const MesocycleExerciseSplitDayOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleCyclicSetChangeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutOfMesocycleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleCountOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.lazy(() => SortOrderSchema).optional(),
  RIRProgression: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  startOverloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleAvgOrderByAggregateInput> = z.strictObject({
  RIRProgression: z.lazy(() => SortOrderSchema).optional(),
  startOverloadPercentage: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  startOverloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleMinOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  exerciseSplitId: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  startOverloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleSumOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleSumOrderByAggregateInput> = z.strictObject({
  RIRProgression: z.lazy(() => SortOrderSchema).optional(),
  startOverloadPercentage: z.lazy(() => SortOrderSchema).optional(),
});

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const EnumProgressionVariableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumProgressionVariableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ProgressionVariableSchema).optional(),
  in: z.lazy(() => ProgressionVariableSchema).array().optional(),
  notIn: z.lazy(() => ProgressionVariableSchema).array().optional(),
  not: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NestedEnumProgressionVariableWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProgressionVariableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProgressionVariableFilterSchema).optional(),
});

export const EnumRepRangeModeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRepRangeModeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RepRangeModeSchema).optional(),
  in: z.lazy(() => RepRangeModeSchema).array().optional(),
  notIn: z.lazy(() => RepRangeModeSchema).array().optional(),
  not: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NestedEnumRepRangeModeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRepRangeModeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRepRangeModeFilterSchema).optional(),
});

export const MesocycleScalarRelationFilterSchema: z.ZodType<Prisma.MesocycleScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MesocycleWhereInputSchema).optional(),
  isNot: z.lazy(() => MesocycleWhereInputSchema).optional(),
});

export const MesocycleCyclicSetChangeCountOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  regardlessOfProgress: z.lazy(() => SortOrderSchema).optional(),
  setIncreaseAmount: z.lazy(() => SortOrderSchema).optional(),
  maxVolume: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleCyclicSetChangeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeAvgOrderByAggregateInput> = z.strictObject({
  setIncreaseAmount: z.lazy(() => SortOrderSchema).optional(),
  maxVolume: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleCyclicSetChangeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  regardlessOfProgress: z.lazy(() => SortOrderSchema).optional(),
  setIncreaseAmount: z.lazy(() => SortOrderSchema).optional(),
  maxVolume: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleCyclicSetChangeMinOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  muscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  regardlessOfProgress: z.lazy(() => SortOrderSchema).optional(),
  setIncreaseAmount: z.lazy(() => SortOrderSchema).optional(),
  maxVolume: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleCyclicSetChangeSumOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeSumOrderByAggregateInput> = z.strictObject({
  setIncreaseAmount: z.lazy(() => SortOrderSchema).optional(),
  maxVolume: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseTemplateListRelationFilterSchema: z.ZodType<Prisma.MesocycleExerciseTemplateListRelationFilter> = z.strictObject({
  every: z.lazy(() => MesocycleExerciseTemplateWhereInputSchema).optional(),
  some: z.lazy(() => MesocycleExerciseTemplateWhereInputSchema).optional(),
  none: z.lazy(() => MesocycleExerciseTemplateWhereInputSchema).optional(),
});

export const MesocycleExerciseTemplateOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseSplitDayCountOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseSplitDayAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayAvgOrderByAggregateInput> = z.strictObject({
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseSplitDayMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseSplitDayMinOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
  isRestDay: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseSplitDaySumOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDaySumOrderByAggregateInput> = z.strictObject({
  dayIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.strictObject({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
});

export const EnumProgressionVariableNullableFilterSchema: z.ZodType<Prisma.EnumProgressionVariableNullableFilter> = z.strictObject({
  equals: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  in: z.lazy(() => ProgressionVariableSchema).array().optional().nullable(),
  notIn: z.lazy(() => ProgressionVariableSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NestedEnumProgressionVariableNullableFilterSchema) ]).optional().nullable(),
});

export const EnumRepRangeModeNullableFilterSchema: z.ZodType<Prisma.EnumRepRangeModeNullableFilter> = z.strictObject({
  equals: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  in: z.lazy(() => RepRangeModeSchema).array().optional().nullable(),
  notIn: z.lazy(() => RepRangeModeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NestedEnumRepRangeModeNullableFilterSchema) ]).optional().nullable(),
});

export const MesocycleExerciseSplitDayScalarRelationFilterSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).optional(),
  isNot: z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).optional(),
});

export const MesocycleExerciseTemplateCountOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  sets: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  mesocycleExerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeSourceId: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeSourceId: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeResetAt: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseTemplateAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateAvgOrderByAggregateInput> = z.strictObject({
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  sets: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseTemplateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  sets: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  mesocycleExerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeSourceId: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeSourceId: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeResetAt: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseTemplateMinOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  sets: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  mesocycleExerciseSplitDayId: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeSourceId: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeSourceId: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeResetAt: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const MesocycleExerciseTemplateSumOrderByAggregateInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateSumOrderByAggregateInput> = z.strictObject({
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  sets: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  adaptiveTopRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
});

export const EnumProgressionVariableNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumProgressionVariableNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  in: z.lazy(() => ProgressionVariableSchema).array().optional().nullable(),
  notIn: z.lazy(() => ProgressionVariableSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NestedEnumProgressionVariableNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProgressionVariableNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProgressionVariableNullableFilterSchema).optional(),
});

export const EnumRepRangeModeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRepRangeModeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  in: z.lazy(() => RepRangeModeSchema).array().optional().nullable(),
  notIn: z.lazy(() => RepRangeModeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NestedEnumRepRangeModeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRepRangeModeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRepRangeModeNullableFilterSchema).optional(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.strictObject({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional(),
});

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.strictObject({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional(),
});

export const ExerciseSplitListRelationFilterSchema: z.ZodType<Prisma.ExerciseSplitListRelationFilter> = z.strictObject({
  every: z.lazy(() => ExerciseSplitWhereInputSchema).optional(),
  some: z.lazy(() => ExerciseSplitWhereInputSchema).optional(),
  none: z.lazy(() => ExerciseSplitWhereInputSchema).optional(),
});

export const WorkoutListRelationFilterSchema: z.ZodType<Prisma.WorkoutListRelationFilter> = z.strictObject({
  every: z.lazy(() => WorkoutWhereInputSchema).optional(),
  some: z.lazy(() => WorkoutWhereInputSchema).optional(),
  none: z.lazy(() => WorkoutWhereInputSchema).optional(),
});

export const UserSettingsNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserSettingsNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserSettingsWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserSettingsWhereInputSchema).optional().nullable(),
});

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ExerciseSplitOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ExerciseSplitOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkoutOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  migratedFromV2: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  migratedFromV2: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  migratedFromV2: z.lazy(() => SortOrderSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> = z.strictObject({
  provider: z.string(),
  providerAccountId: z.string(),
});

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.strictObject({
  expires_at: z.lazy(() => SortOrderSchema).optional(),
});

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.strictObject({
  expires_at: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.strictObject({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.strictObject({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.strictObject({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const VerificationTokenIdentifierTokenCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput> = z.strictObject({
  identifier: z.string(),
  token: z.string(),
});

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput> = z.strictObject({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
});

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput> = z.strictObject({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
});

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput> = z.strictObject({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumQuotesDisplayModeNullableListFilterSchema: z.ZodType<Prisma.EnumQuotesDisplayModeNullableListFilter> = z.strictObject({
  equals: z.lazy(() => QuotesDisplayModeSchema).array().optional().nullable(),
  has: z.lazy(() => QuotesDisplayModeSchema).optional().nullable(),
  hasEvery: z.lazy(() => QuotesDisplayModeSchema).array().optional(),
  hasSome: z.lazy(() => QuotesDisplayModeSchema).array().optional(),
  isEmpty: z.boolean().optional(),
});

export const UserSettingsCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserSettingsCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  motivationalQuotesEnabled: z.lazy(() => SortOrderSchema).optional(),
  quotesDisplayModes: z.lazy(() => SortOrderSchema).optional(),
});

export const UserSettingsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserSettingsMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  motivationalQuotesEnabled: z.lazy(() => SortOrderSchema).optional(),
});

export const UserSettingsMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserSettingsMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  motivationalQuotesEnabled: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumWorkoutStatusNullableFilterSchema: z.ZodType<Prisma.EnumWorkoutStatusNullableFilter> = z.strictObject({
  equals: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
  in: z.lazy(() => WorkoutStatusSchema).array().optional().nullable(),
  notIn: z.lazy(() => WorkoutStatusSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NestedEnumWorkoutStatusNullableFilterSchema) ]).optional().nullable(),
});

export const WorkoutScalarRelationFilterSchema: z.ZodType<Prisma.WorkoutScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => WorkoutWhereInputSchema).optional(),
  isNot: z.lazy(() => WorkoutWhereInputSchema).optional(),
});

export const WorkoutOfMesocycleCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  splitDayIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutStatus: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutOfMesocycleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleAvgOrderByAggregateInput> = z.strictObject({
  splitDayIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutOfMesocycleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  splitDayIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutStatus: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutOfMesocycleMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  mesocycleId: z.lazy(() => SortOrderSchema).optional(),
  splitDayIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutStatus: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutOfMesocycleSumOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleSumOrderByAggregateInput> = z.strictObject({
  splitDayIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumWorkoutStatusNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumWorkoutStatusNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
  in: z.lazy(() => WorkoutStatusSchema).array().optional().nullable(),
  notIn: z.lazy(() => WorkoutStatusSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NestedEnumWorkoutStatusNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkoutStatusNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkoutStatusNullableFilterSchema).optional(),
});

export const WorkoutOfMesocycleNullableScalarRelationFilterSchema: z.ZodType<Prisma.WorkoutOfMesocycleNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => WorkoutOfMesocycleWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => WorkoutOfMesocycleWhereInputSchema).optional().nullable(),
});

export const WorkoutExerciseListRelationFilterSchema: z.ZodType<Prisma.WorkoutExerciseListRelationFilter> = z.strictObject({
  every: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
  some: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
  none: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
});

export const WorkoutExerciseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userBodyweight: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  endedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutAvgOrderByAggregateInput> = z.strictObject({
  userBodyweight: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userBodyweight: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  endedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userBodyweight: z.lazy(() => SortOrderSchema).optional(),
  startedAt: z.lazy(() => SortOrderSchema).optional(),
  endedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutSumOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutSumOrderByAggregateInput> = z.strictObject({
  userBodyweight: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseSetListRelationFilterSchema: z.ZodType<Prisma.WorkoutExerciseSetListRelationFilter> = z.strictObject({
  every: z.lazy(() => WorkoutExerciseSetWhereInputSchema).optional(),
  some: z.lazy(() => WorkoutExerciseSetWhereInputSchema).optional(),
  none: z.lazy(() => WorkoutExerciseSetWhereInputSchema).optional(),
});

export const WorkoutExerciseSetOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  mesocycleExerciseTemplateId: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  isDeload: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseAvgOrderByAggregateInput> = z.strictObject({
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  mesocycleExerciseTemplateId: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  isDeload: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  workoutId: z.lazy(() => SortOrderSchema).optional(),
  targetMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  customMuscleGroup: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  setType: z.lazy(() => SortOrderSchema).optional(),
  changeType: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  note: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  lastSetToFailure: z.lazy(() => SortOrderSchema).optional(),
  forceRIRMatching: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  preferredProgressionVariable: z.lazy(() => SortOrderSchema).optional(),
  repRangeMode: z.lazy(() => SortOrderSchema).optional(),
  mesocycleExerciseTemplateId: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  isDeload: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseSumOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseSumOrderByAggregateInput> = z.strictObject({
  exerciseIndex: z.lazy(() => SortOrderSchema).optional(),
  bodyweightFraction: z.lazy(() => SortOrderSchema).optional(),
  changeAmount: z.lazy(() => SortOrderSchema).optional(),
  repRangeStart: z.lazy(() => SortOrderSchema).optional(),
  repRangeEnd: z.lazy(() => SortOrderSchema).optional(),
  overloadPercentage: z.lazy(() => SortOrderSchema).optional(),
  minimumWeightChange: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeStart: z.lazy(() => SortOrderSchema).optional(),
  topRepRangeEnd: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseScalarRelationFilterSchema: z.ZodType<Prisma.WorkoutExerciseScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
  isNot: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
});

export const WorkoutExerciseMiniSetListRelationFilterSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetListRelationFilter> = z.strictObject({
  every: z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema).optional(),
  some: z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema).optional(),
  none: z.lazy(() => WorkoutExerciseMiniSetWhereInputSchema).optional(),
});

export const WorkoutExerciseMiniSetOrderByRelationAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseSetCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  skipped: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseSetAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetAvgOrderByAggregateInput> = z.strictObject({
  setIndex: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseSetMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  skipped: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseSetMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  setIndex: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseId: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  skipped: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseSetSumOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseSetSumOrderByAggregateInput> = z.strictObject({
  setIndex: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseSetScalarRelationFilterSchema: z.ZodType<Prisma.WorkoutExerciseSetScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => WorkoutExerciseSetWhereInputSchema).optional(),
  isNot: z.lazy(() => WorkoutExerciseSetWhereInputSchema).optional(),
});

export const WorkoutExerciseMiniSetCountOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  miniSetIndex: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseSetId: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseMiniSetAvgOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetAvgOrderByAggregateInput> = z.strictObject({
  miniSetIndex: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseMiniSetMaxOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  miniSetIndex: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseSetId: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseMiniSetMinOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  miniSetIndex: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
  workoutExerciseSetId: z.lazy(() => SortOrderSchema).optional(),
});

export const WorkoutExerciseMiniSetSumOrderByAggregateInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetSumOrderByAggregateInput> = z.strictObject({
  miniSetIndex: z.lazy(() => SortOrderSchema).optional(),
  reps: z.lazy(() => SortOrderSchema).optional(),
  load: z.lazy(() => SortOrderSchema).optional(),
  RIR: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCreateNestedOneWithoutExerciseSplitsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutExerciseSplitsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutExerciseSplitsInputSchema), z.lazy(() => UserUncheckedCreateWithoutExerciseSplitsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutExerciseSplitsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const ExerciseSplitDayCreateNestedManyWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayCreateNestedManyWithoutExerciseSplitInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema).array(), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseSplitDayCreateManyExerciseSplitInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleCreateNestedManyWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleCreateNestedManyWithoutExerciseSplitInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema).array(), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCreateOrConnectWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleCreateOrConnectWithoutExerciseSplitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCreateManyExerciseSplitInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
});

export const ExerciseSplitDayUncheckedCreateNestedManyWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedCreateNestedManyWithoutExerciseSplitInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema).array(), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseSplitDayCreateManyExerciseSplitInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleUncheckedCreateNestedManyWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleUncheckedCreateNestedManyWithoutExerciseSplitInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema).array(), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCreateOrConnectWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleCreateOrConnectWithoutExerciseSplitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCreateManyExerciseSplitInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const UserUpdateOneRequiredWithoutExerciseSplitsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutExerciseSplitsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutExerciseSplitsInputSchema), z.lazy(() => UserUncheckedCreateWithoutExerciseSplitsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutExerciseSplitsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutExerciseSplitsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutExerciseSplitsInputSchema), z.lazy(() => UserUpdateWithoutExerciseSplitsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutExerciseSplitsInputSchema) ]).optional(),
});

export const ExerciseSplitDayUpdateManyWithoutExerciseSplitNestedInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateManyWithoutExerciseSplitNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema).array(), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExerciseSplitDayUpsertWithWhereUniqueWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUpsertWithWhereUniqueWithoutExerciseSplitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseSplitDayCreateManyExerciseSplitInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExerciseSplitDayUpdateWithWhereUniqueWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUpdateWithWhereUniqueWithoutExerciseSplitInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExerciseSplitDayUpdateManyWithWhereWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUpdateManyWithWhereWithoutExerciseSplitInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExerciseSplitDayScalarWhereInputSchema), z.lazy(() => ExerciseSplitDayScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleUpdateManyWithoutExerciseSplitNestedInputSchema: z.ZodType<Prisma.MesocycleUpdateManyWithoutExerciseSplitNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema).array(), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCreateOrConnectWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleCreateOrConnectWithoutExerciseSplitInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleUpsertWithWhereUniqueWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUpsertWithWhereUniqueWithoutExerciseSplitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCreateManyExerciseSplitInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleUpdateWithWhereUniqueWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUpdateWithWhereUniqueWithoutExerciseSplitInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleUpdateManyWithWhereWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUpdateManyWithWhereWithoutExerciseSplitInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleScalarWhereInputSchema), z.lazy(() => MesocycleScalarWhereInputSchema).array() ]).optional(),
});

export const ExerciseSplitDayUncheckedUpdateManyWithoutExerciseSplitNestedInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedUpdateManyWithoutExerciseSplitNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema).array(), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExerciseSplitDayUpsertWithWhereUniqueWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUpsertWithWhereUniqueWithoutExerciseSplitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseSplitDayCreateManyExerciseSplitInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExerciseSplitDayUpdateWithWhereUniqueWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUpdateWithWhereUniqueWithoutExerciseSplitInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExerciseSplitDayUpdateManyWithWhereWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUpdateManyWithWhereWithoutExerciseSplitInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExerciseSplitDayScalarWhereInputSchema), z.lazy(() => ExerciseSplitDayScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleUncheckedUpdateManyWithoutExerciseSplitNestedInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateManyWithoutExerciseSplitNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema).array(), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCreateOrConnectWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleCreateOrConnectWithoutExerciseSplitInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleUpsertWithWhereUniqueWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUpsertWithWhereUniqueWithoutExerciseSplitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCreateManyExerciseSplitInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleUpdateWithWhereUniqueWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUpdateWithWhereUniqueWithoutExerciseSplitInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleUpdateManyWithWhereWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUpdateManyWithWhereWithoutExerciseSplitInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleScalarWhereInputSchema), z.lazy(() => MesocycleScalarWhereInputSchema).array() ]).optional(),
});

export const ExerciseTemplateCreateNestedManyWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateCreateNestedManyWithoutExerciseSplitDayInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema).array(), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseTemplateCreateManyExerciseSplitDayInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
});

export const ExerciseSplitCreateNestedOneWithoutExerciseSplitDaysInputSchema: z.ZodType<Prisma.ExerciseSplitCreateNestedOneWithoutExerciseSplitDaysInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutExerciseSplitDaysInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutExerciseSplitDaysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExerciseSplitCreateOrConnectWithoutExerciseSplitDaysInputSchema).optional(),
  connect: z.lazy(() => ExerciseSplitWhereUniqueInputSchema).optional(),
});

export const ExerciseTemplateUncheckedCreateNestedManyWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateUncheckedCreateNestedManyWithoutExerciseSplitDayInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema).array(), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseTemplateCreateManyExerciseSplitDayInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const ExerciseTemplateUpdateManyWithoutExerciseSplitDayNestedInputSchema: z.ZodType<Prisma.ExerciseTemplateUpdateManyWithoutExerciseSplitDayNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema).array(), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExerciseTemplateUpsertWithWhereUniqueWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUpsertWithWhereUniqueWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseTemplateCreateManyExerciseSplitDayInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExerciseTemplateUpdateWithWhereUniqueWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUpdateWithWhereUniqueWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExerciseTemplateUpdateManyWithWhereWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUpdateManyWithWhereWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExerciseTemplateScalarWhereInputSchema), z.lazy(() => ExerciseTemplateScalarWhereInputSchema).array() ]).optional(),
});

export const ExerciseSplitUpdateOneRequiredWithoutExerciseSplitDaysNestedInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateOneRequiredWithoutExerciseSplitDaysNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutExerciseSplitDaysInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutExerciseSplitDaysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExerciseSplitCreateOrConnectWithoutExerciseSplitDaysInputSchema).optional(),
  upsert: z.lazy(() => ExerciseSplitUpsertWithoutExerciseSplitDaysInputSchema).optional(),
  connect: z.lazy(() => ExerciseSplitWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ExerciseSplitUpdateToOneWithWhereWithoutExerciseSplitDaysInputSchema), z.lazy(() => ExerciseSplitUpdateWithoutExerciseSplitDaysInputSchema), z.lazy(() => ExerciseSplitUncheckedUpdateWithoutExerciseSplitDaysInputSchema) ]).optional(),
});

export const ExerciseTemplateUncheckedUpdateManyWithoutExerciseSplitDayNestedInputSchema: z.ZodType<Prisma.ExerciseTemplateUncheckedUpdateManyWithoutExerciseSplitDayNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema).array(), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExerciseTemplateUpsertWithWhereUniqueWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUpsertWithWhereUniqueWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseTemplateCreateManyExerciseSplitDayInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExerciseTemplateWhereUniqueInputSchema), z.lazy(() => ExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExerciseTemplateUpdateWithWhereUniqueWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUpdateWithWhereUniqueWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExerciseTemplateUpdateManyWithWhereWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUpdateManyWithWhereWithoutExerciseSplitDayInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExerciseTemplateScalarWhereInputSchema), z.lazy(() => ExerciseTemplateScalarWhereInputSchema).array() ]).optional(),
});

export const ExerciseSplitDayCreateNestedOneWithoutExercisesInputSchema: z.ZodType<Prisma.ExerciseSplitDayCreateNestedOneWithoutExercisesInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExercisesInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExercisesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExercisesInputSchema).optional(),
  connect: z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).optional(),
});

export const EnumMuscleGroupFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumMuscleGroupFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => MuscleGroupSchema).optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const EnumSetTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSetTypeFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => SetTypeSchema).optional(),
});

export const NullableEnumChangeTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumChangeTypeFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => ChangeTypeSchema).optional().nullable(),
});

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const ExerciseSplitDayUpdateOneRequiredWithoutExercisesNestedInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateOneRequiredWithoutExercisesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExercisesInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExercisesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExerciseSplitDayCreateOrConnectWithoutExercisesInputSchema).optional(),
  upsert: z.lazy(() => ExerciseSplitDayUpsertWithoutExercisesInputSchema).optional(),
  connect: z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ExerciseSplitDayUpdateToOneWithWhereWithoutExercisesInputSchema), z.lazy(() => ExerciseSplitDayUpdateWithoutExercisesInputSchema), z.lazy(() => ExerciseSplitDayUncheckedUpdateWithoutExercisesInputSchema) ]).optional(),
});

export const MesocycleCreateRIRProgressionInputSchema: z.ZodType<Prisma.MesocycleCreateRIRProgressionInput> = z.strictObject({
  set: z.number().array(),
});

export const UserCreateNestedOneWithoutMesocyclesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutMesocyclesInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutMesocyclesInputSchema), z.lazy(() => UserUncheckedCreateWithoutMesocyclesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMesocyclesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const ExerciseSplitCreateNestedOneWithoutUsedByMesocyclesInputSchema: z.ZodType<Prisma.ExerciseSplitCreateNestedOneWithoutUsedByMesocyclesInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUsedByMesocyclesInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUsedByMesocyclesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExerciseSplitCreateOrConnectWithoutUsedByMesocyclesInputSchema).optional(),
  connect: z.lazy(() => ExerciseSplitWhereUniqueInputSchema).optional(),
});

export const MesocycleExerciseSplitDayCreateNestedManyWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateNestedManyWithoutMesocycleInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema).array(), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleExerciseSplitDayCreateManyMesocycleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleCyclicSetChangeCreateNestedManyWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateNestedManyWithoutMesocycleInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema).array(), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCyclicSetChangeCreateManyMesocycleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutOfMesocycleCreateNestedManyWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateNestedManyWithoutMesocycleInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema).array(), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutOfMesocycleCreateManyMesocycleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleExerciseSplitDayUncheckedCreateNestedManyWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedCreateNestedManyWithoutMesocycleInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema).array(), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleExerciseSplitDayCreateManyMesocycleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleCyclicSetChangeUncheckedCreateNestedManyWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUncheckedCreateNestedManyWithoutMesocycleInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema).array(), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCyclicSetChangeCreateManyMesocycleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutOfMesocycleUncheckedCreateNestedManyWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedCreateNestedManyWithoutMesocycleInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema).array(), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutOfMesocycleCreateManyMesocycleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleUpdateRIRProgressionInputSchema: z.ZodType<Prisma.MesocycleUpdateRIRProgressionInput> = z.strictObject({
  set: z.number().array().optional(),
  push: z.union([ z.number(),z.number().array() ]).optional(),
});

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional().nullable(),
});

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const EnumProgressionVariableFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumProgressionVariableFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => ProgressionVariableSchema).optional(),
});

export const EnumRepRangeModeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRepRangeModeFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => RepRangeModeSchema).optional(),
});

export const UserUpdateOneRequiredWithoutMesocyclesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutMesocyclesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutMesocyclesInputSchema), z.lazy(() => UserUncheckedCreateWithoutMesocyclesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMesocyclesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutMesocyclesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutMesocyclesInputSchema), z.lazy(() => UserUpdateWithoutMesocyclesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutMesocyclesInputSchema) ]).optional(),
});

export const ExerciseSplitUpdateOneWithoutUsedByMesocyclesNestedInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateOneWithoutUsedByMesocyclesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUsedByMesocyclesInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUsedByMesocyclesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExerciseSplitCreateOrConnectWithoutUsedByMesocyclesInputSchema).optional(),
  upsert: z.lazy(() => ExerciseSplitUpsertWithoutUsedByMesocyclesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ExerciseSplitWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ExerciseSplitWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ExerciseSplitWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ExerciseSplitUpdateToOneWithWhereWithoutUsedByMesocyclesInputSchema), z.lazy(() => ExerciseSplitUpdateWithoutUsedByMesocyclesInputSchema), z.lazy(() => ExerciseSplitUncheckedUpdateWithoutUsedByMesocyclesInputSchema) ]).optional(),
});

export const MesocycleExerciseSplitDayUpdateManyWithoutMesocycleNestedInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateManyWithoutMesocycleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema).array(), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpsertWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUpsertWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleExerciseSplitDayCreateManyMesocycleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUpdateWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateManyWithWhereWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUpdateManyWithWhereWithoutMesocycleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema), z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleCyclicSetChangeUpdateManyWithoutMesocycleNestedInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpdateManyWithoutMesocycleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema).array(), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleCyclicSetChangeUpsertWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUpsertWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCyclicSetChangeCreateManyMesocycleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleCyclicSetChangeUpdateWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUpdateWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleCyclicSetChangeUpdateManyWithWhereWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUpdateManyWithWhereWithoutMesocycleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema), z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutOfMesocycleUpdateManyWithoutMesocycleNestedInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateManyWithoutMesocycleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema).array(), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutOfMesocycleUpsertWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUpsertWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutOfMesocycleCreateManyMesocycleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUpdateWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateManyWithWhereWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUpdateManyWithWhereWithoutMesocycleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema), z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleNestedInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema).array(), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpsertWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUpsertWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleExerciseSplitDayCreateManyMesocycleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUpdateWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateManyWithWhereWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUpdateManyWithWhereWithoutMesocycleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema), z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleNestedInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema).array(), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleCyclicSetChangeUpsertWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUpsertWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCyclicSetChangeCreateManyMesocycleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema), z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleCyclicSetChangeUpdateWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUpdateWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleCyclicSetChangeUpdateManyWithWhereWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUpdateManyWithWhereWithoutMesocycleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema), z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleNestedInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema).array(), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutOfMesocycleUpsertWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUpsertWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutOfMesocycleCreateManyMesocycleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema), z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateWithWhereUniqueWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUpdateWithWhereUniqueWithoutMesocycleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateManyWithWhereWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUpdateManyWithWhereWithoutMesocycleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema), z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleCreateNestedOneWithoutMesocycleCyclicSetChangesInputSchema: z.ZodType<Prisma.MesocycleCreateNestedOneWithoutMesocycleCyclicSetChangesInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutMesocycleCyclicSetChangesInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutMesocycleCyclicSetChangesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MesocycleCreateOrConnectWithoutMesocycleCyclicSetChangesInputSchema).optional(),
  connect: z.lazy(() => MesocycleWhereUniqueInputSchema).optional(),
});

export const MesocycleUpdateOneRequiredWithoutMesocycleCyclicSetChangesNestedInputSchema: z.ZodType<Prisma.MesocycleUpdateOneRequiredWithoutMesocycleCyclicSetChangesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutMesocycleCyclicSetChangesInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutMesocycleCyclicSetChangesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MesocycleCreateOrConnectWithoutMesocycleCyclicSetChangesInputSchema).optional(),
  upsert: z.lazy(() => MesocycleUpsertWithoutMesocycleCyclicSetChangesInputSchema).optional(),
  connect: z.lazy(() => MesocycleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MesocycleUpdateToOneWithWhereWithoutMesocycleCyclicSetChangesInputSchema), z.lazy(() => MesocycleUpdateWithoutMesocycleCyclicSetChangesInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutMesocycleCyclicSetChangesInputSchema) ]).optional(),
});

export const MesocycleCreateNestedOneWithoutMesocycleExerciseSplitDaysInputSchema: z.ZodType<Prisma.MesocycleCreateNestedOneWithoutMesocycleExerciseSplitDaysInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutMesocycleExerciseSplitDaysInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutMesocycleExerciseSplitDaysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MesocycleCreateOrConnectWithoutMesocycleExerciseSplitDaysInputSchema).optional(),
  connect: z.lazy(() => MesocycleWhereUniqueInputSchema).optional(),
});

export const MesocycleExerciseTemplateCreateNestedManyWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateNestedManyWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema).array(), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleExerciseTemplateUncheckedCreateNestedManyWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUncheckedCreateNestedManyWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema).array(), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleUpdateOneRequiredWithoutMesocycleExerciseSplitDaysNestedInputSchema: z.ZodType<Prisma.MesocycleUpdateOneRequiredWithoutMesocycleExerciseSplitDaysNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutMesocycleExerciseSplitDaysInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutMesocycleExerciseSplitDaysInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MesocycleCreateOrConnectWithoutMesocycleExerciseSplitDaysInputSchema).optional(),
  upsert: z.lazy(() => MesocycleUpsertWithoutMesocycleExerciseSplitDaysInputSchema).optional(),
  connect: z.lazy(() => MesocycleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MesocycleUpdateToOneWithWhereWithoutMesocycleExerciseSplitDaysInputSchema), z.lazy(() => MesocycleUpdateWithoutMesocycleExerciseSplitDaysInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutMesocycleExerciseSplitDaysInputSchema) ]).optional(),
});

export const MesocycleExerciseTemplateUpdateManyWithoutMesocycleExerciseSplitDayNestedInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpdateManyWithoutMesocycleExerciseSplitDayNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema).array(), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleExerciseTemplateUpsertWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUpsertWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleExerciseTemplateUpdateWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUpdateWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleExerciseTemplateUpdateManyWithWhereWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUpdateManyWithWhereWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema), z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleExerciseTemplateUncheckedUpdateManyWithoutMesocycleExerciseSplitDayNestedInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUncheckedUpdateManyWithoutMesocycleExerciseSplitDayNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema).array(), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleExerciseTemplateUpsertWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUpsertWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema), z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleExerciseTemplateUpdateWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUpdateWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleExerciseTemplateUpdateManyWithWhereWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUpdateManyWithWhereWithoutMesocycleExerciseSplitDayInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema), z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleExerciseSplitDayCreateNestedOneWithoutMesocycleSplitDayExercisesInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateNestedOneWithoutMesocycleSplitDayExercisesInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleSplitDayExercisesInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleSplitDayExercisesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleSplitDayExercisesInputSchema).optional(),
  connect: z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).optional(),
});

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional().nullable(),
});

export const NullableEnumProgressionVariableFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumProgressionVariableFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
});

export const NullableEnumRepRangeModeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumRepRangeModeFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => RepRangeModeSchema).optional().nullable(),
});

export const MesocycleExerciseSplitDayUpdateOneRequiredWithoutMesocycleSplitDayExercisesNestedInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateOneRequiredWithoutMesocycleSplitDayExercisesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleSplitDayExercisesInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleSplitDayExercisesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleSplitDayExercisesInputSchema).optional(),
  upsert: z.lazy(() => MesocycleExerciseSplitDayUpsertWithoutMesocycleSplitDayExercisesInputSchema).optional(),
  connect: z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateToOneWithWhereWithoutMesocycleSplitDayExercisesInputSchema), z.lazy(() => MesocycleExerciseSplitDayUpdateWithoutMesocycleSplitDayExercisesInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateWithoutMesocycleSplitDayExercisesInputSchema) ]).optional(),
});

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
});

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
});

export const ExerciseSplitCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema).array(), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseSplitCreateOrConnectWithoutUserInputSchema), z.lazy(() => ExerciseSplitCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseSplitCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MesocycleCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutUserInputSchema), z.lazy(() => MesocycleCreateWithoutUserInputSchema).array(), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCreateOrConnectWithoutUserInputSchema), z.lazy(() => MesocycleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.WorkoutCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutUserInputSchema), z.lazy(() => WorkoutCreateWithoutUserInputSchema).array(), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutCreateOrConnectWithoutUserInputSchema), z.lazy(() => WorkoutCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
});

export const UserSettingsCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => UserSettingsWhereUniqueInputSchema).optional(),
});

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
});

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
});

export const ExerciseSplitUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema).array(), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseSplitCreateOrConnectWithoutUserInputSchema), z.lazy(() => ExerciseSplitCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseSplitCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
});

export const MesocycleUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MesocycleUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutUserInputSchema), z.lazy(() => MesocycleCreateWithoutUserInputSchema).array(), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCreateOrConnectWithoutUserInputSchema), z.lazy(() => MesocycleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.WorkoutUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutUserInputSchema), z.lazy(() => WorkoutCreateWithoutUserInputSchema).array(), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutCreateOrConnectWithoutUserInputSchema), z.lazy(() => WorkoutCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
});

export const UserSettingsUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUncheckedCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => UserSettingsWhereUniqueInputSchema).optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
});

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
});

export const ExerciseSplitUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema).array(), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseSplitCreateOrConnectWithoutUserInputSchema), z.lazy(() => ExerciseSplitCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExerciseSplitUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ExerciseSplitUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseSplitCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExerciseSplitUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ExerciseSplitUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExerciseSplitUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ExerciseSplitUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExerciseSplitScalarWhereInputSchema), z.lazy(() => ExerciseSplitScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MesocycleUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutUserInputSchema), z.lazy(() => MesocycleCreateWithoutUserInputSchema).array(), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCreateOrConnectWithoutUserInputSchema), z.lazy(() => MesocycleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => MesocycleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => MesocycleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => MesocycleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleScalarWhereInputSchema), z.lazy(() => MesocycleScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.WorkoutUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutUserInputSchema), z.lazy(() => WorkoutCreateWithoutUserInputSchema).array(), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutCreateOrConnectWithoutUserInputSchema), z.lazy(() => WorkoutCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => WorkoutUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => WorkoutUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => WorkoutUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutScalarWhereInputSchema), z.lazy(() => WorkoutScalarWhereInputSchema).array() ]).optional(),
});

export const UserSettingsUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.UserSettingsUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => UserSettingsUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserSettingsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserSettingsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserSettingsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserSettingsUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => UserSettingsUpdateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
});

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
});

export const ExerciseSplitUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema).array(), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExerciseSplitCreateOrConnectWithoutUserInputSchema), z.lazy(() => ExerciseSplitCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExerciseSplitUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ExerciseSplitUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExerciseSplitCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExerciseSplitWhereUniqueInputSchema), z.lazy(() => ExerciseSplitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExerciseSplitUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ExerciseSplitUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExerciseSplitUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ExerciseSplitUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExerciseSplitScalarWhereInputSchema), z.lazy(() => ExerciseSplitScalarWhereInputSchema).array() ]).optional(),
});

export const MesocycleUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutUserInputSchema), z.lazy(() => MesocycleCreateWithoutUserInputSchema).array(), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MesocycleCreateOrConnectWithoutUserInputSchema), z.lazy(() => MesocycleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MesocycleUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => MesocycleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MesocycleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MesocycleWhereUniqueInputSchema), z.lazy(() => MesocycleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MesocycleUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => MesocycleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MesocycleUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => MesocycleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MesocycleScalarWhereInputSchema), z.lazy(() => MesocycleScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutUserInputSchema), z.lazy(() => WorkoutCreateWithoutUserInputSchema).array(), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutCreateOrConnectWithoutUserInputSchema), z.lazy(() => WorkoutCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => WorkoutUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutWhereUniqueInputSchema), z.lazy(() => WorkoutWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => WorkoutUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => WorkoutUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutScalarWhereInputSchema), z.lazy(() => WorkoutScalarWhereInputSchema).array() ]).optional(),
});

export const UserSettingsUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.UserSettingsUncheckedUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserSettingsCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => UserSettingsUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserSettingsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserSettingsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserSettingsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserSettingsUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => UserSettingsUpdateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema), z.lazy(() => UserUpdateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
});

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema), z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
});

export const UserSettingsCreatequotesDisplayModesInputSchema: z.ZodType<Prisma.UserSettingsCreatequotesDisplayModesInput> = z.strictObject({
  set: z.lazy(() => QuotesDisplayModeSchema).array(),
});

export const UserCreateNestedOneWithoutSettingsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSettingsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutSettingsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSettingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSettingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserSettingsUpdatequotesDisplayModesInputSchema: z.ZodType<Prisma.UserSettingsUpdatequotesDisplayModesInput> = z.strictObject({
  set: z.lazy(() => QuotesDisplayModeSchema).array().optional(),
  push: z.union([ z.lazy(() => QuotesDisplayModeSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const UserUpdateOneRequiredWithoutSettingsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSettingsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutSettingsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSettingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSettingsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSettingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSettingsInputSchema), z.lazy(() => UserUpdateWithoutSettingsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSettingsInputSchema) ]).optional(),
});

export const WorkoutCreateNestedOneWithoutWorkoutOfMesocycleInputSchema: z.ZodType<Prisma.WorkoutCreateNestedOneWithoutWorkoutOfMesocycleInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutOfMesocycleInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutOfMesocycleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutOfMesocycleInputSchema).optional(),
  connect: z.lazy(() => WorkoutWhereUniqueInputSchema).optional(),
});

export const MesocycleCreateNestedOneWithoutWorkoutsOfMesocycleInputSchema: z.ZodType<Prisma.MesocycleCreateNestedOneWithoutWorkoutsOfMesocycleInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutWorkoutsOfMesocycleInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutWorkoutsOfMesocycleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MesocycleCreateOrConnectWithoutWorkoutsOfMesocycleInputSchema).optional(),
  connect: z.lazy(() => MesocycleWhereUniqueInputSchema).optional(),
});

export const NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumWorkoutStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
});

export const WorkoutUpdateOneRequiredWithoutWorkoutOfMesocycleNestedInputSchema: z.ZodType<Prisma.WorkoutUpdateOneRequiredWithoutWorkoutOfMesocycleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutOfMesocycleInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutOfMesocycleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutOfMesocycleInputSchema).optional(),
  upsert: z.lazy(() => WorkoutUpsertWithoutWorkoutOfMesocycleInputSchema).optional(),
  connect: z.lazy(() => WorkoutWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkoutUpdateToOneWithWhereWithoutWorkoutOfMesocycleInputSchema), z.lazy(() => WorkoutUpdateWithoutWorkoutOfMesocycleInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutOfMesocycleInputSchema) ]).optional(),
});

export const MesocycleUpdateOneRequiredWithoutWorkoutsOfMesocycleNestedInputSchema: z.ZodType<Prisma.MesocycleUpdateOneRequiredWithoutWorkoutsOfMesocycleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MesocycleCreateWithoutWorkoutsOfMesocycleInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutWorkoutsOfMesocycleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MesocycleCreateOrConnectWithoutWorkoutsOfMesocycleInputSchema).optional(),
  upsert: z.lazy(() => MesocycleUpsertWithoutWorkoutsOfMesocycleInputSchema).optional(),
  connect: z.lazy(() => MesocycleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MesocycleUpdateToOneWithWhereWithoutWorkoutsOfMesocycleInputSchema), z.lazy(() => MesocycleUpdateWithoutWorkoutsOfMesocycleInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutWorkoutsOfMesocycleInputSchema) ]).optional(),
});

export const UserCreateNestedOneWithoutWorkoutsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutWorkoutsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutWorkoutsInputSchema), z.lazy(() => UserUncheckedCreateWithoutWorkoutsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWorkoutsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const WorkoutOfMesocycleCreateNestedOneWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateNestedOneWithoutWorkoutInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutWorkoutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutWorkoutInputSchema).optional(),
  connect: z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).optional(),
});

export const WorkoutExerciseCreateNestedManyWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateNestedManyWithoutWorkoutInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutOfMesocycleUncheckedCreateNestedOneWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedCreateNestedOneWithoutWorkoutInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutWorkoutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutWorkoutInputSchema).optional(),
  connect: z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).optional(),
});

export const WorkoutExerciseUncheckedCreateNestedManyWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateNestedManyWithoutWorkoutInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
});

export const UserUpdateOneRequiredWithoutWorkoutsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutWorkoutsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutWorkoutsInputSchema), z.lazy(() => UserUncheckedCreateWithoutWorkoutsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutWorkoutsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutWorkoutsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutWorkoutsInputSchema), z.lazy(() => UserUpdateWithoutWorkoutsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutWorkoutsInputSchema) ]).optional(),
});

export const WorkoutOfMesocycleUpdateOneWithoutWorkoutNestedInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateOneWithoutWorkoutNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutWorkoutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutWorkoutInputSchema).optional(),
  upsert: z.lazy(() => WorkoutOfMesocycleUpsertWithoutWorkoutInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => WorkoutOfMesocycleWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => WorkoutOfMesocycleWhereInputSchema) ]).optional(),
  connect: z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateToOneWithWhereWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUpdateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedUpdateWithoutWorkoutInputSchema) ]).optional(),
});

export const WorkoutExerciseUpdateManyWithoutWorkoutNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyWithoutWorkoutNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutOfMesocycleUncheckedUpdateOneWithoutWorkoutNestedInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedUpdateOneWithoutWorkoutNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutWorkoutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutOfMesocycleCreateOrConnectWithoutWorkoutInputSchema).optional(),
  upsert: z.lazy(() => WorkoutOfMesocycleUpsertWithoutWorkoutInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => WorkoutOfMesocycleWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => WorkoutOfMesocycleWhereInputSchema) ]).optional(),
  connect: z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateToOneWithWhereWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUpdateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedUpdateWithoutWorkoutInputSchema) ]).optional(),
});

export const WorkoutExerciseUncheckedUpdateManyWithoutWorkoutNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateManyWithoutWorkoutNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema).array(), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutCreateNestedOneWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutCreateNestedOneWithoutWorkoutExercisesInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutExercisesInputSchema).optional(),
  connect: z.lazy(() => WorkoutWhereUniqueInputSchema).optional(),
});

export const WorkoutExerciseSetCreateNestedManyWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateNestedManyWithoutWorkoutExerciseInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema).array(), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseSetCreateManyWorkoutExerciseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutExerciseSetUncheckedCreateNestedManyWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedCreateNestedManyWithoutWorkoutExerciseInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema).array(), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseSetCreateManyWorkoutExerciseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutUpdateOneRequiredWithoutWorkoutExercisesNestedInputSchema: z.ZodType<Prisma.WorkoutUpdateOneRequiredWithoutWorkoutExercisesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutCreateOrConnectWithoutWorkoutExercisesInputSchema).optional(),
  upsert: z.lazy(() => WorkoutUpsertWithoutWorkoutExercisesInputSchema).optional(),
  connect: z.lazy(() => WorkoutWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkoutUpdateToOneWithWhereWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUpdateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutExercisesInputSchema) ]).optional(),
});

export const WorkoutExerciseSetUpdateManyWithoutWorkoutExerciseNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateManyWithoutWorkoutExerciseNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema).array(), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseSetCreateManyWorkoutExerciseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema), z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutExerciseSetUncheckedUpdateManyWithoutWorkoutExerciseNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedUpdateManyWithoutWorkoutExerciseNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema).array(), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseSetCreateManyWorkoutExerciseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema), z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutExerciseCreateNestedOneWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateNestedOneWithoutSetsInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutSetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutExerciseCreateOrConnectWithoutSetsInputSchema).optional(),
  connect: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).optional(),
});

export const WorkoutExerciseMiniSetCreateNestedManyWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateNestedManyWithoutParentSetInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema).array(), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseMiniSetCreateManyParentSetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutExerciseMiniSetUncheckedCreateNestedManyWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUncheckedCreateNestedManyWithoutParentSetInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema).array(), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseMiniSetCreateManyParentSetInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
});

export const WorkoutExerciseUpdateOneRequiredWithoutSetsNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateOneRequiredWithoutSetsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutSetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutExerciseCreateOrConnectWithoutSetsInputSchema).optional(),
  upsert: z.lazy(() => WorkoutExerciseUpsertWithoutSetsInputSchema).optional(),
  connect: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateToOneWithWhereWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUpdateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutSetsInputSchema) ]).optional(),
});

export const WorkoutExerciseMiniSetUpdateManyWithoutParentSetNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpdateManyWithoutParentSetNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema).array(), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseMiniSetUpsertWithWhereUniqueWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUpsertWithWhereUniqueWithoutParentSetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseMiniSetCreateManyParentSetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseMiniSetUpdateWithWhereUniqueWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUpdateWithWhereUniqueWithoutParentSetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseMiniSetUpdateManyWithWhereWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUpdateManyWithWhereWithoutParentSetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema), z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutExerciseMiniSetUncheckedUpdateManyWithoutParentSetNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUncheckedUpdateManyWithoutParentSetNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema).array(), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => WorkoutExerciseMiniSetUpsertWithWhereUniqueWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUpsertWithWhereUniqueWithoutParentSetInputSchema).array() ]).optional(),
  createMany: z.lazy(() => WorkoutExerciseMiniSetCreateManyParentSetInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema), z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseMiniSetUpdateWithWhereUniqueWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUpdateWithWhereUniqueWithoutParentSetInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => WorkoutExerciseMiniSetUpdateManyWithWhereWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUpdateManyWithWhereWithoutParentSetInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema), z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema).array() ]).optional(),
});

export const WorkoutExerciseSetCreateNestedOneWithoutMiniSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateNestedOneWithoutMiniSetsInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutMiniSetsInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutMiniSetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutMiniSetsInputSchema).optional(),
  connect: z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).optional(),
});

export const WorkoutExerciseSetUpdateOneRequiredWithoutMiniSetsNestedInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateOneRequiredWithoutMiniSetsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutMiniSetsInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutMiniSetsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => WorkoutExerciseSetCreateOrConnectWithoutMiniSetsInputSchema).optional(),
  upsert: z.lazy(() => WorkoutExerciseSetUpsertWithoutMiniSetsInputSchema).optional(),
  connect: z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => WorkoutExerciseSetUpdateToOneWithWhereWithoutMiniSetsInputSchema), z.lazy(() => WorkoutExerciseSetUpdateWithoutMiniSetsInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedUpdateWithoutMiniSetsInputSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const NestedEnumMuscleGroupFilterSchema: z.ZodType<Prisma.NestedEnumMuscleGroupFilter> = z.strictObject({
  equals: z.lazy(() => MuscleGroupSchema).optional(),
  in: z.lazy(() => MuscleGroupSchema).array().optional(),
  notIn: z.lazy(() => MuscleGroupSchema).array().optional(),
  not: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => NestedEnumMuscleGroupFilterSchema) ]).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumSetTypeFilterSchema: z.ZodType<Prisma.NestedEnumSetTypeFilter> = z.strictObject({
  equals: z.lazy(() => SetTypeSchema).optional(),
  in: z.lazy(() => SetTypeSchema).array().optional(),
  notIn: z.lazy(() => SetTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => NestedEnumSetTypeFilterSchema) ]).optional(),
});

export const NestedEnumChangeTypeNullableFilterSchema: z.ZodType<Prisma.NestedEnumChangeTypeNullableFilter> = z.strictObject({
  equals: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  in: z.lazy(() => ChangeTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => ChangeTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NestedEnumChangeTypeNullableFilterSchema) ]).optional().nullable(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumMuscleGroupWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumMuscleGroupWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => MuscleGroupSchema).optional(),
  in: z.lazy(() => MuscleGroupSchema).array().optional(),
  notIn: z.lazy(() => MuscleGroupSchema).array().optional(),
  not: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => NestedEnumMuscleGroupWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumMuscleGroupFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumMuscleGroupFilterSchema).optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const NestedEnumSetTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSetTypeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => SetTypeSchema).optional(),
  in: z.lazy(() => SetTypeSchema).array().optional(),
  notIn: z.lazy(() => SetTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => NestedEnumSetTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSetTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSetTypeFilterSchema).optional(),
});

export const NestedEnumChangeTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumChangeTypeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  in: z.lazy(() => ChangeTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => ChangeTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NestedEnumChangeTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumChangeTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumChangeTypeNullableFilterSchema).optional(),
});

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumProgressionVariableFilterSchema: z.ZodType<Prisma.NestedEnumProgressionVariableFilter> = z.strictObject({
  equals: z.lazy(() => ProgressionVariableSchema).optional(),
  in: z.lazy(() => ProgressionVariableSchema).array().optional(),
  notIn: z.lazy(() => ProgressionVariableSchema).array().optional(),
  not: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NestedEnumProgressionVariableFilterSchema) ]).optional(),
});

export const NestedEnumRepRangeModeFilterSchema: z.ZodType<Prisma.NestedEnumRepRangeModeFilter> = z.strictObject({
  equals: z.lazy(() => RepRangeModeSchema).optional(),
  in: z.lazy(() => RepRangeModeSchema).array().optional(),
  notIn: z.lazy(() => RepRangeModeSchema).array().optional(),
  not: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NestedEnumRepRangeModeFilterSchema) ]).optional(),
});

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const NestedEnumProgressionVariableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumProgressionVariableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ProgressionVariableSchema).optional(),
  in: z.lazy(() => ProgressionVariableSchema).array().optional(),
  notIn: z.lazy(() => ProgressionVariableSchema).array().optional(),
  not: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NestedEnumProgressionVariableWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProgressionVariableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProgressionVariableFilterSchema).optional(),
});

export const NestedEnumRepRangeModeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRepRangeModeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RepRangeModeSchema).optional(),
  in: z.lazy(() => RepRangeModeSchema).array().optional(),
  notIn: z.lazy(() => RepRangeModeSchema).array().optional(),
  not: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NestedEnumRepRangeModeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRepRangeModeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRepRangeModeFilterSchema).optional(),
});

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.strictObject({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumProgressionVariableNullableFilterSchema: z.ZodType<Prisma.NestedEnumProgressionVariableNullableFilter> = z.strictObject({
  equals: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  in: z.lazy(() => ProgressionVariableSchema).array().optional().nullable(),
  notIn: z.lazy(() => ProgressionVariableSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NestedEnumProgressionVariableNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumRepRangeModeNullableFilterSchema: z.ZodType<Prisma.NestedEnumRepRangeModeNullableFilter> = z.strictObject({
  equals: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  in: z.lazy(() => RepRangeModeSchema).array().optional().nullable(),
  notIn: z.lazy(() => RepRangeModeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NestedEnumRepRangeModeNullableFilterSchema) ]).optional().nullable(),
});

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
});

export const NestedEnumProgressionVariableNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumProgressionVariableNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  in: z.lazy(() => ProgressionVariableSchema).array().optional().nullable(),
  notIn: z.lazy(() => ProgressionVariableSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NestedEnumProgressionVariableNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProgressionVariableNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProgressionVariableNullableFilterSchema).optional(),
});

export const NestedEnumRepRangeModeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRepRangeModeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  in: z.lazy(() => RepRangeModeSchema).array().optional().nullable(),
  notIn: z.lazy(() => RepRangeModeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NestedEnumRepRangeModeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRepRangeModeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRepRangeModeNullableFilterSchema).optional(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedEnumWorkoutStatusNullableFilterSchema: z.ZodType<Prisma.NestedEnumWorkoutStatusNullableFilter> = z.strictObject({
  equals: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
  in: z.lazy(() => WorkoutStatusSchema).array().optional().nullable(),
  notIn: z.lazy(() => WorkoutStatusSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NestedEnumWorkoutStatusNullableFilterSchema) ]).optional().nullable(),
});

export const NestedEnumWorkoutStatusNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumWorkoutStatusNullableWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
  in: z.lazy(() => WorkoutStatusSchema).array().optional().nullable(),
  notIn: z.lazy(() => WorkoutStatusSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NestedEnumWorkoutStatusNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkoutStatusNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkoutStatusNullableFilterSchema).optional(),
});

export const UserCreateWithoutExerciseSplitsInputSchema: z.ZodType<Prisma.UserCreateWithoutExerciseSplitsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutExerciseSplitsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutExerciseSplitsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutExerciseSplitsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutExerciseSplitsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutExerciseSplitsInputSchema), z.lazy(() => UserUncheckedCreateWithoutExerciseSplitsInputSchema) ]),
});

export const ExerciseSplitDayCreateWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayCreateWithoutExerciseSplitInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  exercises: z.lazy(() => ExerciseTemplateCreateNestedManyWithoutExerciseSplitDayInputSchema).optional(),
});

export const ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  exercises: z.lazy(() => ExerciseTemplateUncheckedCreateNestedManyWithoutExerciseSplitDayInputSchema).optional(),
});

export const ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayCreateOrConnectWithoutExerciseSplitInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema) ]),
});

export const ExerciseSplitDayCreateManyExerciseSplitInputEnvelopeSchema: z.ZodType<Prisma.ExerciseSplitDayCreateManyExerciseSplitInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ExerciseSplitDayCreateManyExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayCreateManyExerciseSplitInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MesocycleCreateWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleCreateWithoutExerciseSplitInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  user: z.lazy(() => UserCreateNestedOneWithoutMesocyclesInputSchema),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayCreateNestedManyWithoutMesocycleInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleUncheckedCreateWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleUncheckedCreateWithoutExerciseSplitInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleCreateOrConnectWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleCreateOrConnectWithoutExerciseSplitInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema) ]),
});

export const MesocycleCreateManyExerciseSplitInputEnvelopeSchema: z.ZodType<Prisma.MesocycleCreateManyExerciseSplitInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MesocycleCreateManyExerciseSplitInputSchema), z.lazy(() => MesocycleCreateManyExerciseSplitInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserUpsertWithoutExerciseSplitsInputSchema: z.ZodType<Prisma.UserUpsertWithoutExerciseSplitsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutExerciseSplitsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutExerciseSplitsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutExerciseSplitsInputSchema), z.lazy(() => UserUncheckedCreateWithoutExerciseSplitsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutExerciseSplitsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutExerciseSplitsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutExerciseSplitsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutExerciseSplitsInputSchema) ]),
});

export const UserUpdateWithoutExerciseSplitsInputSchema: z.ZodType<Prisma.UserUpdateWithoutExerciseSplitsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutExerciseSplitsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutExerciseSplitsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const ExerciseSplitDayUpsertWithWhereUniqueWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpsertWithWhereUniqueWithoutExerciseSplitInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExerciseSplitDayUpdateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUncheckedUpdateWithoutExerciseSplitInputSchema) ]),
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExerciseSplitInputSchema) ]),
});

export const ExerciseSplitDayUpdateWithWhereUniqueWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateWithWhereUniqueWithoutExerciseSplitInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExerciseSplitDayUpdateWithoutExerciseSplitInputSchema), z.lazy(() => ExerciseSplitDayUncheckedUpdateWithoutExerciseSplitInputSchema) ]),
});

export const ExerciseSplitDayUpdateManyWithWhereWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateManyWithWhereWithoutExerciseSplitInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitDayScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExerciseSplitDayUpdateManyMutationInputSchema), z.lazy(() => ExerciseSplitDayUncheckedUpdateManyWithoutExerciseSplitInputSchema) ]),
});

export const ExerciseSplitDayScalarWhereInputSchema: z.ZodType<Prisma.ExerciseSplitDayScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseSplitDayScalarWhereInputSchema), z.lazy(() => ExerciseSplitDayScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseSplitDayScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseSplitDayScalarWhereInputSchema), z.lazy(() => ExerciseSplitDayScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  dayIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isRestDay: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  exerciseSplitId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const MesocycleUpsertWithWhereUniqueWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleUpsertWithWhereUniqueWithoutExerciseSplitInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MesocycleUpdateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutExerciseSplitInputSchema) ]),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutExerciseSplitInputSchema) ]),
});

export const MesocycleUpdateWithWhereUniqueWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleUpdateWithWhereUniqueWithoutExerciseSplitInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MesocycleUpdateWithoutExerciseSplitInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutExerciseSplitInputSchema) ]),
});

export const MesocycleUpdateManyWithWhereWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleUpdateManyWithWhereWithoutExerciseSplitInput> = z.strictObject({
  where: z.lazy(() => MesocycleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MesocycleUpdateManyMutationInputSchema), z.lazy(() => MesocycleUncheckedUpdateManyWithoutExerciseSplitInputSchema) ]),
});

export const MesocycleScalarWhereInputSchema: z.ZodType<Prisma.MesocycleScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleScalarWhereInputSchema), z.lazy(() => MesocycleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleScalarWhereInputSchema), z.lazy(() => MesocycleScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseSplitId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  RIRProgression: z.lazy(() => IntNullableListFilterSchema).optional(),
  startDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  endDate: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional(),
  lastSetToFailure: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  forceRIRMatching: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
});

export const ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateCreateWithoutExerciseSplitDayInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateCreateOrConnectWithoutExerciseSplitDayInput> = z.strictObject({
  where: z.lazy(() => ExerciseTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema) ]),
});

export const ExerciseTemplateCreateManyExerciseSplitDayInputEnvelopeSchema: z.ZodType<Prisma.ExerciseTemplateCreateManyExerciseSplitDayInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ExerciseTemplateCreateManyExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateCreateManyExerciseSplitDayInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ExerciseSplitCreateWithoutExerciseSplitDaysInputSchema: z.ZodType<Prisma.ExerciseSplitCreateWithoutExerciseSplitDaysInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutExerciseSplitsInputSchema),
  usedByMesocycles: z.lazy(() => MesocycleCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
});

export const ExerciseSplitUncheckedCreateWithoutExerciseSplitDaysInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedCreateWithoutExerciseSplitDaysInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  usedByMesocycles: z.lazy(() => MesocycleUncheckedCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
});

export const ExerciseSplitCreateOrConnectWithoutExerciseSplitDaysInputSchema: z.ZodType<Prisma.ExerciseSplitCreateOrConnectWithoutExerciseSplitDaysInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutExerciseSplitDaysInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutExerciseSplitDaysInputSchema) ]),
});

export const ExerciseTemplateUpsertWithWhereUniqueWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateUpsertWithWhereUniqueWithoutExerciseSplitDayInput> = z.strictObject({
  where: z.lazy(() => ExerciseTemplateWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExerciseTemplateUpdateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUncheckedUpdateWithoutExerciseSplitDayInputSchema) ]),
  create: z.union([ z.lazy(() => ExerciseTemplateCreateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUncheckedCreateWithoutExerciseSplitDayInputSchema) ]),
});

export const ExerciseTemplateUpdateWithWhereUniqueWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateUpdateWithWhereUniqueWithoutExerciseSplitDayInput> = z.strictObject({
  where: z.lazy(() => ExerciseTemplateWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExerciseTemplateUpdateWithoutExerciseSplitDayInputSchema), z.lazy(() => ExerciseTemplateUncheckedUpdateWithoutExerciseSplitDayInputSchema) ]),
});

export const ExerciseTemplateUpdateManyWithWhereWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateUpdateManyWithWhereWithoutExerciseSplitDayInput> = z.strictObject({
  where: z.lazy(() => ExerciseTemplateScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExerciseTemplateUpdateManyMutationInputSchema), z.lazy(() => ExerciseTemplateUncheckedUpdateManyWithoutExerciseSplitDayInputSchema) ]),
});

export const ExerciseTemplateScalarWhereInputSchema: z.ZodType<Prisma.ExerciseTemplateScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseTemplateScalarWhereInputSchema), z.lazy(() => ExerciseTemplateScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseTemplateScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseTemplateScalarWhereInputSchema), z.lazy(() => ExerciseTemplateScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  setType: z.union([ z.lazy(() => EnumSetTypeFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  repRangeStart: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  exerciseSplitDayId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
});

export const ExerciseSplitUpsertWithoutExerciseSplitDaysInputSchema: z.ZodType<Prisma.ExerciseSplitUpsertWithoutExerciseSplitDaysInput> = z.strictObject({
  update: z.union([ z.lazy(() => ExerciseSplitUpdateWithoutExerciseSplitDaysInputSchema), z.lazy(() => ExerciseSplitUncheckedUpdateWithoutExerciseSplitDaysInputSchema) ]),
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutExerciseSplitDaysInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutExerciseSplitDaysInputSchema) ]),
  where: z.lazy(() => ExerciseSplitWhereInputSchema).optional(),
});

export const ExerciseSplitUpdateToOneWithWhereWithoutExerciseSplitDaysInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateToOneWithWhereWithoutExerciseSplitDaysInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ExerciseSplitUpdateWithoutExerciseSplitDaysInputSchema), z.lazy(() => ExerciseSplitUncheckedUpdateWithoutExerciseSplitDaysInputSchema) ]),
});

export const ExerciseSplitUpdateWithoutExerciseSplitDaysInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateWithoutExerciseSplitDaysInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutExerciseSplitsNestedInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
});

export const ExerciseSplitUncheckedUpdateWithoutExerciseSplitDaysInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedUpdateWithoutExerciseSplitDaysInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  usedByMesocycles: z.lazy(() => MesocycleUncheckedUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
});

export const ExerciseSplitDayCreateWithoutExercisesInputSchema: z.ZodType<Prisma.ExerciseSplitDayCreateWithoutExercisesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  exerciseSplit: z.lazy(() => ExerciseSplitCreateNestedOneWithoutExerciseSplitDaysInputSchema),
});

export const ExerciseSplitDayUncheckedCreateWithoutExercisesInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedCreateWithoutExercisesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  exerciseSplitId: z.string(),
});

export const ExerciseSplitDayCreateOrConnectWithoutExercisesInputSchema: z.ZodType<Prisma.ExerciseSplitDayCreateOrConnectWithoutExercisesInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitDayWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExercisesInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExercisesInputSchema) ]),
});

export const ExerciseSplitDayUpsertWithoutExercisesInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpsertWithoutExercisesInput> = z.strictObject({
  update: z.union([ z.lazy(() => ExerciseSplitDayUpdateWithoutExercisesInputSchema), z.lazy(() => ExerciseSplitDayUncheckedUpdateWithoutExercisesInputSchema) ]),
  create: z.union([ z.lazy(() => ExerciseSplitDayCreateWithoutExercisesInputSchema), z.lazy(() => ExerciseSplitDayUncheckedCreateWithoutExercisesInputSchema) ]),
  where: z.lazy(() => ExerciseSplitDayWhereInputSchema).optional(),
});

export const ExerciseSplitDayUpdateToOneWithWhereWithoutExercisesInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateToOneWithWhereWithoutExercisesInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitDayWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ExerciseSplitDayUpdateWithoutExercisesInputSchema), z.lazy(() => ExerciseSplitDayUncheckedUpdateWithoutExercisesInputSchema) ]),
});

export const ExerciseSplitDayUpdateWithoutExercisesInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateWithoutExercisesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitUpdateOneRequiredWithoutExerciseSplitDaysNestedInputSchema).optional(),
});

export const ExerciseSplitDayUncheckedUpdateWithoutExercisesInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedUpdateWithoutExercisesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserCreateWithoutMesocyclesInputSchema: z.ZodType<Prisma.UserCreateWithoutMesocyclesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutMesocyclesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutMesocyclesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutMesocyclesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutMesocyclesInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutMesocyclesInputSchema), z.lazy(() => UserUncheckedCreateWithoutMesocyclesInputSchema) ]),
});

export const ExerciseSplitCreateWithoutUsedByMesocyclesInputSchema: z.ZodType<Prisma.ExerciseSplitCreateWithoutUsedByMesocyclesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutExerciseSplitsInputSchema),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
});

export const ExerciseSplitUncheckedCreateWithoutUsedByMesocyclesInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedCreateWithoutUsedByMesocyclesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayUncheckedCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
});

export const ExerciseSplitCreateOrConnectWithoutUsedByMesocyclesInputSchema: z.ZodType<Prisma.ExerciseSplitCreateOrConnectWithoutUsedByMesocyclesInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUsedByMesocyclesInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUsedByMesocyclesInputSchema) ]),
});

export const MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateWithoutMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateCreateNestedManyWithoutMesocycleExerciseSplitDayInputSchema).optional(),
});

export const MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateUncheckedCreateNestedManyWithoutMesocycleExerciseSplitDayInputSchema).optional(),
});

export const MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema) ]),
});

export const MesocycleExerciseSplitDayCreateManyMesocycleInputEnvelopeSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateManyMesocycleInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateManyMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayCreateManyMesocycleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateWithoutMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  muscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  regardlessOfProgress: z.boolean(),
  setIncreaseAmount: z.number().int(),
  maxVolume: z.number().int(),
});

export const MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  muscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  regardlessOfProgress: z.boolean(),
  setIncreaseAmount: z.number().int(),
  maxVolume: z.number().int(),
});

export const MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateOrConnectWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema) ]),
});

export const MesocycleCyclicSetChangeCreateManyMesocycleInputEnvelopeSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateManyMesocycleInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateManyMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeCreateManyMesocycleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const WorkoutOfMesocycleCreateWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateWithoutMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  splitDayIndex: z.number().int(),
  workoutStatus: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
  workout: z.lazy(() => WorkoutCreateNestedOneWithoutWorkoutOfMesocycleInputSchema),
});

export const WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  workoutId: z.string(),
  splitDayIndex: z.number().int(),
  workoutStatus: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
});

export const WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateOrConnectWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema) ]),
});

export const WorkoutOfMesocycleCreateManyMesocycleInputEnvelopeSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateManyMesocycleInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutOfMesocycleCreateManyMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleCreateManyMesocycleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserUpsertWithoutMesocyclesInputSchema: z.ZodType<Prisma.UserUpsertWithoutMesocyclesInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutMesocyclesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutMesocyclesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutMesocyclesInputSchema), z.lazy(() => UserUncheckedCreateWithoutMesocyclesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutMesocyclesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMesocyclesInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutMesocyclesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutMesocyclesInputSchema) ]),
});

export const UserUpdateWithoutMesocyclesInputSchema: z.ZodType<Prisma.UserUpdateWithoutMesocyclesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutMesocyclesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutMesocyclesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const ExerciseSplitUpsertWithoutUsedByMesocyclesInputSchema: z.ZodType<Prisma.ExerciseSplitUpsertWithoutUsedByMesocyclesInput> = z.strictObject({
  update: z.union([ z.lazy(() => ExerciseSplitUpdateWithoutUsedByMesocyclesInputSchema), z.lazy(() => ExerciseSplitUncheckedUpdateWithoutUsedByMesocyclesInputSchema) ]),
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUsedByMesocyclesInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUsedByMesocyclesInputSchema) ]),
  where: z.lazy(() => ExerciseSplitWhereInputSchema).optional(),
});

export const ExerciseSplitUpdateToOneWithWhereWithoutUsedByMesocyclesInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateToOneWithWhereWithoutUsedByMesocyclesInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ExerciseSplitUpdateWithoutUsedByMesocyclesInputSchema), z.lazy(() => ExerciseSplitUncheckedUpdateWithoutUsedByMesocyclesInputSchema) ]),
});

export const ExerciseSplitUpdateWithoutUsedByMesocyclesInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateWithoutUsedByMesocyclesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutExerciseSplitsNestedInputSchema).optional(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
});

export const ExerciseSplitUncheckedUpdateWithoutUsedByMesocyclesInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedUpdateWithoutUsedByMesocyclesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayUncheckedUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
});

export const MesocycleExerciseSplitDayUpsertWithWhereUniqueWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpsertWithWhereUniqueWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateWithoutMesocycleInputSchema) ]),
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleInputSchema) ]),
});

export const MesocycleExerciseSplitDayUpdateWithWhereUniqueWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateWithWhereUniqueWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateWithoutMesocycleInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateWithoutMesocycleInputSchema) ]),
});

export const MesocycleExerciseSplitDayUpdateManyWithWhereWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateManyWithWhereWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateManyMutationInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleInputSchema) ]),
});

export const MesocycleExerciseSplitDayScalarWhereInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema), z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema), z.lazy(() => MesocycleExerciseSplitDayScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  dayIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isRestDay: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const MesocycleCyclicSetChangeUpsertWithWhereUniqueWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpsertWithWhereUniqueWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MesocycleCyclicSetChangeUpdateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUncheckedUpdateWithoutMesocycleInputSchema) ]),
  create: z.union([ z.lazy(() => MesocycleCyclicSetChangeCreateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateWithoutMesocycleInputSchema) ]),
});

export const MesocycleCyclicSetChangeUpdateWithWhereUniqueWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpdateWithWhereUniqueWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleCyclicSetChangeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MesocycleCyclicSetChangeUpdateWithoutMesocycleInputSchema), z.lazy(() => MesocycleCyclicSetChangeUncheckedUpdateWithoutMesocycleInputSchema) ]),
});

export const MesocycleCyclicSetChangeUpdateManyWithWhereWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpdateManyWithWhereWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MesocycleCyclicSetChangeUpdateManyMutationInputSchema), z.lazy(() => MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleInputSchema) ]),
});

export const MesocycleCyclicSetChangeScalarWhereInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema), z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema), z.lazy(() => MesocycleCyclicSetChangeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  muscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  setIncreaseAmount: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  maxVolume: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
});

export const WorkoutOfMesocycleUpsertWithWhereUniqueWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpsertWithWhereUniqueWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedUpdateWithoutMesocycleInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutMesocycleInputSchema) ]),
});

export const WorkoutOfMesocycleUpdateWithWhereUniqueWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateWithWhereUniqueWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateWithoutMesocycleInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedUpdateWithoutMesocycleInputSchema) ]),
});

export const WorkoutOfMesocycleUpdateManyWithWhereWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateManyWithWhereWithoutMesocycleInput> = z.strictObject({
  where: z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateManyMutationInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleInputSchema) ]),
});

export const WorkoutOfMesocycleScalarWhereInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema), z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema), z.lazy(() => WorkoutOfMesocycleScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  mesocycleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  splitDayIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutStatus: z.union([ z.lazy(() => EnumWorkoutStatusNullableFilterSchema), z.lazy(() => WorkoutStatusSchema) ]).optional().nullable(),
});

export const MesocycleCreateWithoutMesocycleCyclicSetChangesInputSchema: z.ZodType<Prisma.MesocycleCreateWithoutMesocycleCyclicSetChangesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  user: z.lazy(() => UserCreateNestedOneWithoutMesocyclesInputSchema),
  exerciseSplit: z.lazy(() => ExerciseSplitCreateNestedOneWithoutUsedByMesocyclesInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleUncheckedCreateWithoutMesocycleCyclicSetChangesInputSchema: z.ZodType<Prisma.MesocycleUncheckedCreateWithoutMesocycleCyclicSetChangesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  exerciseSplitId: z.string().optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleCreateOrConnectWithoutMesocycleCyclicSetChangesInputSchema: z.ZodType<Prisma.MesocycleCreateOrConnectWithoutMesocycleCyclicSetChangesInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutMesocycleCyclicSetChangesInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutMesocycleCyclicSetChangesInputSchema) ]),
});

export const MesocycleUpsertWithoutMesocycleCyclicSetChangesInputSchema: z.ZodType<Prisma.MesocycleUpsertWithoutMesocycleCyclicSetChangesInput> = z.strictObject({
  update: z.union([ z.lazy(() => MesocycleUpdateWithoutMesocycleCyclicSetChangesInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutMesocycleCyclicSetChangesInputSchema) ]),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutMesocycleCyclicSetChangesInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutMesocycleCyclicSetChangesInputSchema) ]),
  where: z.lazy(() => MesocycleWhereInputSchema).optional(),
});

export const MesocycleUpdateToOneWithWhereWithoutMesocycleCyclicSetChangesInputSchema: z.ZodType<Prisma.MesocycleUpdateToOneWithWhereWithoutMesocycleCyclicSetChangesInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MesocycleUpdateWithoutMesocycleCyclicSetChangesInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutMesocycleCyclicSetChangesInputSchema) ]),
});

export const MesocycleUpdateWithoutMesocycleCyclicSetChangesInputSchema: z.ZodType<Prisma.MesocycleUpdateWithoutMesocycleCyclicSetChangesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMesocyclesNestedInputSchema).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitUpdateOneWithoutUsedByMesocyclesNestedInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleUncheckedUpdateWithoutMesocycleCyclicSetChangesInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateWithoutMesocycleCyclicSetChangesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleCreateWithoutMesocycleExerciseSplitDaysInputSchema: z.ZodType<Prisma.MesocycleCreateWithoutMesocycleExerciseSplitDaysInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  user: z.lazy(() => UserCreateNestedOneWithoutMesocyclesInputSchema),
  exerciseSplit: z.lazy(() => ExerciseSplitCreateNestedOneWithoutUsedByMesocyclesInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleUncheckedCreateWithoutMesocycleExerciseSplitDaysInputSchema: z.ZodType<Prisma.MesocycleUncheckedCreateWithoutMesocycleExerciseSplitDaysInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  exerciseSplitId: z.string().optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleCreateOrConnectWithoutMesocycleExerciseSplitDaysInputSchema: z.ZodType<Prisma.MesocycleCreateOrConnectWithoutMesocycleExerciseSplitDaysInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutMesocycleExerciseSplitDaysInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutMesocycleExerciseSplitDaysInputSchema) ]),
});

export const MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  sets: z.number().int(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  adaptiveRepRangeStart: z.number().int().optional().nullable(),
  adaptiveRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveTopRepRangeStart: z.number().int().optional().nullable(),
  adaptiveTopRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveRepRangeSourceId: z.string().optional().nullable(),
  adaptiveTopRepRangeSourceId: z.string().optional().nullable(),
  adaptiveRepRangeResetAt: z.coerce.date().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  sets: z.number().int(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  adaptiveRepRangeStart: z.number().int().optional().nullable(),
  adaptiveRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveTopRepRangeStart: z.number().int().optional().nullable(),
  adaptiveTopRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveRepRangeSourceId: z.string().optional().nullable(),
  adaptiveTopRepRangeSourceId: z.string().optional().nullable(),
  adaptiveRepRangeResetAt: z.coerce.date().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateOrConnectWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema) ]),
});

export const MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInputEnvelopeSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MesocycleUpsertWithoutMesocycleExerciseSplitDaysInputSchema: z.ZodType<Prisma.MesocycleUpsertWithoutMesocycleExerciseSplitDaysInput> = z.strictObject({
  update: z.union([ z.lazy(() => MesocycleUpdateWithoutMesocycleExerciseSplitDaysInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutMesocycleExerciseSplitDaysInputSchema) ]),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutMesocycleExerciseSplitDaysInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutMesocycleExerciseSplitDaysInputSchema) ]),
  where: z.lazy(() => MesocycleWhereInputSchema).optional(),
});

export const MesocycleUpdateToOneWithWhereWithoutMesocycleExerciseSplitDaysInputSchema: z.ZodType<Prisma.MesocycleUpdateToOneWithWhereWithoutMesocycleExerciseSplitDaysInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MesocycleUpdateWithoutMesocycleExerciseSplitDaysInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutMesocycleExerciseSplitDaysInputSchema) ]),
});

export const MesocycleUpdateWithoutMesocycleExerciseSplitDaysInputSchema: z.ZodType<Prisma.MesocycleUpdateWithoutMesocycleExerciseSplitDaysInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMesocyclesNestedInputSchema).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitUpdateOneWithoutUsedByMesocyclesNestedInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleUncheckedUpdateWithoutMesocycleExerciseSplitDaysInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateWithoutMesocycleExerciseSplitDaysInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleExerciseTemplateUpsertWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpsertWithWhereUniqueWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MesocycleExerciseTemplateUpdateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUncheckedUpdateWithoutMesocycleExerciseSplitDayInputSchema) ]),
  create: z.union([ z.lazy(() => MesocycleExerciseTemplateCreateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUncheckedCreateWithoutMesocycleExerciseSplitDayInputSchema) ]),
});

export const MesocycleExerciseTemplateUpdateWithWhereUniqueWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpdateWithWhereUniqueWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseTemplateWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MesocycleExerciseTemplateUpdateWithoutMesocycleExerciseSplitDayInputSchema), z.lazy(() => MesocycleExerciseTemplateUncheckedUpdateWithoutMesocycleExerciseSplitDayInputSchema) ]),
});

export const MesocycleExerciseTemplateUpdateManyWithWhereWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpdateManyWithWhereWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MesocycleExerciseTemplateUpdateManyMutationInputSchema), z.lazy(() => MesocycleExerciseTemplateUncheckedUpdateManyWithoutMesocycleExerciseSplitDayInputSchema) ]),
});

export const MesocycleExerciseTemplateScalarWhereInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema), z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema), z.lazy(() => MesocycleExerciseTemplateScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  sets: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  setType: z.union([ z.lazy(() => EnumSetTypeFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  repRangeStart: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  mesocycleExerciseSplitDayId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  overloadPercentage: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  lastSetToFailure: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  forceRIRMatching: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  minimumWeightChange: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableNullableFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeNullableFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
});

export const MesocycleExerciseSplitDayCreateWithoutMesocycleSplitDayExercisesInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateWithoutMesocycleSplitDayExercisesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  mesocycle: z.lazy(() => MesocycleCreateNestedOneWithoutMesocycleExerciseSplitDaysInputSchema),
});

export const MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleSplitDayExercisesInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleSplitDayExercisesInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
  mesocycleId: z.string(),
});

export const MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleSplitDayExercisesInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateOrConnectWithoutMesocycleSplitDayExercisesInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseSplitDayWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleSplitDayExercisesInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleSplitDayExercisesInputSchema) ]),
});

export const MesocycleExerciseSplitDayUpsertWithoutMesocycleSplitDayExercisesInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpsertWithoutMesocycleSplitDayExercisesInput> = z.strictObject({
  update: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateWithoutMesocycleSplitDayExercisesInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateWithoutMesocycleSplitDayExercisesInputSchema) ]),
  create: z.union([ z.lazy(() => MesocycleExerciseSplitDayCreateWithoutMesocycleSplitDayExercisesInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateWithoutMesocycleSplitDayExercisesInputSchema) ]),
  where: z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).optional(),
});

export const MesocycleExerciseSplitDayUpdateToOneWithWhereWithoutMesocycleSplitDayExercisesInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateToOneWithWhereWithoutMesocycleSplitDayExercisesInput> = z.strictObject({
  where: z.lazy(() => MesocycleExerciseSplitDayWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MesocycleExerciseSplitDayUpdateWithoutMesocycleSplitDayExercisesInputSchema), z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateWithoutMesocycleSplitDayExercisesInputSchema) ]),
});

export const MesocycleExerciseSplitDayUpdateWithoutMesocycleSplitDayExercisesInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateWithoutMesocycleSplitDayExercisesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycle: z.lazy(() => MesocycleUpdateOneRequiredWithoutMesocycleExerciseSplitDaysNestedInputSchema).optional(),
});

export const MesocycleExerciseSplitDayUncheckedUpdateWithoutMesocycleSplitDayExercisesInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedUpdateWithoutMesocycleSplitDayExercisesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.strictObject({
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.strictObject({
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
});

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema), z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.strictObject({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.strictObject({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
});

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema), z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ExerciseSplitCreateWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitCreateWithoutUserInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
});

export const ExerciseSplitUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayUncheckedCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleUncheckedCreateNestedManyWithoutExerciseSplitInputSchema).optional(),
});

export const ExerciseSplitCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema) ]),
});

export const ExerciseSplitCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ExerciseSplitCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ExerciseSplitCreateManyUserInputSchema), z.lazy(() => ExerciseSplitCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MesocycleCreateWithoutUserInputSchema: z.ZodType<Prisma.MesocycleCreateWithoutUserInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  exerciseSplit: z.lazy(() => ExerciseSplitCreateNestedOneWithoutUsedByMesocyclesInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayCreateNestedManyWithoutMesocycleInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.MesocycleUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseSplitId: z.string().optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.MesocycleCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutUserInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema) ]),
});

export const MesocycleCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.MesocycleCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MesocycleCreateManyUserInputSchema), z.lazy(() => MesocycleCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const WorkoutCreateWithoutUserInputSchema: z.ZodType<Prisma.WorkoutCreateWithoutUserInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  note: z.string().optional().nullable(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleCreateNestedOneWithoutWorkoutInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.WorkoutUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  note: z.string().optional().nullable(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedCreateNestedOneWithoutWorkoutInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.WorkoutCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutUserInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema) ]),
});

export const WorkoutCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.WorkoutCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutCreateManyUserInputSchema), z.lazy(() => WorkoutCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserSettingsCreateWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsCreateWithoutUserInput> = z.strictObject({
  id: z.cuid().optional(),
  motivationalQuotesEnabled: z.boolean().optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsCreatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const UserSettingsUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.cuid().optional(),
  motivationalQuotesEnabled: z.boolean().optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsCreatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const UserSettingsCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => UserSettingsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema) ]),
});

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema), z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
});

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema), z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
});

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema), z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema), z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
});

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema), z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
});

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema), z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const ExerciseSplitUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExerciseSplitUpdateWithoutUserInputSchema), z.lazy(() => ExerciseSplitUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ExerciseSplitCreateWithoutUserInputSchema), z.lazy(() => ExerciseSplitUncheckedCreateWithoutUserInputSchema) ]),
});

export const ExerciseSplitUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExerciseSplitUpdateWithoutUserInputSchema), z.lazy(() => ExerciseSplitUncheckedUpdateWithoutUserInputSchema) ]),
});

export const ExerciseSplitUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ExerciseSplitScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExerciseSplitUpdateManyMutationInputSchema), z.lazy(() => ExerciseSplitUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const ExerciseSplitScalarWhereInputSchema: z.ZodType<Prisma.ExerciseSplitScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ExerciseSplitScalarWhereInputSchema), z.lazy(() => ExerciseSplitScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExerciseSplitScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExerciseSplitScalarWhereInputSchema), z.lazy(() => ExerciseSplitScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const MesocycleUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MesocycleUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MesocycleUpdateWithoutUserInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutUserInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutUserInputSchema) ]),
});

export const MesocycleUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MesocycleUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MesocycleUpdateWithoutUserInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutUserInputSchema) ]),
});

export const MesocycleUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.MesocycleUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => MesocycleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MesocycleUpdateManyMutationInputSchema), z.lazy(() => MesocycleUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const WorkoutUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.WorkoutUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutUpdateWithoutUserInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutUserInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutUserInputSchema) ]),
});

export const WorkoutUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.WorkoutUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutUpdateWithoutUserInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutUserInputSchema) ]),
});

export const WorkoutUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.WorkoutUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => WorkoutScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutUpdateManyMutationInputSchema), z.lazy(() => WorkoutUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const WorkoutScalarWhereInputSchema: z.ZodType<Prisma.WorkoutScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutScalarWhereInputSchema), z.lazy(() => WorkoutScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutScalarWhereInputSchema), z.lazy(() => WorkoutScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userBodyweight: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  startedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const UserSettingsUpsertWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUpsertWithoutUserInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserSettingsUpdateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserSettingsCreateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => UserSettingsWhereInputSchema).optional(),
});

export const UserSettingsUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUpdateToOneWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => UserSettingsWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserSettingsUpdateWithoutUserInputSchema), z.lazy(() => UserSettingsUncheckedUpdateWithoutUserInputSchema) ]),
});

export const UserSettingsUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  motivationalQuotesEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsUpdatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const UserSettingsUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserSettingsUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  motivationalQuotesEnabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  quotesDisplayModes: z.union([ z.lazy(() => UserSettingsUpdatequotesDisplayModesInputSchema), z.lazy(() => QuotesDisplayModeSchema).array() ]).optional(),
});

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
});

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
});

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
});

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
});

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserCreateWithoutSettingsInputSchema: z.ZodType<Prisma.UserCreateWithoutSettingsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutSettingsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSettingsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutSettingsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSettingsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSettingsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSettingsInputSchema) ]),
});

export const UserUpsertWithoutSettingsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSettingsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutSettingsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSettingsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSettingsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSettingsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutSettingsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSettingsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSettingsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSettingsInputSchema) ]),
});

export const UserUpdateWithoutSettingsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSettingsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutSettingsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSettingsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  workouts: z.lazy(() => WorkoutUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const WorkoutCreateWithoutWorkoutOfMesocycleInputSchema: z.ZodType<Prisma.WorkoutCreateWithoutWorkoutOfMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  note: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutWorkoutsInputSchema),
  workoutExercises: z.lazy(() => WorkoutExerciseCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutUncheckedCreateWithoutWorkoutOfMesocycleInputSchema: z.ZodType<Prisma.WorkoutUncheckedCreateWithoutWorkoutOfMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  userId: z.string(),
  note: z.string().optional().nullable(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedCreateNestedManyWithoutWorkoutInputSchema).optional(),
});

export const WorkoutCreateOrConnectWithoutWorkoutOfMesocycleInputSchema: z.ZodType<Prisma.WorkoutCreateOrConnectWithoutWorkoutOfMesocycleInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutOfMesocycleInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutOfMesocycleInputSchema) ]),
});

export const MesocycleCreateWithoutWorkoutsOfMesocycleInputSchema: z.ZodType<Prisma.MesocycleCreateWithoutWorkoutsOfMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  user: z.lazy(() => UserCreateNestedOneWithoutMesocyclesInputSchema),
  exerciseSplit: z.lazy(() => ExerciseSplitCreateNestedOneWithoutUsedByMesocyclesInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayCreateNestedManyWithoutMesocycleInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleUncheckedCreateWithoutWorkoutsOfMesocycleInputSchema: z.ZodType<Prisma.MesocycleUncheckedCreateWithoutWorkoutsOfMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  exerciseSplitId: z.string().optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedCreateNestedManyWithoutMesocycleInputSchema).optional(),
});

export const MesocycleCreateOrConnectWithoutWorkoutsOfMesocycleInputSchema: z.ZodType<Prisma.MesocycleCreateOrConnectWithoutWorkoutsOfMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutWorkoutsOfMesocycleInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutWorkoutsOfMesocycleInputSchema) ]),
});

export const WorkoutUpsertWithoutWorkoutOfMesocycleInputSchema: z.ZodType<Prisma.WorkoutUpsertWithoutWorkoutOfMesocycleInput> = z.strictObject({
  update: z.union([ z.lazy(() => WorkoutUpdateWithoutWorkoutOfMesocycleInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutOfMesocycleInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutOfMesocycleInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutOfMesocycleInputSchema) ]),
  where: z.lazy(() => WorkoutWhereInputSchema).optional(),
});

export const WorkoutUpdateToOneWithWhereWithoutWorkoutOfMesocycleInputSchema: z.ZodType<Prisma.WorkoutUpdateToOneWithWhereWithoutWorkoutOfMesocycleInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkoutUpdateWithoutWorkoutOfMesocycleInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutOfMesocycleInputSchema) ]),
});

export const WorkoutUpdateWithoutWorkoutOfMesocycleInputSchema: z.ZodType<Prisma.WorkoutUpdateWithoutWorkoutOfMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutWorkoutsNestedInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutUncheckedUpdateWithoutWorkoutOfMesocycleInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateWithoutWorkoutOfMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const MesocycleUpsertWithoutWorkoutsOfMesocycleInputSchema: z.ZodType<Prisma.MesocycleUpsertWithoutWorkoutsOfMesocycleInput> = z.strictObject({
  update: z.union([ z.lazy(() => MesocycleUpdateWithoutWorkoutsOfMesocycleInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutWorkoutsOfMesocycleInputSchema) ]),
  create: z.union([ z.lazy(() => MesocycleCreateWithoutWorkoutsOfMesocycleInputSchema), z.lazy(() => MesocycleUncheckedCreateWithoutWorkoutsOfMesocycleInputSchema) ]),
  where: z.lazy(() => MesocycleWhereInputSchema).optional(),
});

export const MesocycleUpdateToOneWithWhereWithoutWorkoutsOfMesocycleInputSchema: z.ZodType<Prisma.MesocycleUpdateToOneWithWhereWithoutWorkoutsOfMesocycleInput> = z.strictObject({
  where: z.lazy(() => MesocycleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MesocycleUpdateWithoutWorkoutsOfMesocycleInputSchema), z.lazy(() => MesocycleUncheckedUpdateWithoutWorkoutsOfMesocycleInputSchema) ]),
});

export const MesocycleUpdateWithoutWorkoutsOfMesocycleInputSchema: z.ZodType<Prisma.MesocycleUpdateWithoutWorkoutsOfMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMesocyclesNestedInputSchema).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitUpdateOneWithoutUsedByMesocyclesNestedInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleUncheckedUpdateWithoutWorkoutsOfMesocycleInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateWithoutWorkoutsOfMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const UserCreateWithoutWorkoutsInputSchema: z.ZodType<Prisma.UserCreateWithoutWorkoutsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutWorkoutsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutWorkoutsInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  migratedFromV2: z.boolean().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutWorkoutsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutWorkoutsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutWorkoutsInputSchema), z.lazy(() => UserUncheckedCreateWithoutWorkoutsInputSchema) ]),
});

export const WorkoutOfMesocycleCreateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateWithoutWorkoutInput> = z.strictObject({
  id: z.cuid2().optional(),
  splitDayIndex: z.number().int(),
  workoutStatus: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
  mesocycle: z.lazy(() => MesocycleCreateNestedOneWithoutWorkoutsOfMesocycleInputSchema),
});

export const WorkoutOfMesocycleUncheckedCreateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedCreateWithoutWorkoutInput> = z.strictObject({
  id: z.cuid2().optional(),
  mesocycleId: z.string(),
  splitDayIndex: z.number().int(),
  workoutStatus: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
});

export const WorkoutOfMesocycleCreateOrConnectWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateOrConnectWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutOfMesocycleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutWorkoutInputSchema) ]),
});

export const WorkoutExerciseCreateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateWithoutWorkoutInput> = z.strictObject({
  id: z.cuid2().optional(),
  exerciseIndex: z.number().int(),
  name: z.string(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  mesocycleExerciseTemplateId: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  isDeload: z.boolean().optional(),
  sets: z.lazy(() => WorkoutExerciseSetCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateWithoutWorkoutInput> = z.strictObject({
  id: z.cuid2().optional(),
  exerciseIndex: z.number().int(),
  name: z.string(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  mesocycleExerciseTemplateId: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  isDeload: z.boolean().optional(),
  sets: z.lazy(() => WorkoutExerciseSetUncheckedCreateNestedManyWithoutWorkoutExerciseInputSchema).optional(),
});

export const WorkoutExerciseCreateOrConnectWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateOrConnectWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema) ]),
});

export const WorkoutExerciseCreateManyWorkoutInputEnvelopeSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyWorkoutInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutExerciseCreateManyWorkoutInputSchema), z.lazy(() => WorkoutExerciseCreateManyWorkoutInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserUpsertWithoutWorkoutsInputSchema: z.ZodType<Prisma.UserUpsertWithoutWorkoutsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutWorkoutsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutWorkoutsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutWorkoutsInputSchema), z.lazy(() => UserUncheckedCreateWithoutWorkoutsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutWorkoutsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutWorkoutsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutWorkoutsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutWorkoutsInputSchema) ]),
});

export const UserUpdateWithoutWorkoutsInputSchema: z.ZodType<Prisma.UserUpdateWithoutWorkoutsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutWorkoutsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutWorkoutsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  migratedFromV2: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  exerciseSplits: z.lazy(() => ExerciseSplitUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  mesocycles: z.lazy(() => MesocycleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  settings: z.lazy(() => UserSettingsUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const WorkoutOfMesocycleUpsertWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpsertWithoutWorkoutInput> = z.strictObject({
  update: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedUpdateWithoutWorkoutInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutOfMesocycleCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedCreateWithoutWorkoutInputSchema) ]),
  where: z.lazy(() => WorkoutOfMesocycleWhereInputSchema).optional(),
});

export const WorkoutOfMesocycleUpdateToOneWithWhereWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateToOneWithWhereWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutOfMesocycleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkoutOfMesocycleUpdateWithoutWorkoutInputSchema), z.lazy(() => WorkoutOfMesocycleUncheckedUpdateWithoutWorkoutInputSchema) ]),
});

export const WorkoutOfMesocycleUpdateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateWithoutWorkoutInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  splitDayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutStatus: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycle: z.lazy(() => MesocycleUpdateOneRequiredWithoutWorkoutsOfMesocycleNestedInputSchema).optional(),
});

export const WorkoutOfMesocycleUncheckedUpdateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedUpdateWithoutWorkoutInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  splitDayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutStatus: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUpsertWithWhereUniqueWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutWorkoutInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutWorkoutInputSchema) ]),
});

export const WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateWithWhereUniqueWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutWorkoutInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutWorkoutInputSchema) ]),
});

export const WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyWithWhereWithoutWorkoutInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseUpdateManyMutationInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateManyWithoutWorkoutInputSchema) ]),
});

export const WorkoutExerciseScalarWhereInputSchema: z.ZodType<Prisma.WorkoutExerciseScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseScalarWhereInputSchema), z.lazy(() => WorkoutExerciseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  exerciseIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  workoutId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => EnumMuscleGroupFilterSchema), z.lazy(() => MuscleGroupSchema) ]).optional(),
  customMuscleGroup: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  bodyweightFraction: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  setType: z.union([ z.lazy(() => EnumSetTypeFilterSchema), z.lazy(() => SetTypeSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => EnumChangeTypeNullableFilterSchema), z.lazy(() => ChangeTypeSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  repRangeStart: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  repRangeEnd: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  note: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  overloadPercentage: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  lastSetToFailure: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  forceRIRMatching: z.union([ z.lazy(() => BoolNullableFilterSchema), z.boolean() ]).optional().nullable(),
  minimumWeightChange: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => EnumProgressionVariableNullableFilterSchema), z.lazy(() => ProgressionVariableSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => EnumRepRangeModeNullableFilterSchema), z.lazy(() => RepRangeModeSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  topRepRangeStart: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  isDeload: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
});

export const WorkoutCreateWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutCreateWithoutWorkoutExercisesInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  note: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutWorkoutsInputSchema),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleCreateNestedOneWithoutWorkoutInputSchema).optional(),
});

export const WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUncheckedCreateWithoutWorkoutExercisesInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  userId: z.string(),
  note: z.string().optional().nullable(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedCreateNestedOneWithoutWorkoutInputSchema).optional(),
});

export const WorkoutCreateOrConnectWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutCreateOrConnectWithoutWorkoutExercisesInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema) ]),
});

export const WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.cuid2().optional(),
  setIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  skipped: z.boolean(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetCreateNestedManyWithoutParentSetInputSchema).optional(),
});

export const WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.cuid2().optional(),
  setIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  skipped: z.boolean(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateNestedManyWithoutParentSetInputSchema).optional(),
});

export const WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateOrConnectWithoutWorkoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema) ]),
});

export const WorkoutExerciseSetCreateManyWorkoutExerciseInputEnvelopeSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateManyWorkoutExerciseInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutExerciseSetCreateManyWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetCreateManyWorkoutExerciseInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const WorkoutUpsertWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUpsertWithoutWorkoutExercisesInput> = z.strictObject({
  update: z.union([ z.lazy(() => WorkoutUpdateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutExercisesInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutCreateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedCreateWithoutWorkoutExercisesInputSchema) ]),
  where: z.lazy(() => WorkoutWhereInputSchema).optional(),
});

export const WorkoutUpdateToOneWithWhereWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUpdateToOneWithWhereWithoutWorkoutExercisesInput> = z.strictObject({
  where: z.lazy(() => WorkoutWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkoutUpdateWithoutWorkoutExercisesInputSchema), z.lazy(() => WorkoutUncheckedUpdateWithoutWorkoutExercisesInputSchema) ]),
});

export const WorkoutUpdateWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUpdateWithoutWorkoutExercisesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutWorkoutsNestedInputSchema).optional(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleUpdateOneWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutUncheckedUpdateWithoutWorkoutExercisesInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateWithoutWorkoutExercisesInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedUpdateOneWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutExerciseSetUpsertWithWhereUniqueWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpsertWithWhereUniqueWithoutWorkoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutExerciseSetUpdateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedUpdateWithoutWorkoutExerciseInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutWorkoutExerciseInputSchema) ]),
});

export const WorkoutExerciseSetUpdateWithWhereUniqueWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateWithWhereUniqueWithoutWorkoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseSetUpdateWithoutWorkoutExerciseInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedUpdateWithoutWorkoutExerciseInputSchema) ]),
});

export const WorkoutExerciseSetUpdateManyWithWhereWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateManyWithWhereWithoutWorkoutExerciseInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseSetUpdateManyMutationInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedUpdateManyWithoutWorkoutExerciseInputSchema) ]),
});

export const WorkoutExerciseSetScalarWhereInputSchema: z.ZodType<Prisma.WorkoutExerciseSetScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema), z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema), z.lazy(() => WorkoutExerciseSetScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  setIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutExerciseId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  reps: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  load: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  RIR: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  skipped: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
});

export const WorkoutExerciseCreateWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateWithoutSetsInput> = z.strictObject({
  id: z.cuid2().optional(),
  exerciseIndex: z.number().int(),
  name: z.string(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  mesocycleExerciseTemplateId: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  isDeload: z.boolean().optional(),
  workout: z.lazy(() => WorkoutCreateNestedOneWithoutWorkoutExercisesInputSchema),
});

export const WorkoutExerciseUncheckedCreateWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedCreateWithoutSetsInput> = z.strictObject({
  id: z.cuid2().optional(),
  exerciseIndex: z.number().int(),
  name: z.string(),
  workoutId: z.string(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  mesocycleExerciseTemplateId: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  isDeload: z.boolean().optional(),
});

export const WorkoutExerciseCreateOrConnectWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateOrConnectWithoutSetsInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutSetsInputSchema) ]),
});

export const WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateWithoutParentSetInput> = z.strictObject({
  id: z.cuid2().optional(),
  miniSetIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
});

export const WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInput> = z.strictObject({
  id: z.cuid2().optional(),
  miniSetIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
});

export const WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateOrConnectWithoutParentSetInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema) ]),
});

export const WorkoutExerciseMiniSetCreateManyParentSetInputEnvelopeSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateManyParentSetInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateManyParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetCreateManyParentSetInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const WorkoutExerciseUpsertWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUpsertWithoutSetsInput> = z.strictObject({
  update: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutSetsInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutExerciseCreateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedCreateWithoutSetsInputSchema) ]),
  where: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
});

export const WorkoutExerciseUpdateToOneWithWhereWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateToOneWithWhereWithoutSetsInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkoutExerciseUpdateWithoutSetsInputSchema), z.lazy(() => WorkoutExerciseUncheckedUpdateWithoutSetsInputSchema) ]),
});

export const WorkoutExerciseUpdateWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateWithoutSetsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeload: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  workout: z.lazy(() => WorkoutUpdateOneRequiredWithoutWorkoutExercisesNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateWithoutSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateWithoutSetsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeload: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseMiniSetUpsertWithWhereUniqueWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpsertWithWhereUniqueWithoutParentSetInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => WorkoutExerciseMiniSetUpdateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUncheckedUpdateWithoutParentSetInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutExerciseMiniSetCreateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUncheckedCreateWithoutParentSetInputSchema) ]),
});

export const WorkoutExerciseMiniSetUpdateWithWhereUniqueWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpdateWithWhereUniqueWithoutParentSetInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseMiniSetWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseMiniSetUpdateWithoutParentSetInputSchema), z.lazy(() => WorkoutExerciseMiniSetUncheckedUpdateWithoutParentSetInputSchema) ]),
});

export const WorkoutExerciseMiniSetUpdateManyWithWhereWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpdateManyWithWhereWithoutParentSetInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema),
  data: z.union([ z.lazy(() => WorkoutExerciseMiniSetUpdateManyMutationInputSchema), z.lazy(() => WorkoutExerciseMiniSetUncheckedUpdateManyWithoutParentSetInputSchema) ]),
});

export const WorkoutExerciseMiniSetScalarWhereInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema), z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema), z.lazy(() => WorkoutExerciseMiniSetScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  miniSetIndex: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  reps: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  load: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  RIR: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  workoutExerciseSetId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const WorkoutExerciseSetCreateWithoutMiniSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateWithoutMiniSetsInput> = z.strictObject({
  id: z.cuid2().optional(),
  setIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  skipped: z.boolean(),
  workoutExercise: z.lazy(() => WorkoutExerciseCreateNestedOneWithoutSetsInputSchema),
});

export const WorkoutExerciseSetUncheckedCreateWithoutMiniSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedCreateWithoutMiniSetsInput> = z.strictObject({
  id: z.cuid2().optional(),
  setIndex: z.number().int(),
  workoutExerciseId: z.string(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  skipped: z.boolean(),
});

export const WorkoutExerciseSetCreateOrConnectWithoutMiniSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateOrConnectWithoutMiniSetsInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseSetWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutMiniSetsInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutMiniSetsInputSchema) ]),
});

export const WorkoutExerciseSetUpsertWithoutMiniSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpsertWithoutMiniSetsInput> = z.strictObject({
  update: z.union([ z.lazy(() => WorkoutExerciseSetUpdateWithoutMiniSetsInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedUpdateWithoutMiniSetsInputSchema) ]),
  create: z.union([ z.lazy(() => WorkoutExerciseSetCreateWithoutMiniSetsInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedCreateWithoutMiniSetsInputSchema) ]),
  where: z.lazy(() => WorkoutExerciseSetWhereInputSchema).optional(),
});

export const WorkoutExerciseSetUpdateToOneWithWhereWithoutMiniSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateToOneWithWhereWithoutMiniSetsInput> = z.strictObject({
  where: z.lazy(() => WorkoutExerciseSetWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => WorkoutExerciseSetUpdateWithoutMiniSetsInputSchema), z.lazy(() => WorkoutExerciseSetUncheckedUpdateWithoutMiniSetsInputSchema) ]),
});

export const WorkoutExerciseSetUpdateWithoutMiniSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateWithoutMiniSetsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  skipped: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExercise: z.lazy(() => WorkoutExerciseUpdateOneRequiredWithoutSetsNestedInputSchema).optional(),
});

export const WorkoutExerciseSetUncheckedUpdateWithoutMiniSetsInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedUpdateWithoutMiniSetsInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutExerciseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  skipped: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseSplitDayCreateManyExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayCreateManyExerciseSplitInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
});

export const MesocycleCreateManyExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleCreateManyExerciseSplitInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  userId: z.string(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
});

export const ExerciseSplitDayUpdateWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateWithoutExerciseSplitInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  exercises: z.lazy(() => ExerciseTemplateUpdateManyWithoutExerciseSplitDayNestedInputSchema).optional(),
});

export const ExerciseSplitDayUncheckedUpdateWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedUpdateWithoutExerciseSplitInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  exercises: z.lazy(() => ExerciseTemplateUncheckedUpdateManyWithoutExerciseSplitDayNestedInputSchema).optional(),
});

export const ExerciseSplitDayUncheckedUpdateManyWithoutExerciseSplitInputSchema: z.ZodType<Prisma.ExerciseSplitDayUncheckedUpdateManyWithoutExerciseSplitInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleUpdateWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleUpdateWithoutExerciseSplitInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMesocyclesNestedInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleUncheckedUpdateWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateWithoutExerciseSplitInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleUncheckedUpdateManyWithoutExerciseSplitInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateManyWithoutExerciseSplitInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseTemplateCreateManyExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateCreateManyExerciseSplitDayInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const ExerciseTemplateUpdateWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateUpdateWithoutExerciseSplitDayInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ExerciseTemplateUncheckedUpdateWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateUncheckedUpdateWithoutExerciseSplitDayInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ExerciseTemplateUncheckedUpdateManyWithoutExerciseSplitDayInputSchema: z.ZodType<Prisma.ExerciseTemplateUncheckedUpdateManyWithoutExerciseSplitDayInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MesocycleExerciseSplitDayCreateManyMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateManyMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  dayIndex: z.number().int(),
  isRestDay: z.boolean(),
});

export const MesocycleCyclicSetChangeCreateManyMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateManyMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  muscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  regardlessOfProgress: z.boolean(),
  setIncreaseAmount: z.number().int(),
  maxVolume: z.number().int(),
});

export const WorkoutOfMesocycleCreateManyMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateManyMesocycleInput> = z.strictObject({
  id: z.cuid2().optional(),
  workoutId: z.string(),
  splitDayIndex: z.number().int(),
  workoutStatus: z.lazy(() => WorkoutStatusSchema).optional().nullable(),
});

export const MesocycleExerciseSplitDayUpdateWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateWithoutMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateUpdateManyWithoutMesocycleExerciseSplitDayNestedInputSchema).optional(),
});

export const MesocycleExerciseSplitDayUncheckedUpdateWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedUpdateWithoutMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleSplitDayExercises: z.lazy(() => MesocycleExerciseTemplateUncheckedUpdateManyWithoutMesocycleExerciseSplitDayNestedInputSchema).optional(),
});

export const MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  dayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isRestDay: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleCyclicSetChangeUpdateWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpdateWithoutMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  setIncreaseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxVolume: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleCyclicSetChangeUncheckedUpdateWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUncheckedUpdateWithoutMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  setIncreaseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxVolume: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleInputSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  muscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  regardlessOfProgress: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  setIncreaseAmount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  maxVolume: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutOfMesocycleUpdateWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateWithoutMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  splitDayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutStatus: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workout: z.lazy(() => WorkoutUpdateOneRequiredWithoutWorkoutOfMesocycleNestedInputSchema).optional(),
});

export const WorkoutOfMesocycleUncheckedUpdateWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedUpdateWithoutMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  splitDayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutStatus: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleInputSchema: z.ZodType<Prisma.WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  workoutId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  splitDayIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  workoutStatus: z.union([ z.lazy(() => WorkoutStatusSchema), z.lazy(() => NullableEnumWorkoutStatusFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateManyMesocycleExerciseSplitDayInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseIndex: z.number().int(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  sets: z.number().int(),
  setType: z.lazy(() => SetTypeSchema),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  adaptiveRepRangeStart: z.number().int().optional().nullable(),
  adaptiveRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveTopRepRangeStart: z.number().int().optional().nullable(),
  adaptiveTopRepRangeEnd: z.number().int().optional().nullable(),
  adaptiveRepRangeSourceId: z.string().optional().nullable(),
  adaptiveTopRepRangeSourceId: z.string().optional().nullable(),
  adaptiveRepRangeResetAt: z.coerce.date().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
});

export const MesocycleExerciseTemplateUpdateWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpdateWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MesocycleExerciseTemplateUncheckedUpdateWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUncheckedUpdateWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const MesocycleExerciseTemplateUncheckedUpdateManyWithoutMesocycleExerciseSplitDayInputSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUncheckedUpdateManyWithoutMesocycleExerciseSplitDayInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sets: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveTopRepRangeSourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adaptiveRepRangeResetAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.strictObject({
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.strictObject({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const ExerciseSplitCreateManyUserInputSchema: z.ZodType<Prisma.ExerciseSplitCreateManyUserInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
});

export const MesocycleCreateManyUserInputSchema: z.ZodType<Prisma.MesocycleCreateManyUserInput> = z.strictObject({
  id: z.cuid2().optional(),
  name: z.string(),
  exerciseSplitId: z.string().optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleCreateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  startOverloadPercentage: z.number(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional(),
  lastSetToFailure: z.boolean(),
  forceRIRMatching: z.boolean(),
});

export const WorkoutCreateManyUserInputSchema: z.ZodType<Prisma.WorkoutCreateManyUserInput> = z.strictObject({
  id: z.cuid2().optional(),
  userBodyweight: z.number(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date(),
  note: z.string().optional().nullable(),
});

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.strictObject({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.strictObject({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.strictObject({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.strictObject({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ExerciseSplitUpdateWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
});

export const ExerciseSplitUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitDays: z.lazy(() => ExerciseSplitDayUncheckedUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
  usedByMesocycles: z.lazy(() => MesocycleUncheckedUpdateManyWithoutExerciseSplitNestedInputSchema).optional(),
});

export const ExerciseSplitUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ExerciseSplitUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MesocycleUpdateWithoutUserInputSchema: z.ZodType<Prisma.MesocycleUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplit: z.lazy(() => ExerciseSplitUpdateOneWithoutUsedByMesocyclesNestedInputSchema).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mesocycleExerciseSplitDays: z.lazy(() => MesocycleExerciseSplitDayUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  mesocycleCyclicSetChanges: z.lazy(() => MesocycleCyclicSetChangeUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
  workoutsOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedUpdateManyWithoutMesocycleNestedInputSchema).optional(),
});

export const MesocycleUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.MesocycleUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseSplitId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  RIRProgression: z.union([ z.lazy(() => MesocycleUpdateRIRProgressionInputSchema), z.number().int().array() ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startOverloadPercentage: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => EnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => EnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutUpdateWithoutUserInputSchema: z.ZodType<Prisma.WorkoutUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleUpdateOneWithoutWorkoutNestedInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  workoutOfMesocycle: z.lazy(() => WorkoutOfMesocycleUncheckedUpdateOneWithoutWorkoutNestedInputSchema).optional(),
  workoutExercises: z.lazy(() => WorkoutExerciseUncheckedUpdateManyWithoutWorkoutNestedInputSchema).optional(),
});

export const WorkoutUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.WorkoutUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userBodyweight: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  startedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const WorkoutExerciseCreateManyWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyWorkoutInput> = z.strictObject({
  id: z.cuid2().optional(),
  exerciseIndex: z.number().int(),
  name: z.string(),
  targetMuscleGroup: z.lazy(() => MuscleGroupSchema),
  customMuscleGroup: z.string().optional().nullable(),
  bodyweightFraction: z.number().optional().nullable(),
  setType: z.lazy(() => SetTypeSchema),
  changeType: z.lazy(() => ChangeTypeSchema).optional().nullable(),
  changeAmount: z.number().optional().nullable(),
  repRangeStart: z.number().int(),
  repRangeEnd: z.number().int(),
  note: z.string().optional().nullable(),
  overloadPercentage: z.number().optional().nullable(),
  lastSetToFailure: z.boolean().optional().nullable(),
  forceRIRMatching: z.boolean().optional().nullable(),
  minimumWeightChange: z.number().optional().nullable(),
  preferredProgressionVariable: z.lazy(() => ProgressionVariableSchema).optional().nullable(),
  repRangeMode: z.lazy(() => RepRangeModeSchema).optional().nullable(),
  mesocycleExerciseTemplateId: z.string().optional().nullable(),
  topRepRangeStart: z.number().int().optional().nullable(),
  topRepRangeEnd: z.number().int().optional().nullable(),
  isDeload: z.boolean().optional(),
});

export const WorkoutExerciseUpdateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUpdateWithoutWorkoutInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeload: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutExerciseSetUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateWithoutWorkoutInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeload: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  sets: z.lazy(() => WorkoutExerciseSetUncheckedUpdateManyWithoutWorkoutExerciseNestedInputSchema).optional(),
});

export const WorkoutExerciseUncheckedUpdateManyWithoutWorkoutInputSchema: z.ZodType<Prisma.WorkoutExerciseUncheckedUpdateManyWithoutWorkoutInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  exerciseIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetMuscleGroup: z.union([ z.lazy(() => MuscleGroupSchema), z.lazy(() => EnumMuscleGroupFieldUpdateOperationsInputSchema) ]).optional(),
  customMuscleGroup: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bodyweightFraction: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  setType: z.union([ z.lazy(() => SetTypeSchema), z.lazy(() => EnumSetTypeFieldUpdateOperationsInputSchema) ]).optional(),
  changeType: z.union([ z.lazy(() => ChangeTypeSchema), z.lazy(() => NullableEnumChangeTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  changeAmount: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeStart: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  repRangeEnd: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  note: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  overloadPercentage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastSetToFailure: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  forceRIRMatching: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  minimumWeightChange: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferredProgressionVariable: z.union([ z.lazy(() => ProgressionVariableSchema), z.lazy(() => NullableEnumProgressionVariableFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  repRangeMode: z.union([ z.lazy(() => RepRangeModeSchema), z.lazy(() => NullableEnumRepRangeModeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  mesocycleExerciseTemplateId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeStart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topRepRangeEnd: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDeload: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseSetCreateManyWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateManyWorkoutExerciseInput> = z.strictObject({
  id: z.cuid2().optional(),
  setIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
  skipped: z.boolean(),
});

export const WorkoutExerciseSetUpdateWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  skipped: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetUpdateManyWithoutParentSetNestedInputSchema).optional(),
});

export const WorkoutExerciseSetUncheckedUpdateWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedUpdateWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  skipped: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  miniSets: z.lazy(() => WorkoutExerciseMiniSetUncheckedUpdateManyWithoutParentSetNestedInputSchema).optional(),
});

export const WorkoutExerciseSetUncheckedUpdateManyWithoutWorkoutExerciseInputSchema: z.ZodType<Prisma.WorkoutExerciseSetUncheckedUpdateManyWithoutWorkoutExerciseInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  setIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  skipped: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseMiniSetCreateManyParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateManyParentSetInput> = z.strictObject({
  id: z.cuid2().optional(),
  miniSetIndex: z.number().int(),
  reps: z.number().int(),
  load: z.number(),
  RIR: z.number().int(),
});

export const WorkoutExerciseMiniSetUpdateWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpdateWithoutParentSetInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  miniSetIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseMiniSetUncheckedUpdateWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUncheckedUpdateWithoutParentSetInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  miniSetIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const WorkoutExerciseMiniSetUncheckedUpdateManyWithoutParentSetInputSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUncheckedUpdateManyWithoutParentSetInput> = z.strictObject({
  id: z.union([ z.cuid2(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  miniSetIndex: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  reps: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  load: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  RIR: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ExerciseSplitFindFirstArgsSchema: z.ZodType<Prisma.ExerciseSplitFindFirstArgs> = z.object({
  select: ExerciseSplitSelectSchema.optional(),
  include: ExerciseSplitIncludeSchema.optional(),
  where: ExerciseSplitWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitOrderByWithRelationInputSchema.array(), ExerciseSplitOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseSplitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseSplitScalarFieldEnumSchema, ExerciseSplitScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseSplitFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ExerciseSplitFindFirstOrThrowArgs> = z.object({
  select: ExerciseSplitSelectSchema.optional(),
  include: ExerciseSplitIncludeSchema.optional(),
  where: ExerciseSplitWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitOrderByWithRelationInputSchema.array(), ExerciseSplitOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseSplitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseSplitScalarFieldEnumSchema, ExerciseSplitScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseSplitFindManyArgsSchema: z.ZodType<Prisma.ExerciseSplitFindManyArgs> = z.object({
  select: ExerciseSplitSelectSchema.optional(),
  include: ExerciseSplitIncludeSchema.optional(),
  where: ExerciseSplitWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitOrderByWithRelationInputSchema.array(), ExerciseSplitOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseSplitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseSplitScalarFieldEnumSchema, ExerciseSplitScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseSplitAggregateArgsSchema: z.ZodType<Prisma.ExerciseSplitAggregateArgs> = z.object({
  where: ExerciseSplitWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitOrderByWithRelationInputSchema.array(), ExerciseSplitOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseSplitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseSplitGroupByArgsSchema: z.ZodType<Prisma.ExerciseSplitGroupByArgs> = z.object({
  where: ExerciseSplitWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitOrderByWithAggregationInputSchema.array(), ExerciseSplitOrderByWithAggregationInputSchema ]).optional(),
  by: ExerciseSplitScalarFieldEnumSchema.array(), 
  having: ExerciseSplitScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseSplitFindUniqueArgsSchema: z.ZodType<Prisma.ExerciseSplitFindUniqueArgs> = z.object({
  select: ExerciseSplitSelectSchema.optional(),
  include: ExerciseSplitIncludeSchema.optional(),
  where: ExerciseSplitWhereUniqueInputSchema, 
}).strict();

export const ExerciseSplitFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ExerciseSplitFindUniqueOrThrowArgs> = z.object({
  select: ExerciseSplitSelectSchema.optional(),
  include: ExerciseSplitIncludeSchema.optional(),
  where: ExerciseSplitWhereUniqueInputSchema, 
}).strict();

export const ExerciseSplitDayFindFirstArgsSchema: z.ZodType<Prisma.ExerciseSplitDayFindFirstArgs> = z.object({
  select: ExerciseSplitDaySelectSchema.optional(),
  include: ExerciseSplitDayIncludeSchema.optional(),
  where: ExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitDayOrderByWithRelationInputSchema.array(), ExerciseSplitDayOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseSplitDayWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseSplitDayScalarFieldEnumSchema, ExerciseSplitDayScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseSplitDayFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ExerciseSplitDayFindFirstOrThrowArgs> = z.object({
  select: ExerciseSplitDaySelectSchema.optional(),
  include: ExerciseSplitDayIncludeSchema.optional(),
  where: ExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitDayOrderByWithRelationInputSchema.array(), ExerciseSplitDayOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseSplitDayWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseSplitDayScalarFieldEnumSchema, ExerciseSplitDayScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseSplitDayFindManyArgsSchema: z.ZodType<Prisma.ExerciseSplitDayFindManyArgs> = z.object({
  select: ExerciseSplitDaySelectSchema.optional(),
  include: ExerciseSplitDayIncludeSchema.optional(),
  where: ExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitDayOrderByWithRelationInputSchema.array(), ExerciseSplitDayOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseSplitDayWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseSplitDayScalarFieldEnumSchema, ExerciseSplitDayScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseSplitDayAggregateArgsSchema: z.ZodType<Prisma.ExerciseSplitDayAggregateArgs> = z.object({
  where: ExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitDayOrderByWithRelationInputSchema.array(), ExerciseSplitDayOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseSplitDayWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseSplitDayGroupByArgsSchema: z.ZodType<Prisma.ExerciseSplitDayGroupByArgs> = z.object({
  where: ExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseSplitDayOrderByWithAggregationInputSchema.array(), ExerciseSplitDayOrderByWithAggregationInputSchema ]).optional(),
  by: ExerciseSplitDayScalarFieldEnumSchema.array(), 
  having: ExerciseSplitDayScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseSplitDayFindUniqueArgsSchema: z.ZodType<Prisma.ExerciseSplitDayFindUniqueArgs> = z.object({
  select: ExerciseSplitDaySelectSchema.optional(),
  include: ExerciseSplitDayIncludeSchema.optional(),
  where: ExerciseSplitDayWhereUniqueInputSchema, 
}).strict();

export const ExerciseSplitDayFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ExerciseSplitDayFindUniqueOrThrowArgs> = z.object({
  select: ExerciseSplitDaySelectSchema.optional(),
  include: ExerciseSplitDayIncludeSchema.optional(),
  where: ExerciseSplitDayWhereUniqueInputSchema, 
}).strict();

export const ExerciseTemplateFindFirstArgsSchema: z.ZodType<Prisma.ExerciseTemplateFindFirstArgs> = z.object({
  select: ExerciseTemplateSelectSchema.optional(),
  include: ExerciseTemplateIncludeSchema.optional(),
  where: ExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseTemplateOrderByWithRelationInputSchema.array(), ExerciseTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseTemplateWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseTemplateScalarFieldEnumSchema, ExerciseTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseTemplateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ExerciseTemplateFindFirstOrThrowArgs> = z.object({
  select: ExerciseTemplateSelectSchema.optional(),
  include: ExerciseTemplateIncludeSchema.optional(),
  where: ExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseTemplateOrderByWithRelationInputSchema.array(), ExerciseTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseTemplateWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseTemplateScalarFieldEnumSchema, ExerciseTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseTemplateFindManyArgsSchema: z.ZodType<Prisma.ExerciseTemplateFindManyArgs> = z.object({
  select: ExerciseTemplateSelectSchema.optional(),
  include: ExerciseTemplateIncludeSchema.optional(),
  where: ExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseTemplateOrderByWithRelationInputSchema.array(), ExerciseTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseTemplateWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExerciseTemplateScalarFieldEnumSchema, ExerciseTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ExerciseTemplateAggregateArgsSchema: z.ZodType<Prisma.ExerciseTemplateAggregateArgs> = z.object({
  where: ExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseTemplateOrderByWithRelationInputSchema.array(), ExerciseTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: ExerciseTemplateWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseTemplateGroupByArgsSchema: z.ZodType<Prisma.ExerciseTemplateGroupByArgs> = z.object({
  where: ExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ ExerciseTemplateOrderByWithAggregationInputSchema.array(), ExerciseTemplateOrderByWithAggregationInputSchema ]).optional(),
  by: ExerciseTemplateScalarFieldEnumSchema.array(), 
  having: ExerciseTemplateScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ExerciseTemplateFindUniqueArgsSchema: z.ZodType<Prisma.ExerciseTemplateFindUniqueArgs> = z.object({
  select: ExerciseTemplateSelectSchema.optional(),
  include: ExerciseTemplateIncludeSchema.optional(),
  where: ExerciseTemplateWhereUniqueInputSchema, 
}).strict();

export const ExerciseTemplateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ExerciseTemplateFindUniqueOrThrowArgs> = z.object({
  select: ExerciseTemplateSelectSchema.optional(),
  include: ExerciseTemplateIncludeSchema.optional(),
  where: ExerciseTemplateWhereUniqueInputSchema, 
}).strict();

export const MesocycleFindFirstArgsSchema: z.ZodType<Prisma.MesocycleFindFirstArgs> = z.object({
  select: MesocycleSelectSchema.optional(),
  include: MesocycleIncludeSchema.optional(),
  where: MesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleOrderByWithRelationInputSchema.array(), MesocycleOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleScalarFieldEnumSchema, MesocycleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MesocycleFindFirstOrThrowArgs> = z.object({
  select: MesocycleSelectSchema.optional(),
  include: MesocycleIncludeSchema.optional(),
  where: MesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleOrderByWithRelationInputSchema.array(), MesocycleOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleScalarFieldEnumSchema, MesocycleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleFindManyArgsSchema: z.ZodType<Prisma.MesocycleFindManyArgs> = z.object({
  select: MesocycleSelectSchema.optional(),
  include: MesocycleIncludeSchema.optional(),
  where: MesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleOrderByWithRelationInputSchema.array(), MesocycleOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleScalarFieldEnumSchema, MesocycleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleAggregateArgsSchema: z.ZodType<Prisma.MesocycleAggregateArgs> = z.object({
  where: MesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleOrderByWithRelationInputSchema.array(), MesocycleOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MesocycleGroupByArgsSchema: z.ZodType<Prisma.MesocycleGroupByArgs> = z.object({
  where: MesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleOrderByWithAggregationInputSchema.array(), MesocycleOrderByWithAggregationInputSchema ]).optional(),
  by: MesocycleScalarFieldEnumSchema.array(), 
  having: MesocycleScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MesocycleFindUniqueArgsSchema: z.ZodType<Prisma.MesocycleFindUniqueArgs> = z.object({
  select: MesocycleSelectSchema.optional(),
  include: MesocycleIncludeSchema.optional(),
  where: MesocycleWhereUniqueInputSchema, 
}).strict();

export const MesocycleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MesocycleFindUniqueOrThrowArgs> = z.object({
  select: MesocycleSelectSchema.optional(),
  include: MesocycleIncludeSchema.optional(),
  where: MesocycleWhereUniqueInputSchema, 
}).strict();

export const MesocycleCyclicSetChangeFindFirstArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeFindFirstArgs> = z.object({
  select: MesocycleCyclicSetChangeSelectSchema.optional(),
  include: MesocycleCyclicSetChangeIncludeSchema.optional(),
  where: MesocycleCyclicSetChangeWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleCyclicSetChangeOrderByWithRelationInputSchema.array(), MesocycleCyclicSetChangeOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleCyclicSetChangeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleCyclicSetChangeScalarFieldEnumSchema, MesocycleCyclicSetChangeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleCyclicSetChangeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeFindFirstOrThrowArgs> = z.object({
  select: MesocycleCyclicSetChangeSelectSchema.optional(),
  include: MesocycleCyclicSetChangeIncludeSchema.optional(),
  where: MesocycleCyclicSetChangeWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleCyclicSetChangeOrderByWithRelationInputSchema.array(), MesocycleCyclicSetChangeOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleCyclicSetChangeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleCyclicSetChangeScalarFieldEnumSchema, MesocycleCyclicSetChangeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleCyclicSetChangeFindManyArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeFindManyArgs> = z.object({
  select: MesocycleCyclicSetChangeSelectSchema.optional(),
  include: MesocycleCyclicSetChangeIncludeSchema.optional(),
  where: MesocycleCyclicSetChangeWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleCyclicSetChangeOrderByWithRelationInputSchema.array(), MesocycleCyclicSetChangeOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleCyclicSetChangeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleCyclicSetChangeScalarFieldEnumSchema, MesocycleCyclicSetChangeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleCyclicSetChangeAggregateArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeAggregateArgs> = z.object({
  where: MesocycleCyclicSetChangeWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleCyclicSetChangeOrderByWithRelationInputSchema.array(), MesocycleCyclicSetChangeOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleCyclicSetChangeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MesocycleCyclicSetChangeGroupByArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeGroupByArgs> = z.object({
  where: MesocycleCyclicSetChangeWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleCyclicSetChangeOrderByWithAggregationInputSchema.array(), MesocycleCyclicSetChangeOrderByWithAggregationInputSchema ]).optional(),
  by: MesocycleCyclicSetChangeScalarFieldEnumSchema.array(), 
  having: MesocycleCyclicSetChangeScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MesocycleCyclicSetChangeFindUniqueArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeFindUniqueArgs> = z.object({
  select: MesocycleCyclicSetChangeSelectSchema.optional(),
  include: MesocycleCyclicSetChangeIncludeSchema.optional(),
  where: MesocycleCyclicSetChangeWhereUniqueInputSchema, 
}).strict();

export const MesocycleCyclicSetChangeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeFindUniqueOrThrowArgs> = z.object({
  select: MesocycleCyclicSetChangeSelectSchema.optional(),
  include: MesocycleCyclicSetChangeIncludeSchema.optional(),
  where: MesocycleCyclicSetChangeWhereUniqueInputSchema, 
}).strict();

export const MesocycleExerciseSplitDayFindFirstArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayFindFirstArgs> = z.object({
  select: MesocycleExerciseSplitDaySelectSchema.optional(),
  include: MesocycleExerciseSplitDayIncludeSchema.optional(),
  where: MesocycleExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseSplitDayOrderByWithRelationInputSchema.array(), MesocycleExerciseSplitDayOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleExerciseSplitDayWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleExerciseSplitDayScalarFieldEnumSchema, MesocycleExerciseSplitDayScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleExerciseSplitDayFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayFindFirstOrThrowArgs> = z.object({
  select: MesocycleExerciseSplitDaySelectSchema.optional(),
  include: MesocycleExerciseSplitDayIncludeSchema.optional(),
  where: MesocycleExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseSplitDayOrderByWithRelationInputSchema.array(), MesocycleExerciseSplitDayOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleExerciseSplitDayWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleExerciseSplitDayScalarFieldEnumSchema, MesocycleExerciseSplitDayScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleExerciseSplitDayFindManyArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayFindManyArgs> = z.object({
  select: MesocycleExerciseSplitDaySelectSchema.optional(),
  include: MesocycleExerciseSplitDayIncludeSchema.optional(),
  where: MesocycleExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseSplitDayOrderByWithRelationInputSchema.array(), MesocycleExerciseSplitDayOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleExerciseSplitDayWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleExerciseSplitDayScalarFieldEnumSchema, MesocycleExerciseSplitDayScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleExerciseSplitDayAggregateArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayAggregateArgs> = z.object({
  where: MesocycleExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseSplitDayOrderByWithRelationInputSchema.array(), MesocycleExerciseSplitDayOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleExerciseSplitDayWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MesocycleExerciseSplitDayGroupByArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayGroupByArgs> = z.object({
  where: MesocycleExerciseSplitDayWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseSplitDayOrderByWithAggregationInputSchema.array(), MesocycleExerciseSplitDayOrderByWithAggregationInputSchema ]).optional(),
  by: MesocycleExerciseSplitDayScalarFieldEnumSchema.array(), 
  having: MesocycleExerciseSplitDayScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MesocycleExerciseSplitDayFindUniqueArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayFindUniqueArgs> = z.object({
  select: MesocycleExerciseSplitDaySelectSchema.optional(),
  include: MesocycleExerciseSplitDayIncludeSchema.optional(),
  where: MesocycleExerciseSplitDayWhereUniqueInputSchema, 
}).strict();

export const MesocycleExerciseSplitDayFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayFindUniqueOrThrowArgs> = z.object({
  select: MesocycleExerciseSplitDaySelectSchema.optional(),
  include: MesocycleExerciseSplitDayIncludeSchema.optional(),
  where: MesocycleExerciseSplitDayWhereUniqueInputSchema, 
}).strict();

export const MesocycleExerciseTemplateFindFirstArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateFindFirstArgs> = z.object({
  select: MesocycleExerciseTemplateSelectSchema.optional(),
  include: MesocycleExerciseTemplateIncludeSchema.optional(),
  where: MesocycleExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseTemplateOrderByWithRelationInputSchema.array(), MesocycleExerciseTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleExerciseTemplateWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleExerciseTemplateScalarFieldEnumSchema, MesocycleExerciseTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleExerciseTemplateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateFindFirstOrThrowArgs> = z.object({
  select: MesocycleExerciseTemplateSelectSchema.optional(),
  include: MesocycleExerciseTemplateIncludeSchema.optional(),
  where: MesocycleExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseTemplateOrderByWithRelationInputSchema.array(), MesocycleExerciseTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleExerciseTemplateWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleExerciseTemplateScalarFieldEnumSchema, MesocycleExerciseTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleExerciseTemplateFindManyArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateFindManyArgs> = z.object({
  select: MesocycleExerciseTemplateSelectSchema.optional(),
  include: MesocycleExerciseTemplateIncludeSchema.optional(),
  where: MesocycleExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseTemplateOrderByWithRelationInputSchema.array(), MesocycleExerciseTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleExerciseTemplateWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MesocycleExerciseTemplateScalarFieldEnumSchema, MesocycleExerciseTemplateScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MesocycleExerciseTemplateAggregateArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateAggregateArgs> = z.object({
  where: MesocycleExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseTemplateOrderByWithRelationInputSchema.array(), MesocycleExerciseTemplateOrderByWithRelationInputSchema ]).optional(),
  cursor: MesocycleExerciseTemplateWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MesocycleExerciseTemplateGroupByArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateGroupByArgs> = z.object({
  where: MesocycleExerciseTemplateWhereInputSchema.optional(), 
  orderBy: z.union([ MesocycleExerciseTemplateOrderByWithAggregationInputSchema.array(), MesocycleExerciseTemplateOrderByWithAggregationInputSchema ]).optional(),
  by: MesocycleExerciseTemplateScalarFieldEnumSchema.array(), 
  having: MesocycleExerciseTemplateScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MesocycleExerciseTemplateFindUniqueArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateFindUniqueArgs> = z.object({
  select: MesocycleExerciseTemplateSelectSchema.optional(),
  include: MesocycleExerciseTemplateIncludeSchema.optional(),
  where: MesocycleExerciseTemplateWhereUniqueInputSchema, 
}).strict();

export const MesocycleExerciseTemplateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateFindUniqueOrThrowArgs> = z.object({
  select: MesocycleExerciseTemplateSelectSchema.optional(),
  include: MesocycleExerciseTemplateIncludeSchema.optional(),
  where: MesocycleExerciseTemplateWhereUniqueInputSchema, 
}).strict();

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(), AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(), 
  having: AccountScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema, 
}).strict();

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema, 
}).strict();

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(), SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(), 
  having: SessionScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const VerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(), VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema, VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(), VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema, VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VerificationTokenFindManyArgsSchema: z.ZodType<Prisma.VerificationTokenFindManyArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(), VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema, VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VerificationTokenAggregateArgsSchema: z.ZodType<Prisma.VerificationTokenAggregateArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(), VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VerificationTokenGroupByArgsSchema: z.ZodType<Prisma.VerificationTokenGroupByArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationTokenOrderByWithAggregationInputSchema.array(), VerificationTokenOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationTokenScalarFieldEnumSchema.array(), 
  having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema, 
}).strict();

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema, 
}).strict();

export const UserSettingsFindFirstArgsSchema: z.ZodType<Prisma.UserSettingsFindFirstArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereInputSchema.optional(), 
  orderBy: z.union([ UserSettingsOrderByWithRelationInputSchema.array(), UserSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: UserSettingsWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserSettingsScalarFieldEnumSchema, UserSettingsScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserSettingsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserSettingsFindFirstOrThrowArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereInputSchema.optional(), 
  orderBy: z.union([ UserSettingsOrderByWithRelationInputSchema.array(), UserSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: UserSettingsWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserSettingsScalarFieldEnumSchema, UserSettingsScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserSettingsFindManyArgsSchema: z.ZodType<Prisma.UserSettingsFindManyArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereInputSchema.optional(), 
  orderBy: z.union([ UserSettingsOrderByWithRelationInputSchema.array(), UserSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: UserSettingsWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserSettingsScalarFieldEnumSchema, UserSettingsScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserSettingsAggregateArgsSchema: z.ZodType<Prisma.UserSettingsAggregateArgs> = z.object({
  where: UserSettingsWhereInputSchema.optional(), 
  orderBy: z.union([ UserSettingsOrderByWithRelationInputSchema.array(), UserSettingsOrderByWithRelationInputSchema ]).optional(),
  cursor: UserSettingsWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserSettingsGroupByArgsSchema: z.ZodType<Prisma.UserSettingsGroupByArgs> = z.object({
  where: UserSettingsWhereInputSchema.optional(), 
  orderBy: z.union([ UserSettingsOrderByWithAggregationInputSchema.array(), UserSettingsOrderByWithAggregationInputSchema ]).optional(),
  by: UserSettingsScalarFieldEnumSchema.array(), 
  having: UserSettingsScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserSettingsFindUniqueArgsSchema: z.ZodType<Prisma.UserSettingsFindUniqueArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereUniqueInputSchema, 
}).strict();

export const UserSettingsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserSettingsFindUniqueOrThrowArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereUniqueInputSchema, 
}).strict();

export const WorkoutOfMesocycleFindFirstArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleFindFirstArgs> = z.object({
  select: WorkoutOfMesocycleSelectSchema.optional(),
  include: WorkoutOfMesocycleIncludeSchema.optional(),
  where: WorkoutOfMesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOfMesocycleOrderByWithRelationInputSchema.array(), WorkoutOfMesocycleOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutOfMesocycleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutOfMesocycleScalarFieldEnumSchema, WorkoutOfMesocycleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutOfMesocycleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleFindFirstOrThrowArgs> = z.object({
  select: WorkoutOfMesocycleSelectSchema.optional(),
  include: WorkoutOfMesocycleIncludeSchema.optional(),
  where: WorkoutOfMesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOfMesocycleOrderByWithRelationInputSchema.array(), WorkoutOfMesocycleOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutOfMesocycleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutOfMesocycleScalarFieldEnumSchema, WorkoutOfMesocycleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutOfMesocycleFindManyArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleFindManyArgs> = z.object({
  select: WorkoutOfMesocycleSelectSchema.optional(),
  include: WorkoutOfMesocycleIncludeSchema.optional(),
  where: WorkoutOfMesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOfMesocycleOrderByWithRelationInputSchema.array(), WorkoutOfMesocycleOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutOfMesocycleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutOfMesocycleScalarFieldEnumSchema, WorkoutOfMesocycleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutOfMesocycleAggregateArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleAggregateArgs> = z.object({
  where: WorkoutOfMesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOfMesocycleOrderByWithRelationInputSchema.array(), WorkoutOfMesocycleOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutOfMesocycleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutOfMesocycleGroupByArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleGroupByArgs> = z.object({
  where: WorkoutOfMesocycleWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOfMesocycleOrderByWithAggregationInputSchema.array(), WorkoutOfMesocycleOrderByWithAggregationInputSchema ]).optional(),
  by: WorkoutOfMesocycleScalarFieldEnumSchema.array(), 
  having: WorkoutOfMesocycleScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutOfMesocycleFindUniqueArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleFindUniqueArgs> = z.object({
  select: WorkoutOfMesocycleSelectSchema.optional(),
  include: WorkoutOfMesocycleIncludeSchema.optional(),
  where: WorkoutOfMesocycleWhereUniqueInputSchema, 
}).strict();

export const WorkoutOfMesocycleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleFindUniqueOrThrowArgs> = z.object({
  select: WorkoutOfMesocycleSelectSchema.optional(),
  include: WorkoutOfMesocycleIncludeSchema.optional(),
  where: WorkoutOfMesocycleWhereUniqueInputSchema, 
}).strict();

export const WorkoutFindFirstArgsSchema: z.ZodType<Prisma.WorkoutFindFirstArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithRelationInputSchema.array(), WorkoutOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutScalarFieldEnumSchema, WorkoutScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkoutFindFirstOrThrowArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithRelationInputSchema.array(), WorkoutOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutScalarFieldEnumSchema, WorkoutScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutFindManyArgsSchema: z.ZodType<Prisma.WorkoutFindManyArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithRelationInputSchema.array(), WorkoutOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutScalarFieldEnumSchema, WorkoutScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutAggregateArgsSchema: z.ZodType<Prisma.WorkoutAggregateArgs> = z.object({
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithRelationInputSchema.array(), WorkoutOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutGroupByArgsSchema: z.ZodType<Prisma.WorkoutGroupByArgs> = z.object({
  where: WorkoutWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutOrderByWithAggregationInputSchema.array(), WorkoutOrderByWithAggregationInputSchema ]).optional(),
  by: WorkoutScalarFieldEnumSchema.array(), 
  having: WorkoutScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutFindUniqueArgsSchema: z.ZodType<Prisma.WorkoutFindUniqueArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereUniqueInputSchema, 
}).strict();

export const WorkoutFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkoutFindUniqueOrThrowArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseFindFirstArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindFirstArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithRelationInputSchema.array(), WorkoutExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseScalarFieldEnumSchema, WorkoutExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindFirstOrThrowArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithRelationInputSchema.array(), WorkoutExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseScalarFieldEnumSchema, WorkoutExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseFindManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindManyArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithRelationInputSchema.array(), WorkoutExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseScalarFieldEnumSchema, WorkoutExerciseScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseAggregateArgsSchema: z.ZodType<Prisma.WorkoutExerciseAggregateArgs> = z.object({
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithRelationInputSchema.array(), WorkoutExerciseOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutExerciseGroupByArgsSchema: z.ZodType<Prisma.WorkoutExerciseGroupByArgs> = z.object({
  where: WorkoutExerciseWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseOrderByWithAggregationInputSchema.array(), WorkoutExerciseOrderByWithAggregationInputSchema ]).optional(),
  by: WorkoutExerciseScalarFieldEnumSchema.array(), 
  having: WorkoutExerciseScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutExerciseFindUniqueArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindUniqueArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkoutExerciseFindUniqueOrThrowArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseSetFindFirstArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetFindFirstArgs> = z.object({
  select: WorkoutExerciseSetSelectSchema.optional(),
  include: WorkoutExerciseSetIncludeSchema.optional(),
  where: WorkoutExerciseSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseSetOrderByWithRelationInputSchema.array(), WorkoutExerciseSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseSetScalarFieldEnumSchema, WorkoutExerciseSetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseSetFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetFindFirstOrThrowArgs> = z.object({
  select: WorkoutExerciseSetSelectSchema.optional(),
  include: WorkoutExerciseSetIncludeSchema.optional(),
  where: WorkoutExerciseSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseSetOrderByWithRelationInputSchema.array(), WorkoutExerciseSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseSetScalarFieldEnumSchema, WorkoutExerciseSetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseSetFindManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetFindManyArgs> = z.object({
  select: WorkoutExerciseSetSelectSchema.optional(),
  include: WorkoutExerciseSetIncludeSchema.optional(),
  where: WorkoutExerciseSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseSetOrderByWithRelationInputSchema.array(), WorkoutExerciseSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseSetScalarFieldEnumSchema, WorkoutExerciseSetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseSetAggregateArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetAggregateArgs> = z.object({
  where: WorkoutExerciseSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseSetOrderByWithRelationInputSchema.array(), WorkoutExerciseSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutExerciseSetGroupByArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetGroupByArgs> = z.object({
  where: WorkoutExerciseSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseSetOrderByWithAggregationInputSchema.array(), WorkoutExerciseSetOrderByWithAggregationInputSchema ]).optional(),
  by: WorkoutExerciseSetScalarFieldEnumSchema.array(), 
  having: WorkoutExerciseSetScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutExerciseSetFindUniqueArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetFindUniqueArgs> = z.object({
  select: WorkoutExerciseSetSelectSchema.optional(),
  include: WorkoutExerciseSetIncludeSchema.optional(),
  where: WorkoutExerciseSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseSetFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetFindUniqueOrThrowArgs> = z.object({
  select: WorkoutExerciseSetSelectSchema.optional(),
  include: WorkoutExerciseSetIncludeSchema.optional(),
  where: WorkoutExerciseSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseMiniSetFindFirstArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetFindFirstArgs> = z.object({
  select: WorkoutExerciseMiniSetSelectSchema.optional(),
  include: WorkoutExerciseMiniSetIncludeSchema.optional(),
  where: WorkoutExerciseMiniSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseMiniSetOrderByWithRelationInputSchema.array(), WorkoutExerciseMiniSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseMiniSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseMiniSetScalarFieldEnumSchema, WorkoutExerciseMiniSetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseMiniSetFindFirstOrThrowArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetFindFirstOrThrowArgs> = z.object({
  select: WorkoutExerciseMiniSetSelectSchema.optional(),
  include: WorkoutExerciseMiniSetIncludeSchema.optional(),
  where: WorkoutExerciseMiniSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseMiniSetOrderByWithRelationInputSchema.array(), WorkoutExerciseMiniSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseMiniSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseMiniSetScalarFieldEnumSchema, WorkoutExerciseMiniSetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseMiniSetFindManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetFindManyArgs> = z.object({
  select: WorkoutExerciseMiniSetSelectSchema.optional(),
  include: WorkoutExerciseMiniSetIncludeSchema.optional(),
  where: WorkoutExerciseMiniSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseMiniSetOrderByWithRelationInputSchema.array(), WorkoutExerciseMiniSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseMiniSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ WorkoutExerciseMiniSetScalarFieldEnumSchema, WorkoutExerciseMiniSetScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const WorkoutExerciseMiniSetAggregateArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetAggregateArgs> = z.object({
  where: WorkoutExerciseMiniSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseMiniSetOrderByWithRelationInputSchema.array(), WorkoutExerciseMiniSetOrderByWithRelationInputSchema ]).optional(),
  cursor: WorkoutExerciseMiniSetWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutExerciseMiniSetGroupByArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetGroupByArgs> = z.object({
  where: WorkoutExerciseMiniSetWhereInputSchema.optional(), 
  orderBy: z.union([ WorkoutExerciseMiniSetOrderByWithAggregationInputSchema.array(), WorkoutExerciseMiniSetOrderByWithAggregationInputSchema ]).optional(),
  by: WorkoutExerciseMiniSetScalarFieldEnumSchema.array(), 
  having: WorkoutExerciseMiniSetScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const WorkoutExerciseMiniSetFindUniqueArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetFindUniqueArgs> = z.object({
  select: WorkoutExerciseMiniSetSelectSchema.optional(),
  include: WorkoutExerciseMiniSetIncludeSchema.optional(),
  where: WorkoutExerciseMiniSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseMiniSetFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetFindUniqueOrThrowArgs> = z.object({
  select: WorkoutExerciseMiniSetSelectSchema.optional(),
  include: WorkoutExerciseMiniSetIncludeSchema.optional(),
  where: WorkoutExerciseMiniSetWhereUniqueInputSchema, 
}).strict();

export const ExerciseSplitCreateArgsSchema: z.ZodType<Prisma.ExerciseSplitCreateArgs> = z.object({
  select: ExerciseSplitSelectSchema.optional(),
  include: ExerciseSplitIncludeSchema.optional(),
  data: z.union([ ExerciseSplitCreateInputSchema, ExerciseSplitUncheckedCreateInputSchema ]),
}).strict();

export const ExerciseSplitUpsertArgsSchema: z.ZodType<Prisma.ExerciseSplitUpsertArgs> = z.object({
  select: ExerciseSplitSelectSchema.optional(),
  include: ExerciseSplitIncludeSchema.optional(),
  where: ExerciseSplitWhereUniqueInputSchema, 
  create: z.union([ ExerciseSplitCreateInputSchema, ExerciseSplitUncheckedCreateInputSchema ]),
  update: z.union([ ExerciseSplitUpdateInputSchema, ExerciseSplitUncheckedUpdateInputSchema ]),
}).strict();

export const ExerciseSplitCreateManyArgsSchema: z.ZodType<Prisma.ExerciseSplitCreateManyArgs> = z.object({
  data: z.union([ ExerciseSplitCreateManyInputSchema, ExerciseSplitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ExerciseSplitCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ExerciseSplitCreateManyAndReturnArgs> = z.object({
  data: z.union([ ExerciseSplitCreateManyInputSchema, ExerciseSplitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ExerciseSplitDeleteArgsSchema: z.ZodType<Prisma.ExerciseSplitDeleteArgs> = z.object({
  select: ExerciseSplitSelectSchema.optional(),
  include: ExerciseSplitIncludeSchema.optional(),
  where: ExerciseSplitWhereUniqueInputSchema, 
}).strict();

export const ExerciseSplitUpdateArgsSchema: z.ZodType<Prisma.ExerciseSplitUpdateArgs> = z.object({
  select: ExerciseSplitSelectSchema.optional(),
  include: ExerciseSplitIncludeSchema.optional(),
  data: z.union([ ExerciseSplitUpdateInputSchema, ExerciseSplitUncheckedUpdateInputSchema ]),
  where: ExerciseSplitWhereUniqueInputSchema, 
}).strict();

export const ExerciseSplitUpdateManyArgsSchema: z.ZodType<Prisma.ExerciseSplitUpdateManyArgs> = z.object({
  data: z.union([ ExerciseSplitUpdateManyMutationInputSchema, ExerciseSplitUncheckedUpdateManyInputSchema ]),
  where: ExerciseSplitWhereInputSchema.optional(), 
}).strict();

export const ExerciseSplitDeleteManyArgsSchema: z.ZodType<Prisma.ExerciseSplitDeleteManyArgs> = z.object({
  where: ExerciseSplitWhereInputSchema.optional(), 
}).strict();

export const ExerciseSplitDayCreateArgsSchema: z.ZodType<Prisma.ExerciseSplitDayCreateArgs> = z.object({
  select: ExerciseSplitDaySelectSchema.optional(),
  include: ExerciseSplitDayIncludeSchema.optional(),
  data: z.union([ ExerciseSplitDayCreateInputSchema, ExerciseSplitDayUncheckedCreateInputSchema ]),
}).strict();

export const ExerciseSplitDayUpsertArgsSchema: z.ZodType<Prisma.ExerciseSplitDayUpsertArgs> = z.object({
  select: ExerciseSplitDaySelectSchema.optional(),
  include: ExerciseSplitDayIncludeSchema.optional(),
  where: ExerciseSplitDayWhereUniqueInputSchema, 
  create: z.union([ ExerciseSplitDayCreateInputSchema, ExerciseSplitDayUncheckedCreateInputSchema ]),
  update: z.union([ ExerciseSplitDayUpdateInputSchema, ExerciseSplitDayUncheckedUpdateInputSchema ]),
}).strict();

export const ExerciseSplitDayCreateManyArgsSchema: z.ZodType<Prisma.ExerciseSplitDayCreateManyArgs> = z.object({
  data: z.union([ ExerciseSplitDayCreateManyInputSchema, ExerciseSplitDayCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ExerciseSplitDayCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ExerciseSplitDayCreateManyAndReturnArgs> = z.object({
  data: z.union([ ExerciseSplitDayCreateManyInputSchema, ExerciseSplitDayCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ExerciseSplitDayDeleteArgsSchema: z.ZodType<Prisma.ExerciseSplitDayDeleteArgs> = z.object({
  select: ExerciseSplitDaySelectSchema.optional(),
  include: ExerciseSplitDayIncludeSchema.optional(),
  where: ExerciseSplitDayWhereUniqueInputSchema, 
}).strict();

export const ExerciseSplitDayUpdateArgsSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateArgs> = z.object({
  select: ExerciseSplitDaySelectSchema.optional(),
  include: ExerciseSplitDayIncludeSchema.optional(),
  data: z.union([ ExerciseSplitDayUpdateInputSchema, ExerciseSplitDayUncheckedUpdateInputSchema ]),
  where: ExerciseSplitDayWhereUniqueInputSchema, 
}).strict();

export const ExerciseSplitDayUpdateManyArgsSchema: z.ZodType<Prisma.ExerciseSplitDayUpdateManyArgs> = z.object({
  data: z.union([ ExerciseSplitDayUpdateManyMutationInputSchema, ExerciseSplitDayUncheckedUpdateManyInputSchema ]),
  where: ExerciseSplitDayWhereInputSchema.optional(), 
}).strict();

export const ExerciseSplitDayDeleteManyArgsSchema: z.ZodType<Prisma.ExerciseSplitDayDeleteManyArgs> = z.object({
  where: ExerciseSplitDayWhereInputSchema.optional(), 
}).strict();

export const ExerciseTemplateCreateArgsSchema: z.ZodType<Prisma.ExerciseTemplateCreateArgs> = z.object({
  select: ExerciseTemplateSelectSchema.optional(),
  include: ExerciseTemplateIncludeSchema.optional(),
  data: z.union([ ExerciseTemplateCreateInputSchema, ExerciseTemplateUncheckedCreateInputSchema ]),
}).strict();

export const ExerciseTemplateUpsertArgsSchema: z.ZodType<Prisma.ExerciseTemplateUpsertArgs> = z.object({
  select: ExerciseTemplateSelectSchema.optional(),
  include: ExerciseTemplateIncludeSchema.optional(),
  where: ExerciseTemplateWhereUniqueInputSchema, 
  create: z.union([ ExerciseTemplateCreateInputSchema, ExerciseTemplateUncheckedCreateInputSchema ]),
  update: z.union([ ExerciseTemplateUpdateInputSchema, ExerciseTemplateUncheckedUpdateInputSchema ]),
}).strict();

export const ExerciseTemplateCreateManyArgsSchema: z.ZodType<Prisma.ExerciseTemplateCreateManyArgs> = z.object({
  data: z.union([ ExerciseTemplateCreateManyInputSchema, ExerciseTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ExerciseTemplateCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ExerciseTemplateCreateManyAndReturnArgs> = z.object({
  data: z.union([ ExerciseTemplateCreateManyInputSchema, ExerciseTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ExerciseTemplateDeleteArgsSchema: z.ZodType<Prisma.ExerciseTemplateDeleteArgs> = z.object({
  select: ExerciseTemplateSelectSchema.optional(),
  include: ExerciseTemplateIncludeSchema.optional(),
  where: ExerciseTemplateWhereUniqueInputSchema, 
}).strict();

export const ExerciseTemplateUpdateArgsSchema: z.ZodType<Prisma.ExerciseTemplateUpdateArgs> = z.object({
  select: ExerciseTemplateSelectSchema.optional(),
  include: ExerciseTemplateIncludeSchema.optional(),
  data: z.union([ ExerciseTemplateUpdateInputSchema, ExerciseTemplateUncheckedUpdateInputSchema ]),
  where: ExerciseTemplateWhereUniqueInputSchema, 
}).strict();

export const ExerciseTemplateUpdateManyArgsSchema: z.ZodType<Prisma.ExerciseTemplateUpdateManyArgs> = z.object({
  data: z.union([ ExerciseTemplateUpdateManyMutationInputSchema, ExerciseTemplateUncheckedUpdateManyInputSchema ]),
  where: ExerciseTemplateWhereInputSchema.optional(), 
}).strict();

export const ExerciseTemplateDeleteManyArgsSchema: z.ZodType<Prisma.ExerciseTemplateDeleteManyArgs> = z.object({
  where: ExerciseTemplateWhereInputSchema.optional(), 
}).strict();

export const MesocycleCreateArgsSchema: z.ZodType<Prisma.MesocycleCreateArgs> = z.object({
  select: MesocycleSelectSchema.optional(),
  include: MesocycleIncludeSchema.optional(),
  data: z.union([ MesocycleCreateInputSchema, MesocycleUncheckedCreateInputSchema ]),
}).strict();

export const MesocycleUpsertArgsSchema: z.ZodType<Prisma.MesocycleUpsertArgs> = z.object({
  select: MesocycleSelectSchema.optional(),
  include: MesocycleIncludeSchema.optional(),
  where: MesocycleWhereUniqueInputSchema, 
  create: z.union([ MesocycleCreateInputSchema, MesocycleUncheckedCreateInputSchema ]),
  update: z.union([ MesocycleUpdateInputSchema, MesocycleUncheckedUpdateInputSchema ]),
}).strict();

export const MesocycleCreateManyArgsSchema: z.ZodType<Prisma.MesocycleCreateManyArgs> = z.object({
  data: z.union([ MesocycleCreateManyInputSchema, MesocycleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MesocycleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MesocycleCreateManyAndReturnArgs> = z.object({
  data: z.union([ MesocycleCreateManyInputSchema, MesocycleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MesocycleDeleteArgsSchema: z.ZodType<Prisma.MesocycleDeleteArgs> = z.object({
  select: MesocycleSelectSchema.optional(),
  include: MesocycleIncludeSchema.optional(),
  where: MesocycleWhereUniqueInputSchema, 
}).strict();

export const MesocycleUpdateArgsSchema: z.ZodType<Prisma.MesocycleUpdateArgs> = z.object({
  select: MesocycleSelectSchema.optional(),
  include: MesocycleIncludeSchema.optional(),
  data: z.union([ MesocycleUpdateInputSchema, MesocycleUncheckedUpdateInputSchema ]),
  where: MesocycleWhereUniqueInputSchema, 
}).strict();

export const MesocycleUpdateManyArgsSchema: z.ZodType<Prisma.MesocycleUpdateManyArgs> = z.object({
  data: z.union([ MesocycleUpdateManyMutationInputSchema, MesocycleUncheckedUpdateManyInputSchema ]),
  where: MesocycleWhereInputSchema.optional(), 
}).strict();

export const MesocycleDeleteManyArgsSchema: z.ZodType<Prisma.MesocycleDeleteManyArgs> = z.object({
  where: MesocycleWhereInputSchema.optional(), 
}).strict();

export const MesocycleCyclicSetChangeCreateArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateArgs> = z.object({
  select: MesocycleCyclicSetChangeSelectSchema.optional(),
  include: MesocycleCyclicSetChangeIncludeSchema.optional(),
  data: z.union([ MesocycleCyclicSetChangeCreateInputSchema, MesocycleCyclicSetChangeUncheckedCreateInputSchema ]),
}).strict();

export const MesocycleCyclicSetChangeUpsertArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpsertArgs> = z.object({
  select: MesocycleCyclicSetChangeSelectSchema.optional(),
  include: MesocycleCyclicSetChangeIncludeSchema.optional(),
  where: MesocycleCyclicSetChangeWhereUniqueInputSchema, 
  create: z.union([ MesocycleCyclicSetChangeCreateInputSchema, MesocycleCyclicSetChangeUncheckedCreateInputSchema ]),
  update: z.union([ MesocycleCyclicSetChangeUpdateInputSchema, MesocycleCyclicSetChangeUncheckedUpdateInputSchema ]),
}).strict();

export const MesocycleCyclicSetChangeCreateManyArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateManyArgs> = z.object({
  data: z.union([ MesocycleCyclicSetChangeCreateManyInputSchema, MesocycleCyclicSetChangeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MesocycleCyclicSetChangeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeCreateManyAndReturnArgs> = z.object({
  data: z.union([ MesocycleCyclicSetChangeCreateManyInputSchema, MesocycleCyclicSetChangeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MesocycleCyclicSetChangeDeleteArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeDeleteArgs> = z.object({
  select: MesocycleCyclicSetChangeSelectSchema.optional(),
  include: MesocycleCyclicSetChangeIncludeSchema.optional(),
  where: MesocycleCyclicSetChangeWhereUniqueInputSchema, 
}).strict();

export const MesocycleCyclicSetChangeUpdateArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpdateArgs> = z.object({
  select: MesocycleCyclicSetChangeSelectSchema.optional(),
  include: MesocycleCyclicSetChangeIncludeSchema.optional(),
  data: z.union([ MesocycleCyclicSetChangeUpdateInputSchema, MesocycleCyclicSetChangeUncheckedUpdateInputSchema ]),
  where: MesocycleCyclicSetChangeWhereUniqueInputSchema, 
}).strict();

export const MesocycleCyclicSetChangeUpdateManyArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeUpdateManyArgs> = z.object({
  data: z.union([ MesocycleCyclicSetChangeUpdateManyMutationInputSchema, MesocycleCyclicSetChangeUncheckedUpdateManyInputSchema ]),
  where: MesocycleCyclicSetChangeWhereInputSchema.optional(), 
}).strict();

export const MesocycleCyclicSetChangeDeleteManyArgsSchema: z.ZodType<Prisma.MesocycleCyclicSetChangeDeleteManyArgs> = z.object({
  where: MesocycleCyclicSetChangeWhereInputSchema.optional(), 
}).strict();

export const MesocycleExerciseSplitDayCreateArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateArgs> = z.object({
  select: MesocycleExerciseSplitDaySelectSchema.optional(),
  include: MesocycleExerciseSplitDayIncludeSchema.optional(),
  data: z.union([ MesocycleExerciseSplitDayCreateInputSchema, MesocycleExerciseSplitDayUncheckedCreateInputSchema ]),
}).strict();

export const MesocycleExerciseSplitDayUpsertArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpsertArgs> = z.object({
  select: MesocycleExerciseSplitDaySelectSchema.optional(),
  include: MesocycleExerciseSplitDayIncludeSchema.optional(),
  where: MesocycleExerciseSplitDayWhereUniqueInputSchema, 
  create: z.union([ MesocycleExerciseSplitDayCreateInputSchema, MesocycleExerciseSplitDayUncheckedCreateInputSchema ]),
  update: z.union([ MesocycleExerciseSplitDayUpdateInputSchema, MesocycleExerciseSplitDayUncheckedUpdateInputSchema ]),
}).strict();

export const MesocycleExerciseSplitDayCreateManyArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateManyArgs> = z.object({
  data: z.union([ MesocycleExerciseSplitDayCreateManyInputSchema, MesocycleExerciseSplitDayCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MesocycleExerciseSplitDayCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayCreateManyAndReturnArgs> = z.object({
  data: z.union([ MesocycleExerciseSplitDayCreateManyInputSchema, MesocycleExerciseSplitDayCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MesocycleExerciseSplitDayDeleteArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayDeleteArgs> = z.object({
  select: MesocycleExerciseSplitDaySelectSchema.optional(),
  include: MesocycleExerciseSplitDayIncludeSchema.optional(),
  where: MesocycleExerciseSplitDayWhereUniqueInputSchema, 
}).strict();

export const MesocycleExerciseSplitDayUpdateArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateArgs> = z.object({
  select: MesocycleExerciseSplitDaySelectSchema.optional(),
  include: MesocycleExerciseSplitDayIncludeSchema.optional(),
  data: z.union([ MesocycleExerciseSplitDayUpdateInputSchema, MesocycleExerciseSplitDayUncheckedUpdateInputSchema ]),
  where: MesocycleExerciseSplitDayWhereUniqueInputSchema, 
}).strict();

export const MesocycleExerciseSplitDayUpdateManyArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayUpdateManyArgs> = z.object({
  data: z.union([ MesocycleExerciseSplitDayUpdateManyMutationInputSchema, MesocycleExerciseSplitDayUncheckedUpdateManyInputSchema ]),
  where: MesocycleExerciseSplitDayWhereInputSchema.optional(), 
}).strict();

export const MesocycleExerciseSplitDayDeleteManyArgsSchema: z.ZodType<Prisma.MesocycleExerciseSplitDayDeleteManyArgs> = z.object({
  where: MesocycleExerciseSplitDayWhereInputSchema.optional(), 
}).strict();

export const MesocycleExerciseTemplateCreateArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateArgs> = z.object({
  select: MesocycleExerciseTemplateSelectSchema.optional(),
  include: MesocycleExerciseTemplateIncludeSchema.optional(),
  data: z.union([ MesocycleExerciseTemplateCreateInputSchema, MesocycleExerciseTemplateUncheckedCreateInputSchema ]),
}).strict();

export const MesocycleExerciseTemplateUpsertArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpsertArgs> = z.object({
  select: MesocycleExerciseTemplateSelectSchema.optional(),
  include: MesocycleExerciseTemplateIncludeSchema.optional(),
  where: MesocycleExerciseTemplateWhereUniqueInputSchema, 
  create: z.union([ MesocycleExerciseTemplateCreateInputSchema, MesocycleExerciseTemplateUncheckedCreateInputSchema ]),
  update: z.union([ MesocycleExerciseTemplateUpdateInputSchema, MesocycleExerciseTemplateUncheckedUpdateInputSchema ]),
}).strict();

export const MesocycleExerciseTemplateCreateManyArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateManyArgs> = z.object({
  data: z.union([ MesocycleExerciseTemplateCreateManyInputSchema, MesocycleExerciseTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MesocycleExerciseTemplateCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateCreateManyAndReturnArgs> = z.object({
  data: z.union([ MesocycleExerciseTemplateCreateManyInputSchema, MesocycleExerciseTemplateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MesocycleExerciseTemplateDeleteArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateDeleteArgs> = z.object({
  select: MesocycleExerciseTemplateSelectSchema.optional(),
  include: MesocycleExerciseTemplateIncludeSchema.optional(),
  where: MesocycleExerciseTemplateWhereUniqueInputSchema, 
}).strict();

export const MesocycleExerciseTemplateUpdateArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpdateArgs> = z.object({
  select: MesocycleExerciseTemplateSelectSchema.optional(),
  include: MesocycleExerciseTemplateIncludeSchema.optional(),
  data: z.union([ MesocycleExerciseTemplateUpdateInputSchema, MesocycleExerciseTemplateUncheckedUpdateInputSchema ]),
  where: MesocycleExerciseTemplateWhereUniqueInputSchema, 
}).strict();

export const MesocycleExerciseTemplateUpdateManyArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateUpdateManyArgs> = z.object({
  data: z.union([ MesocycleExerciseTemplateUpdateManyMutationInputSchema, MesocycleExerciseTemplateUncheckedUpdateManyInputSchema ]),
  where: MesocycleExerciseTemplateWhereInputSchema.optional(), 
}).strict();

export const MesocycleExerciseTemplateDeleteManyArgsSchema: z.ZodType<Prisma.MesocycleExerciseTemplateDeleteManyArgs> = z.object({
  where: MesocycleExerciseTemplateWhereInputSchema.optional(), 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
}).strict();

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema, AccountUncheckedCreateInputSchema ]),
}).strict();

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema, 
  create: z.union([ AccountCreateInputSchema, AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema ]),
}).strict();

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema, AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema, AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema, 
}).strict();

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema, 
}).strict();

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(), 
}).strict();

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(), 
}).strict();

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema, SessionUncheckedCreateInputSchema ]),
}).strict();

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
  create: z.union([ SessionCreateInputSchema, SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema ]),
}).strict();

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema, SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema, SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(), 
}).strict();

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(), 
}).strict();

export const VerificationTokenCreateArgsSchema: z.ZodType<Prisma.VerificationTokenCreateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenCreateInputSchema, VerificationTokenUncheckedCreateInputSchema ]),
}).strict();

export const VerificationTokenUpsertArgsSchema: z.ZodType<Prisma.VerificationTokenUpsertArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema, 
  create: z.union([ VerificationTokenCreateInputSchema, VerificationTokenUncheckedCreateInputSchema ]),
  update: z.union([ VerificationTokenUpdateInputSchema, VerificationTokenUncheckedUpdateInputSchema ]),
}).strict();

export const VerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema, VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VerificationTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema, VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VerificationTokenDeleteArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema, 
}).strict();

export const VerificationTokenUpdateArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenUpdateInputSchema, VerificationTokenUncheckedUpdateInputSchema ]),
  where: VerificationTokenWhereUniqueInputSchema, 
}).strict();

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyArgs> = z.object({
  data: z.union([ VerificationTokenUpdateManyMutationInputSchema, VerificationTokenUncheckedUpdateManyInputSchema ]),
  where: VerificationTokenWhereInputSchema.optional(), 
}).strict();

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteManyArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(), 
}).strict();

export const UserSettingsCreateArgsSchema: z.ZodType<Prisma.UserSettingsCreateArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  data: z.union([ UserSettingsCreateInputSchema, UserSettingsUncheckedCreateInputSchema ]),
}).strict();

export const UserSettingsUpsertArgsSchema: z.ZodType<Prisma.UserSettingsUpsertArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereUniqueInputSchema, 
  create: z.union([ UserSettingsCreateInputSchema, UserSettingsUncheckedCreateInputSchema ]),
  update: z.union([ UserSettingsUpdateInputSchema, UserSettingsUncheckedUpdateInputSchema ]),
}).strict();

export const UserSettingsCreateManyArgsSchema: z.ZodType<Prisma.UserSettingsCreateManyArgs> = z.object({
  data: z.union([ UserSettingsCreateManyInputSchema, UserSettingsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserSettingsCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserSettingsCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserSettingsCreateManyInputSchema, UserSettingsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserSettingsDeleteArgsSchema: z.ZodType<Prisma.UserSettingsDeleteArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  where: UserSettingsWhereUniqueInputSchema, 
}).strict();

export const UserSettingsUpdateArgsSchema: z.ZodType<Prisma.UserSettingsUpdateArgs> = z.object({
  select: UserSettingsSelectSchema.optional(),
  include: UserSettingsIncludeSchema.optional(),
  data: z.union([ UserSettingsUpdateInputSchema, UserSettingsUncheckedUpdateInputSchema ]),
  where: UserSettingsWhereUniqueInputSchema, 
}).strict();

export const UserSettingsUpdateManyArgsSchema: z.ZodType<Prisma.UserSettingsUpdateManyArgs> = z.object({
  data: z.union([ UserSettingsUpdateManyMutationInputSchema, UserSettingsUncheckedUpdateManyInputSchema ]),
  where: UserSettingsWhereInputSchema.optional(), 
}).strict();

export const UserSettingsDeleteManyArgsSchema: z.ZodType<Prisma.UserSettingsDeleteManyArgs> = z.object({
  where: UserSettingsWhereInputSchema.optional(), 
}).strict();

export const WorkoutOfMesocycleCreateArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateArgs> = z.object({
  select: WorkoutOfMesocycleSelectSchema.optional(),
  include: WorkoutOfMesocycleIncludeSchema.optional(),
  data: z.union([ WorkoutOfMesocycleCreateInputSchema, WorkoutOfMesocycleUncheckedCreateInputSchema ]),
}).strict();

export const WorkoutOfMesocycleUpsertArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpsertArgs> = z.object({
  select: WorkoutOfMesocycleSelectSchema.optional(),
  include: WorkoutOfMesocycleIncludeSchema.optional(),
  where: WorkoutOfMesocycleWhereUniqueInputSchema, 
  create: z.union([ WorkoutOfMesocycleCreateInputSchema, WorkoutOfMesocycleUncheckedCreateInputSchema ]),
  update: z.union([ WorkoutOfMesocycleUpdateInputSchema, WorkoutOfMesocycleUncheckedUpdateInputSchema ]),
}).strict();

export const WorkoutOfMesocycleCreateManyArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateManyArgs> = z.object({
  data: z.union([ WorkoutOfMesocycleCreateManyInputSchema, WorkoutOfMesocycleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutOfMesocycleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutOfMesocycleCreateManyInputSchema, WorkoutOfMesocycleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutOfMesocycleDeleteArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleDeleteArgs> = z.object({
  select: WorkoutOfMesocycleSelectSchema.optional(),
  include: WorkoutOfMesocycleIncludeSchema.optional(),
  where: WorkoutOfMesocycleWhereUniqueInputSchema, 
}).strict();

export const WorkoutOfMesocycleUpdateArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateArgs> = z.object({
  select: WorkoutOfMesocycleSelectSchema.optional(),
  include: WorkoutOfMesocycleIncludeSchema.optional(),
  data: z.union([ WorkoutOfMesocycleUpdateInputSchema, WorkoutOfMesocycleUncheckedUpdateInputSchema ]),
  where: WorkoutOfMesocycleWhereUniqueInputSchema, 
}).strict();

export const WorkoutOfMesocycleUpdateManyArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleUpdateManyArgs> = z.object({
  data: z.union([ WorkoutOfMesocycleUpdateManyMutationInputSchema, WorkoutOfMesocycleUncheckedUpdateManyInputSchema ]),
  where: WorkoutOfMesocycleWhereInputSchema.optional(), 
}).strict();

export const WorkoutOfMesocycleDeleteManyArgsSchema: z.ZodType<Prisma.WorkoutOfMesocycleDeleteManyArgs> = z.object({
  where: WorkoutOfMesocycleWhereInputSchema.optional(), 
}).strict();

export const WorkoutCreateArgsSchema: z.ZodType<Prisma.WorkoutCreateArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  data: z.union([ WorkoutCreateInputSchema, WorkoutUncheckedCreateInputSchema ]),
}).strict();

export const WorkoutUpsertArgsSchema: z.ZodType<Prisma.WorkoutUpsertArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereUniqueInputSchema, 
  create: z.union([ WorkoutCreateInputSchema, WorkoutUncheckedCreateInputSchema ]),
  update: z.union([ WorkoutUpdateInputSchema, WorkoutUncheckedUpdateInputSchema ]),
}).strict();

export const WorkoutCreateManyArgsSchema: z.ZodType<Prisma.WorkoutCreateManyArgs> = z.object({
  data: z.union([ WorkoutCreateManyInputSchema, WorkoutCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutCreateManyInputSchema, WorkoutCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutDeleteArgsSchema: z.ZodType<Prisma.WorkoutDeleteArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  where: WorkoutWhereUniqueInputSchema, 
}).strict();

export const WorkoutUpdateArgsSchema: z.ZodType<Prisma.WorkoutUpdateArgs> = z.object({
  select: WorkoutSelectSchema.optional(),
  include: WorkoutIncludeSchema.optional(),
  data: z.union([ WorkoutUpdateInputSchema, WorkoutUncheckedUpdateInputSchema ]),
  where: WorkoutWhereUniqueInputSchema, 
}).strict();

export const WorkoutUpdateManyArgsSchema: z.ZodType<Prisma.WorkoutUpdateManyArgs> = z.object({
  data: z.union([ WorkoutUpdateManyMutationInputSchema, WorkoutUncheckedUpdateManyInputSchema ]),
  where: WorkoutWhereInputSchema.optional(), 
}).strict();

export const WorkoutDeleteManyArgsSchema: z.ZodType<Prisma.WorkoutDeleteManyArgs> = z.object({
  where: WorkoutWhereInputSchema.optional(), 
}).strict();

export const WorkoutExerciseCreateArgsSchema: z.ZodType<Prisma.WorkoutExerciseCreateArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  data: z.union([ WorkoutExerciseCreateInputSchema, WorkoutExerciseUncheckedCreateInputSchema ]),
}).strict();

export const WorkoutExerciseUpsertArgsSchema: z.ZodType<Prisma.WorkoutExerciseUpsertArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereUniqueInputSchema, 
  create: z.union([ WorkoutExerciseCreateInputSchema, WorkoutExerciseUncheckedCreateInputSchema ]),
  update: z.union([ WorkoutExerciseUpdateInputSchema, WorkoutExerciseUncheckedUpdateInputSchema ]),
}).strict();

export const WorkoutExerciseCreateManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyArgs> = z.object({
  data: z.union([ WorkoutExerciseCreateManyInputSchema, WorkoutExerciseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutExerciseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutExerciseCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutExerciseCreateManyInputSchema, WorkoutExerciseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutExerciseDeleteArgsSchema: z.ZodType<Prisma.WorkoutExerciseDeleteArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  where: WorkoutExerciseWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseUpdateArgsSchema: z.ZodType<Prisma.WorkoutExerciseUpdateArgs> = z.object({
  select: WorkoutExerciseSelectSchema.optional(),
  include: WorkoutExerciseIncludeSchema.optional(),
  data: z.union([ WorkoutExerciseUpdateInputSchema, WorkoutExerciseUncheckedUpdateInputSchema ]),
  where: WorkoutExerciseWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseUpdateManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseUpdateManyArgs> = z.object({
  data: z.union([ WorkoutExerciseUpdateManyMutationInputSchema, WorkoutExerciseUncheckedUpdateManyInputSchema ]),
  where: WorkoutExerciseWhereInputSchema.optional(), 
}).strict();

export const WorkoutExerciseDeleteManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseDeleteManyArgs> = z.object({
  where: WorkoutExerciseWhereInputSchema.optional(), 
}).strict();

export const WorkoutExerciseSetCreateArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateArgs> = z.object({
  select: WorkoutExerciseSetSelectSchema.optional(),
  include: WorkoutExerciseSetIncludeSchema.optional(),
  data: z.union([ WorkoutExerciseSetCreateInputSchema, WorkoutExerciseSetUncheckedCreateInputSchema ]),
}).strict();

export const WorkoutExerciseSetUpsertArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetUpsertArgs> = z.object({
  select: WorkoutExerciseSetSelectSchema.optional(),
  include: WorkoutExerciseSetIncludeSchema.optional(),
  where: WorkoutExerciseSetWhereUniqueInputSchema, 
  create: z.union([ WorkoutExerciseSetCreateInputSchema, WorkoutExerciseSetUncheckedCreateInputSchema ]),
  update: z.union([ WorkoutExerciseSetUpdateInputSchema, WorkoutExerciseSetUncheckedUpdateInputSchema ]),
}).strict();

export const WorkoutExerciseSetCreateManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateManyArgs> = z.object({
  data: z.union([ WorkoutExerciseSetCreateManyInputSchema, WorkoutExerciseSetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutExerciseSetCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutExerciseSetCreateManyInputSchema, WorkoutExerciseSetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutExerciseSetDeleteArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetDeleteArgs> = z.object({
  select: WorkoutExerciseSetSelectSchema.optional(),
  include: WorkoutExerciseSetIncludeSchema.optional(),
  where: WorkoutExerciseSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseSetUpdateArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateArgs> = z.object({
  select: WorkoutExerciseSetSelectSchema.optional(),
  include: WorkoutExerciseSetIncludeSchema.optional(),
  data: z.union([ WorkoutExerciseSetUpdateInputSchema, WorkoutExerciseSetUncheckedUpdateInputSchema ]),
  where: WorkoutExerciseSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseSetUpdateManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetUpdateManyArgs> = z.object({
  data: z.union([ WorkoutExerciseSetUpdateManyMutationInputSchema, WorkoutExerciseSetUncheckedUpdateManyInputSchema ]),
  where: WorkoutExerciseSetWhereInputSchema.optional(), 
}).strict();

export const WorkoutExerciseSetDeleteManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseSetDeleteManyArgs> = z.object({
  where: WorkoutExerciseSetWhereInputSchema.optional(), 
}).strict();

export const WorkoutExerciseMiniSetCreateArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateArgs> = z.object({
  select: WorkoutExerciseMiniSetSelectSchema.optional(),
  include: WorkoutExerciseMiniSetIncludeSchema.optional(),
  data: z.union([ WorkoutExerciseMiniSetCreateInputSchema, WorkoutExerciseMiniSetUncheckedCreateInputSchema ]),
}).strict();

export const WorkoutExerciseMiniSetUpsertArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpsertArgs> = z.object({
  select: WorkoutExerciseMiniSetSelectSchema.optional(),
  include: WorkoutExerciseMiniSetIncludeSchema.optional(),
  where: WorkoutExerciseMiniSetWhereUniqueInputSchema, 
  create: z.union([ WorkoutExerciseMiniSetCreateInputSchema, WorkoutExerciseMiniSetUncheckedCreateInputSchema ]),
  update: z.union([ WorkoutExerciseMiniSetUpdateInputSchema, WorkoutExerciseMiniSetUncheckedUpdateInputSchema ]),
}).strict();

export const WorkoutExerciseMiniSetCreateManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateManyArgs> = z.object({
  data: z.union([ WorkoutExerciseMiniSetCreateManyInputSchema, WorkoutExerciseMiniSetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutExerciseMiniSetCreateManyAndReturnArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetCreateManyAndReturnArgs> = z.object({
  data: z.union([ WorkoutExerciseMiniSetCreateManyInputSchema, WorkoutExerciseMiniSetCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const WorkoutExerciseMiniSetDeleteArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetDeleteArgs> = z.object({
  select: WorkoutExerciseMiniSetSelectSchema.optional(),
  include: WorkoutExerciseMiniSetIncludeSchema.optional(),
  where: WorkoutExerciseMiniSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseMiniSetUpdateArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpdateArgs> = z.object({
  select: WorkoutExerciseMiniSetSelectSchema.optional(),
  include: WorkoutExerciseMiniSetIncludeSchema.optional(),
  data: z.union([ WorkoutExerciseMiniSetUpdateInputSchema, WorkoutExerciseMiniSetUncheckedUpdateInputSchema ]),
  where: WorkoutExerciseMiniSetWhereUniqueInputSchema, 
}).strict();

export const WorkoutExerciseMiniSetUpdateManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetUpdateManyArgs> = z.object({
  data: z.union([ WorkoutExerciseMiniSetUpdateManyMutationInputSchema, WorkoutExerciseMiniSetUncheckedUpdateManyInputSchema ]),
  where: WorkoutExerciseMiniSetWhereInputSchema.optional(), 
}).strict();

export const WorkoutExerciseMiniSetDeleteManyArgsSchema: z.ZodType<Prisma.WorkoutExerciseMiniSetDeleteManyArgs> = z.object({
  where: WorkoutExerciseMiniSetWhereInputSchema.optional(), 
}).strict();