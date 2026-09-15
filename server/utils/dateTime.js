const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function partsToDateString(parts) {
  const map = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export function getTodayInTimeZone(timeZone = process.env.APP_TIME_ZONE || 'Asia/Kathmandu') {
  return partsToDateString(
    new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date())
  );
}

export function isValidDateString(value) {
  if (!DATE_PATTERN.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isValidTimeString(value) {
  return TIME_PATTERN.test(value || '');
}

export function formatTime12Hour(value) {
  if (!isValidTimeString(value)) return value || '';
  const [hourValue, minute] = value.split(':').map(Number);
  const period = hourValue >= 12 ? 'PM' : 'AM';
  const hour = hourValue % 12 || 12;
  return `${hour}:${String(minute).padStart(2, '0')} ${period}`;
}

export function formatDateLong(value) {
  if (!isValidDateString(value)) return value || '';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
