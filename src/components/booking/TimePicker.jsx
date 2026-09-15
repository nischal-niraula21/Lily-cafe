import { useEffect, useMemo, useRef, useState } from 'react';
import { Clock3 } from 'lucide-react';
import {
  formatTime12Hour,
  parse24HourTime,
  to24HourTime,
} from '../../utils/dateTime';

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);

function getHourPosition(hour) {
  const angle = ((hour % 12) * 30 - 90) * (Math.PI / 180);
  return {
    left: `${50 + Math.cos(angle) * 38}%`,
    top: `${50 + Math.sin(angle) * 38}%`,
  };
}

export default function TimePicker({ value, onChange }) {
  const wrapperRef = useRef(null);
  const parsed = useMemo(() => parse24HourTime(value), [value]);
  const [open, setOpen] = useState(false);

  const hour = parsed?.hour12 ?? 7;
  const minute = parsed?.minute ?? 0;
  const period = parsed?.period ?? 'PM';

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

  const updateTime = (
    nextHour = hour,
    nextMinute = minute,
    nextPeriod = period
  ) => {
    onChange(to24HourTime(nextHour, nextMinute, nextPeriod));
  };

  const roundedMinute = Math.round(minute / 5) * 5 % 60;
  const hourAngle = (hour % 12) * 30 + roundedMinute * 0.5;
  const minuteAngle = roundedMinute * 6;

  return (
    <div className="booking-picker" ref={wrapperRef}>
      <button
        className={`booking-picker-trigger ${value ? 'has-value' : ''}`}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Clock3 size={18} aria-hidden="true" />
        <span>{value ? formatTime12Hour(value) : 'Select time'}</span>
      </button>

      {open && (
        <div
          className="booking-popover time-popover"
          role="dialog"
          aria-label="Choose booking time"
        >
          <div className="time-popover-title">
            <span>Pick a time</span>
            <strong>{formatTime12Hour(to24HourTime(hour, roundedMinute, period))}</strong>
          </div>

          <div className="analog-clock" aria-label={`Selected hour ${hour}`}>
            <span className="clock-ring" />
            <span className="clock-center" />
            <span
              className="clock-hand hour-hand"
              style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
            />
            <span
              className="clock-hand minute-hand"
              style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
            />

            {HOURS.map((number) => (
              <button
                type="button"
                key={number}
                className={`clock-hour ${hour === number ? 'selected' : ''}`}
                style={getHourPosition(number)}
                onClick={() => updateTime(number, roundedMinute, period)}
                aria-label={`Select ${number} o'clock`}
              >
                {number}
              </button>
            ))}
          </div>

          <div className="time-controls">
            <label>
              <span>Minute</span>
              <select
                value={roundedMinute}
                onChange={(event) =>
                  updateTime(hour, Number(event.target.value), period)
                }
              >
                {MINUTES.map((item) => (
                  <option key={item} value={item}>
                    {String(item).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>AM / PM</span>
              <select
                value={period}
                onChange={(event) =>
                  updateTime(hour, roundedMinute, event.target.value)
                }
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            className="time-picker-done"
            onClick={() => {
              if (!value) updateTime(hour, roundedMinute, period);
              setOpen(false);
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
