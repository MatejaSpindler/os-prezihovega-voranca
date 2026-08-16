const SCHOOL_TIME_ZONE = 'Europe/Ljubljana';
const CANCELLATION_EMAIL = 'info@o-pvoranca.mb.edus.si';

const timeFormatter = new Intl.DateTimeFormat('sl-SI', {
  timeZone: SCHOOL_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const dateFormatter = new Intl.DateTimeFormat('sl-SI', {
  timeZone: SCHOOL_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

function timeParts(date) {
  return Object.fromEntries(
    timeFormatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );
}

export function getCancellationState(date = new Date()) {
  const parts = timeParts(date);
  const hour = Number(parts.hour);

  return {
    open: hour < 8,
    timeLabel: `${parts.hour}.${parts.minute}`,
    dateLabel: dateFormatter.format(date),
  };
}

export function buildCancellationMailto({ studentName, className, date = new Date() }) {
  const { dateLabel } = getCancellationState(date);
  const subject = `Odjava prehrane za danes - ${studentName}`;
  const body = [
    'Pozdravljeni,',
    '',
    `prosim za odjavo prehrane za danes, ${dateLabel}.`,
    '',
    `Ime in priimek učenca: ${studentName}`,
    `Razred: ${className}`,
    '',
    'Hvala in lep pozdrav.',
  ].join('\n');

  return `mailto:${CANCELLATION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
