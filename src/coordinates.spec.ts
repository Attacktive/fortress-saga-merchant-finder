import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCoordinatesAt } from './coordinates.js';

// Those are absolutely fixed values so forgive me for repeating my self. 🙏
const ANCHOR = Date.parse('2025-12-19T03:00:00Z');
const STEP_MILLIS = 6 * 60 * 60 * 1000;
const COORDINATES_COUNT = 119;

afterEach(() => vi.restoreAllMocks());

describe(
	'getLastCoordinates',
	() => {
		it(
			'returns the same coordinates within one step window',
			() => {
				const base = ANCHOR + STEP_MILLIS * 5;

				const coordinates1 = getCoordinatesAt(base);
				const coordinates2 = getCoordinatesAt(base + STEP_MILLIS / 2);

				expect(coordinates1).toBe(coordinates2);
			}
		);

		it(
			'advances by one step after STEP_MILLIS',
			() => {
				const base = ANCHOR + STEP_MILLIS * 7;

				const currentCoordinates = getCoordinatesAt(base);
				const nextCoordinates = getCoordinatesAt(base + STEP_MILLIS);

				expect(currentCoordinates).not.toBe(nextCoordinates);
			}
		);

		it(
			'eventually repeats after enough steps',
			() => {
				const seen = new Set<string>();

				for (let i = 0; i < COORDINATES_COUNT + 1; i++) {
					const value = getCoordinatesAt(ANCHOR + i * STEP_MILLIS);

					if (seen.has(value)) {
						expect(seen.size).toBeGreaterThan(1);
						return;
					}

					seen.add(value);
				}

				throw new Error('no repetition detected — cycle is broken');
			}
		);

		it(
			'handles times before anchor without crashing',
			() => expect(() => getCoordinatesAt(ANCHOR - STEP_MILLIS * 10)).not.toThrow()
		);

		it(
			'cron safety offset does not advance the step prematurely',
			() => {
				const boundary = ANCHOR + STEP_MILLIS * 3;

				const coordinates1 = getCoordinatesAt(boundary - 1);
				const coordinates2 = getCoordinatesAt(boundary + 1);

				expect(coordinates1).toBe(coordinates2);
			}
		);
	}
);
