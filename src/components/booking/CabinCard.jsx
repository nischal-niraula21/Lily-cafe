function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20v-2.2A4.8 4.8 0 0 1 8.3 13h1.4a4.8 4.8 0 0 1 4.8 4.8V20M16 5.5a3 3 0 0 1 0 5.8M16.2 14a4.6 4.6 0 0 1 4.3 4.6V20" />
    </svg>
  );
}

export default function CabinCard({ cabin, bookingEnabled, onBook }) {
  const available = cabin.availability === 'available';
  const canBook = available && bookingEnabled;

  const statusLabel = !bookingEnabled
    ? 'Booking Offline'
    : available
      ? 'Available'
      : 'Unavailable';

  return (
    <article
      className={`cabin-v4-card reveal visible ${!available ? 'is-unavailable' : ''}`}
    >
      <div className="cabin-v4-media">
        <img src={cabin.imageUrl} alt={`Cabin ${cabin.code}`} />

        <span
          className={`cabin-status ${!available || !bookingEnabled ? 'unavailable' : ''}`}
        >
          {statusLabel}
        </span>

        <div className="cabin-v4-code">
          <small>Cabin</small>
          <strong>{cabin.code}</strong>
        </div>
      </div>

      <div className="cabin-v4-body">
        <h3>{cabin.name}</h3>

        <div className="cabin-capacity">
          <span>
            <PeopleIcon />
          </span>
          <span>Seats {cabin.capacity}</span>
        </div>

        <button
          className="cabin-book-button"
          type="button"
          disabled={!canBook}
          onClick={() => onBook(cabin)}
        >
          {!bookingEnabled
            ? 'Booking Offline'
            : available
              ? 'Book Now'
              : 'Unavailable'}
        </button>
      </div>
    </article>
  );
}
