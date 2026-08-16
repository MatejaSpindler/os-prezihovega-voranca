import holidayData from '../data/slovenian-holidays.json' with { type: 'json' };

const SCHOOL_TIME_ZONE = 'Europe/Ljubljana';
const CANCELLATION_EMAIL = 'info@o-pvoranca.mb.edus.si';
const publicHolidayMap = new Map(Object.entries(holidayData.dates));

const mealLabels = {
  lunch: 'Kosilo',
  breakfast: 'Zajtrk',
  both: 'Oboje (zajtrk in kosilo)',
};

const timeFormatter = new Intl.DateTimeFormat('sl-SI', {
  timeZone: SCHOOL_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const selectedDateFormatter = new Intl.DateTimeFormat('sl-SI', {
  timeZone: 'UTC',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

function dateParts(date) {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en', {
      timeZone: SCHOOL_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date).map(({ type, value }) => [type, value]),
  );
}

function timeParts(date) {
  return Object.fromEntries(
    timeFormatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );
}

function parseDateIso(dateIso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  const valid = date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;

  return valid ? { date, year } : null;
}

export function getSchoolTodayIso(date = new Date()) {
  const parts = dateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getCancellationState(date = new Date()) {
  const parts = timeParts(date);
  const hour = Number(parts.hour);

  return {
    open: hour < 8,
    timeLabel: `${parts.hour}.${parts.minute}`,
    todayIso: getSchoolTodayIso(date),
  };
}

export function formatCancellationDate(dateIso) {
  const parsed = parseDateIso(dateIso);
  return parsed ? selectedDateFormatter.format(parsed.date) : '';
}

export function getHolidayCalendarEndDate() {
  return holidayData.endDate;
}

export function getDateAvailability(dateIso, now = new Date()) {
  const parsed = parseDateIso(dateIso);
  if (!parsed) return { available: false, code: 'invalid', label: 'Neveljaven datum.' };

  const current = getCancellationState(now);
  if (dateIso < current.todayIso) {
    return { available: false, code: 'past', label: 'Preteklih datumov ni mogoče izbrati.' };
  }

  const day = parsed.date.getUTCDay();
  if (day === 0 || day === 6) {
    return { available: false, code: 'weekend', label: 'Ob koncu tedna ni šolske prehrane.' };
  }

  const holidayName = publicHolidayMap.get(dateIso);
  if (holidayName) {
    return { available: false, code: 'holiday', label: holidayName };
  }

  if (dateIso === current.todayIso && !current.open) {
    return {
      available: false,
      code: 'cutoff',
      label: `Rok za današnjo odjavo je ob 8.00 potekel. Trenutni čas: ${current.timeLabel}.`,
    };
  }

  return {
    available: true,
    code: dateIso === current.todayIso ? 'today' : 'future',
    label: dateIso === current.todayIso
      ? `Današnjo prehrano lahko odjavite do 8.00. Trenutni čas: ${current.timeLabel}.`
      : `Odjava je mogoča za ${formatCancellationDate(dateIso)}.`,
  };
}

export function buildCancellationMailto({ studentName, className, cancellationDate, meal }) {
  const dateLabel = formatCancellationDate(cancellationDate);
  const mealLabel = mealLabels[meal] ?? mealLabels.lunch;
  const subject = `Odjava prehrane za ${dateLabel} - ${studentName}`;
  const body = [
    'Pozdravljeni,',
    '',
    `prosim za odjavo prehrane za ${dateLabel}.`,
    '',
    `Ime in priimek učenca: ${studentName}`,
    `Razred: ${className}`,
    `Obrok: ${mealLabel}`,
    `Datum odjave: ${dateLabel}`,
    '',
    'Hvala in lep pozdrav.',
  ].join('\n');

  return `mailto:${CANCELLATION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
