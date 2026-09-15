import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  formatDateDisplay,
  parseDateInput,
  toDateInputValue,
} from '../../utils/dateTime';

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a, b) {
  return Boolean(
    a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
  );
}

export default function DatePicker({ value, onChange, minDate }) {
  const wrapperRef = useRef(null);
  const selectedDate = useMemo(() => parseDateInput(value), [value]);
  const minimumDate = useMemo(
    () => startOfDay(parseDateInput(minDate) || new Date()),
    [minDate]
  );

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(selectedDate || minimumDate)
  );

  useEffect(() => {
    if (selectedDate) setViewMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    const closeWhenOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', closeWhenOutside);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeWhenOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(viewMonth);

  const firstWeekday = viewMonth.getDay();
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0
  ).getDate();

  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const previousMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() - 1,
    1
  );
  const canGoPrevious = previousMonth >= startOfMonth(minimumDate);

  const selectDay = (day) => {
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    if (startOfDay(date) < minimumDate) return;

    onChange(toDateInputValue(date));
    setOpen(false);
  };

  return (
    <div className="booking-picker" ref={wrapperRef}>
      <button
        className={`booking-picker-trigger ${value ? 'has-value' : ''}`}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <CalendarDays size={18} aria-hidden="true" />
        <span>{value ? formatDateDisplay(value) : 'Select date'}</span>
      </button>

      {open && (
        <div
          className="booking-popover calendar-popover"
          role="dialog"
          aria-label="Choose booking date"
        >
          <div className="calendar-head">
            <button
              type="button"
              className="calendar-nav"
              aria-label="Previous month"
              disabled={!canGoPrevious}
              onClick={() => canGoPrevious && setViewMonth(previousMonth)}
            >
              <ChevronLeft size={18} />
            </button>

            <strong>{monthLabel}</strong>

            <button
              type="button"
              className="calendar-nav"
              aria-label="Next month"
              onClick={() =>
                setViewMonth(
                  new Date(
                    viewMonth.getFullYear(),
                    viewMonth.getMonth() + 1,
                    1
                  )
                )
              }
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="calendar-weekdays" aria-hidden="true">
            {WEEK_DAYS.map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {cells.map((day, index) => {
              if (!day) {
                return (
                  <span key={`empty-${index}`} className="calendar-empty" />
                );
              }

              const date = new Date(
                viewMonth.getFullYear(),
                viewMonth.getMonth(),
                day
              );
              const disabled = startOfDay(date) < minimumDate;
              const selected = sameDay(date, selectedDate);
              const today = sameDay(date, new Date());

              return (
                <button
                  key={day}
                  type="button"
                  className={`calendar-day ${selected ? 'selected' : ''} ${
                    today ? 'today' : ''
                  }`}
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
