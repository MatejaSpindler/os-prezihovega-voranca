import assert from 'node:assert/strict';
import {
  buildCancellationMailto,
  getCancellationState,
} from '../src/scripts/meal-cancellation.mjs';

const beforeCutoff = new Date('2026-08-16T05:59:00Z');
const atCutoff = new Date('2026-08-16T06:00:00Z');
const winterBeforeCutoff = new Date('2026-01-15T06:59:00Z');

assert.equal(getCancellationState(beforeCutoff).open, true, '07.59 should be open');
assert.equal(getCancellationState(atCutoff).open, false, '08.00 should be closed');
assert.equal(getCancellationState(winterBeforeCutoff).open, true, '07.59 winter time should be open');

const mailto = buildCancellationMailto({
  studentName: 'Ana Novak',
  className: '5. a',
  date: beforeCutoff,
});

assert.match(mailto, /^mailto:info@o-pvoranca\.mb\.edus\.si\?/);
assert.match(decodeURIComponent(mailto), /Ime in priimek učenca: Ana Novak/);
assert.match(decodeURIComponent(mailto), /Razred: 5\. a/);

console.log('Meal cancellation cutoff and email tests passed.');
