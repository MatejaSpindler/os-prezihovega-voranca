import assert from 'node:assert/strict';
import {
  buildCancellationMailto,
  getCancellationState,
  getDateAvailability,
  getSchoolTodayIso,
} from '../src/scripts/meal-cancellation.mjs';

const beforeCutoff = new Date('2026-08-18T05:59:00Z');
const atCutoff = new Date('2026-08-18T06:00:00Z');
const winterBeforeCutoff = new Date('2026-01-15T06:59:00Z');

assert.equal(getCancellationState(beforeCutoff).open, true, '07.59 should be open');
assert.equal(getCancellationState(atCutoff).open, false, '08.00 should be closed');
assert.equal(getCancellationState(winterBeforeCutoff).open, true, '07.59 winter time should be open');
assert.equal(getSchoolTodayIso(beforeCutoff), '2026-08-18');

assert.equal(getDateAvailability('2026-08-18', beforeCutoff).available, true, 'today before 08.00 should be available');
assert.equal(getDateAvailability('2026-08-18', atCutoff).code, 'cutoff', 'today at 08.00 should be blocked');
assert.equal(getDateAvailability('2026-08-19', atCutoff).available, true, 'a future weekday should remain available');
assert.equal(getDateAvailability('2026-08-22', atCutoff).code, 'weekend', 'Saturday should be blocked');
assert.equal(getDateAvailability('2026-12-25', atCutoff).code, 'holiday', 'Christmas should be blocked');
assert.equal(getDateAvailability('2026-04-06', new Date('2026-04-01T10:00:00Z')).code, 'holiday', 'Easter Monday should be blocked');
assert.equal(getDateAvailability('2026-06-08', new Date('2026-06-01T10:00:00Z')).available, true, 'a working-day observance should remain available');
assert.equal(getDateAvailability('2026-08-17', atCutoff).code, 'past', 'past dates should be blocked');

const mailto = buildCancellationMailto({
  studentName: 'Ana Novak',
  className: '5. a',
  cancellationDate: '2026-08-19',
  meal: 'both',
});

const decodedMailto = decodeURIComponent(mailto);
assert.match(mailto, /^mailto:info@o-pvoranca\.mb\.edus\.si\?/);
assert.match(decodedMailto, /Ime in priimek učenca: Ana Novak/);
assert.match(decodedMailto, /Razred: 5\. a/);
assert.match(decodedMailto, /Obrok: Oboje \(zajtrk in kosilo\)/);
assert.match(decodedMailto, /Datum odjave: 19\. 08\. 2026/);

console.log('Meal date, holiday, cutoff, selection, and email tests passed.');
