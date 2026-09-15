export function pad2(value) {
  return String(value).padStart(2, '0');
}

export function toDateInputValue(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function getTodayInputValue() {
  return toDateInputValue(new Date());
}

export function parseDateInput(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function formatDateDisplay(value) {
  const date = parseDateInput(value);
  if (!date) return '';

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function to24HourTime(hour12, minute, period) {
  let hour = Number(hour12) % 12;
  if (period === 'PM') hour += 12;
  return `${pad2(hour)}:${pad2(minute)}`;
}

export function parse24HourTime(value) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value || '');
  if (!match) return null;

  const hour24 = Number(match[1]);
  const minute = Number(match[2]);
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;

  return { hour12, minute, period };
}

export function formatTime12Hour(value) {
  const parsed = parse24HourTime(value);
  if (!parsed) return '';
  return `${parsed.hour12}:${pad2(parsed.minute)} ${parsed.period}`;
}
