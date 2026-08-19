import assert from 'node:assert/strict';
import { createId } from '@paralleldrive/cuid2';
import { prisma } from '../src/lib/prisma';
import { createCaller } from '../src/lib/trpc/router';
import { expect, test } from './fixtures';

const ownerCustomName = 'Owner-only cable sweep';
const otherCustomName = 'Other-user jefferson curl';

let otherUserId: string | undefined;

test.afterEach(async () => {
	if (otherUserId) await prisma.user.deleteMany({ where: { id: otherUserId } });
	otherUserId = undefined;
});

test('custom exercises are private to the owning account', async ({ page, userData }) => {
	otherUserId = createId();
	await prisma.user.create({
		data: { id: otherUserId, email: `test-user-custom-exercise-${otherUserId}@Liftosaurus.com` }
	});

	const owner = createCaller({ userId: userData.userId, event: {} as never });
	const otherUser = createCaller({ userId: otherUserId, event: {} as never });

	const ownerCustom = await owner.customExercises.upsert({
		name: ownerCustomName,
		targetMuscleGroup: 'Chest',
		customMuscleGroup: null,
		setType: 'Straight',
		repRangeStart: 8,
		repRangeEnd: 12
	});
	const otherCustom = await otherUser.customExercises.upsert({
		name: otherCustomName,
		targetMuscleGroup: 'Hamstrings',
		customMuscleGroup: null,
		setType: 'Straight',
		repRangeStart: 6,
		repRangeEnd: 10
	});
	const ownerList = await owner.customExercises.list();
	const otherList = await otherUser.customExercises.list();
	const ownerPickable = await owner.workouts.getUserExercises('minimal');
	const otherPickable = await otherUser.workouts.getUserExercises('minimal');

	assert.deepEqual(
		ownerList.map((exercise) => exercise.name),
		[ownerCustomName]
	);
	assert.deepEqual(
		otherList.map((exercise) => exercise.name),
		[otherCustomName]
	);
	assert.equal(
		ownerPickable.some((exercise) => exercise.name === ownerCustomName && exercise.customExerciseId === ownerCustom.id),
		true
	);
	assert.equal(
		ownerPickable.some((exercise) => exercise.name === otherCustomName),
		false
	);
	assert.equal(
		otherPickable.some((exercise) => exercise.name === ownerCustomName),
		false
	);
	assert.equal(
		ownerPickable.some((exercise) => exercise.name === 'Barbell bench press'),
		false
	);

	await assert.rejects(
		owner.customExercises.updateById({
			id: otherCustom.id,
			name: 'Stolen jefferson curl',
			targetMuscleGroup: 'Hamstrings'
		}),
		(error: unknown) => typeof error === 'object' && error !== null && 'code' in error && error.code === 'NOT_FOUND'
	);
	await assert.rejects(
		owner.customExercises.deleteById(otherCustom.id),
		(error: unknown) => typeof error === 'object' && error !== null && 'code' in error && error.code === 'NOT_FOUND'
	);
	assert.equal((await prisma.customExercise.findUnique({ where: { id: otherCustom.id } }))?.name, otherCustomName);
	assert.equal((await prisma.customExercise.findUnique({ where: { id: otherCustom.id } }))?.userId, otherUserId);

	await page.goto('/exercises');
	await expect(page.getByRole('heading', { name: ownerCustomName, exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Barbell bench press', exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { name: otherCustomName, exact: true })).toHaveCount(0);

	await page.getByPlaceholder('Search exercises').fill(otherCustomName);
	await expect(page.getByRole('heading', { name: ownerCustomName, exact: true })).toHaveCount(0);
	await expect(page.getByRole('heading', { name: otherCustomName, exact: true })).toHaveCount(0);
	await expect(page.getByText('No matching exercises')).toBeVisible();
});
