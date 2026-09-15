import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";

export default function BookingModal({
  cabin,
  cabins,
  form,
  state,
  minDate,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!cabin) return null;

  const availableCabins = cabins.filter(
    (item) => item.availability === "available"
  );

  return (
    <div
      className="modal open"
      id="cabinModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onMouseDown={(event) => {
        if (event.target.id === "cabinModal") {
          onClose();
        }
      }}
    >
      <div className="modal-card">
        <div className="modal-grid">
          {/* CABIN IMAGE */}
          <div className="modal-photo">
            <img
              src={cabin.imageUrl}
              alt={`Cabin ${cabin.code}`}
            />
          </div>

          {/* CABIN DETAILS + FORM */}
          <div className="modal-body">
            <button
              className="modal-close"
              type="button"
              aria-label="Close booking modal"
              onClick={onClose}
            >
              ×
            </button>

            <div className="eyebrow">
              Cabin Details
            </div>

            <h2 id="booking-modal-title">
              Cabin {cabin.code}
            </h2>

            <p>
              Enjoy a comfortable private space at Lily
              Cafe & Restaurant for dining, conversations,
              gatherings and special moments.
            </p>

            {/* CABIN FACTS */}
            <div className="modal-facts">
              <div className="modal-fact">
                <small>Cabin</small>
                <strong>
                  {cabin.code}
                </strong>
              </div>

              <div className="modal-fact">
                <small>Capacity</small>
                <strong>
                  {cabin.capacity}
                </strong>
              </div>

              {cabin.features && (
                <div
                  className="modal-fact"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <small>Features</small>

                  <strong>
                    {cabin.features.replaceAll(
                      "|",
                      " · "
                    )}
                  </strong>
                </div>
              )}
            </div>

            <div className="eyebrow booking-form-title">
              Request Booking
            </div>

            <form
              className="form-grid booking-form-grid"
              onSubmit={onSubmit}
            >
              {/* CABIN */}
              <label className="booking-field">
                <span>Cabin</span>

                <select
                  className="field"
                  name="cabinCode"
                  value={form.cabinCode}
                  onChange={(event) =>
                    onChange(
                      "cabinCode",
                      event.target.value
                    )
                  }
                >
                  {availableCabins.map((item) => (
                    <option
                      key={item.code}
                      value={item.code}
                    >
                      Cabin {item.code}
                    </option>
                  ))}
                </select>
              </label>

              {/* FULL NAME */}
              <label className="booking-field">
                <span>Full name</span>

                <input
                  className="field"
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={(event) =>
                    onChange(
                      "fullName",
                      event.target.value
                    )
                  }
                />
              </label>

              {/* EMAIL */}
              <label className="booking-field">
                <span>Email</span>

                <input
                  className="field"
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) =>
                    onChange(
                      "email",
                      event.target.value
                    )
                  }
                />
              </label>

              {/* PHONE */}
              <label className="booking-field">
                <span>Phone</span>

                <input
                  className="field"
                  required
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(event) =>
                    onChange(
                      "phone",
                      event.target.value
                    )
                  }
                />
              </label>

              {/* DATE */}
              <div className="booking-field">
                <span>Date</span>

                <DatePicker
                  value={form.date}
                  minDate={minDate}
                  onChange={(value) =>
                    onChange("date", value)
                  }
                />
              </div>

              {/* TIME */}
              <div className="booking-field">
                <span>Time</span>

                <TimePicker
                  value={form.time}
                  onChange={(value) =>
                    onChange("time", value)
                  }
                />
              </div>

              {/* GUESTS */}
              <label className="booking-field">
                <span>Guests</span>

                <input
                  className="field"
                  required
                  type="number"
                  min="1"
                  max="50"
                  inputMode="numeric"
                  placeholder="Number of guests"
                  value={form.guests}
                  onChange={(event) =>
                    onChange(
                      "guests",
                      event.target.value
                    )
                  }
                />
              </label>

              {/* SPECIAL REQUEST */}
              <label className="booking-field full">
                <span>Special request</span>

                <textarea
                  className="field textarea"
                  maxLength="1000"
                  placeholder="Occasion or special request (optional)"
                  value={form.specialRequest}
                  onChange={(event) =>
                    onChange(
                      "specialRequest",
                      event.target.value
                    )
                  }
                />
              </label>

              {/* ERROR */}
              {state.error && (
                <p
                  className="full booking-form-message error"
                  role="alert"
                >
                  {state.error}
                </p>
              )}

              {/* SUCCESS */}
              {state.message && (
                <p
                  className="full booking-form-message success"
                  role="status"
                >
                  {state.message}
                </p>
              )}

              {/* SUBMIT */}
              <button
                className="btn btn-gold full"
                type="submit"
                disabled={state.loading}
              >
                {state.loading
                  ? "Sending..."
                  : "Request Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}