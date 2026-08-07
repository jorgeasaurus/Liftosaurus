# Feature status tracker

## How to use this tracker

- Each row is one user-facing feature or workflow.
- Status should reflect the current codebase and the latest verified behavior.
- When a user story fails in testing, add the evidence in the Notes column and move the status to Needs attention.

## Tracker

| Feature | User story | Expected behavior | Status | Notes |
| --- | --- | --- | --- | --- |
| Workout logging | A signed-in user can start a workout, log exercises and sets, and finish it without losing draft state. | The app keeps the active draft isolated from historical edits and saves progress across reloads. | Needs verification | Runtime startup was previously blocked by a Zod compatibility issue; a regression test now covers the schema helper. |
| Workout editing | A user can reopen and edit a previously completed workout without affecting an in-progress draft. | Historical edits do not overwrite the active workout draft and changes persist correctly. | Needs verification | Requires an authenticated local run with the database configured. |
| Dashboard metrics | A user can inspect recent training performance and bodyweight trends. | The dashboard shows recent metrics, averages, and trend visuals without blank or inconsistent values. | Needs verification | Current verification is blocked by the local test environment needing database credentials. |
| Exercise stats | A user can view historical exercise performance and chart trends. | Exercise history loads and charts reflect completed workouts correctly. | Needs verification | Needs end-to-end validation after the runtime issue is unblocked. |
| Manual deload | A user can mark deloads for an exercise or muscle group and keep progression logic from using those sets. | Deloads are preserved and excluded from progression calculations. | Needs verification | Feature-specific test coverage exists but needs runtime verification. |
| Adaptive rep ranges | A user can complete workouts and let rep ranges adapt from recent performance. | The app derives rep ranges from the first completed working set and updates them consistently. | Needs verification | Feature-specific test coverage exists but needs runtime verification. |
| Progression preference | A user can choose reps-first or load-first progression and see the preference applied to mesocycle templates. | Saved preference flows through to exercise templates and progression behavior. | Needs verification | Feature-specific test coverage exists but needs runtime verification. |
| Data export | A user can export workouts as JSON and CSV backups. | Exported files are generated, versioned, and reflect the current user data. | Needs verification | Feature-specific test coverage exists but needs runtime verification. |
| Exercise split management | A user can create and manage exercise splits and mesocycles. | Split templates and mesocycle data load and save correctly. | Needs verification | Needs broader route-level validation. |
| Settings and profile | A user can update settings, preferences, and profile details. | Preferences save and the UI reflects the current values. | Needs verification | Needs runtime validation after environment setup. |
| Offline and PWA support | A returning user can continue using the app when offline and receive updates after reconnecting. | Offline fallback and service-worker updates behave reliably. | Needs verification | Requires browser-level verification. |
