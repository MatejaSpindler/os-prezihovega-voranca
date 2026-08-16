import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import Holidays from 'date-holidays';

const schoolTimeZone = 'Europe/Ljubljana';
const currentYear = Number(new Intl.DateTimeFormat('en', {
  timeZone: schoolTimeZone,
  year: 'numeric',
}).format(new Date()));
const startYear = 2020;
const endYear = currentYear + 10;
const calendar = new Holidays('SI');
const dates = {};

for (let year = startYear; year <= endYear; year++) {
  for (const holiday of calendar.getHolidays(year, 'sl')) {
    if (holiday.type === 'public') {
      dates[holiday.date.slice(0, 10)] = holiday.name;
    }
  }
}

const output = {
  source: 'date-holidays:SI public',
  startYear,
  endYear,
  endDate: `${endYear}-12-31`,
  dates,
};

await writeFile(
  resolve('src/data/slovenian-holidays.json'),
  JSON.stringify(output, null, 2) + '\n',
  'utf8',
);

console.log(`Generated ${Object.keys(dates).length} Slovenian work-free holiday dates through ${endYear}.`);
