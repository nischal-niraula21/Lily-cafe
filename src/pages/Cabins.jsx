import { useEffect, useMemo, useState } from "react";
import { api, getErrorMessage } from "../api/client";
import BookingModal from "../components/booking/BookingModal";
import CabinCard from "../components/booking/CabinCard";
import { fallbackCabins } from "../data/fallback";
import { getTodayInputValue } from "../utils/dateTime";

const initialForm = {
  cabinCode: "",
  fullName: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "",
  specialRequest: "",
};

function validateBookingForm(form) {
  if (
    !form.cabinCode ||
    !form.fullName.trim() ||
    !form.email.trim() ||
    !form.phone.trim() ||
    !form.date ||
    !form.time ||
    !form.guests
  ) {
    return "Please complete all required booking fields.";
  }

  const guests = Number(form.guests);

  if (!Number.isInteger(guests) || guests < 1 || guests > 50) {
    return "Guest count must be between 1 and 50.";
  }

  return "";
}

export default function Cabins() {
  const [cabins, setCabins] = useState(fallbackCabins);
  const [selected, setSelected] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [form, setForm] = useState(initialForm);

  const [state, setState] = useState({
    loading: false,
    message: "",
    error: "",
  });

  const today = useMemo(() => getTodayInputValue(), []);

  const loadCabins = async () => {
    try {
      const { data } = await api.get("/cabins");

      setApiAvailable(true);

      if (Array.isArray(data?.cabins)) {
        setCabins(data.cabins);
      }
    } catch (error) {
      setApiAvailable(false);
      console.error("Could not load cabins:", error);
    }
  };

  useEffect(() => {
    loadCabins();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && selected) {
        closeModal();
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const openCabin = (cabin) => {
    if (
      cabin.availability !== "available" ||
      !apiAvailable
    ) {
      return;
    }

    setSelected(cabin);

    setForm({
      ...initialForm,
      cabinCode: cabin.code,
    });

    setState({
      loading: false,
      message: "",
      error: "",
    });

    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelected(null);
    document.body.style.overflow = "";
  };

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (state.error) {
      setState((previous) => ({
        ...previous,
        error: "",
      }));
    }
  };

  const submitBooking = async (event) => {
    event.preventDefault();

    const validationError = validateBookingForm(form);

    if (validationError) {
      setState({
        loading: false,
        message: "",
        error: validationError,
      });

      return;
    }

    setState({
      loading: true,
      message: "",
      error: "",
    });

    try {
      const payload = {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        specialRequest: form.specialRequest.trim(),
        guests: Number(form.guests),
      };

      const { data } = await api.post(
        "/bookings",
        payload
      );

      setState({
        loading: false,
        message:
          data?.message ||
          "Booking request sent to Lily. The admin will review it.",
        error: "",
      });

      setForm((previous) => ({
        ...initialForm,
        cabinCode: previous.cabinCode,
      }));
    } catch (error) {
      console.error("Booking request failed:", error);

      setState({
        loading: false,
        message: "",
        error: getErrorMessage(
          error,
          "Could not send booking request."
        ),
      });
    }
  };

  return (
    <main>
      <section className="page-hero cabin-page-hero">
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=2400&q=92"
          alt="Private dining at Lily"
        />

        <div className="container page-hero-inner">
          <div className="cabin-hero-grid">
            <div>
              <div className="eyebrow">
                Private Cabins
              </div>

              <h1 className="display h1">
                Five cabins.
                <br />
                Your private space at Lily.
              </h1>
            </div>

            <div className="cabin-hero-note">
              <p>
                Choose any available cabin from C1 to
                C5 and send your booking request
                directly. All cabins offer a cozy and
                private space for dining, gatherings
                and special moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cabins"
        className="section cabin-v4-section"
      >
        <div className="container cabin-v4-shell">
          <div className="cabin-v4-heading reveal visible">
            <div>
              <div className="eyebrow">
                C1 — C5
              </div>

              <h2 className="display h2">
                Choose your cabin.
              </h2>
            </div>

            <p>
              Check the current availability and
              reserve the cabin that works for you.
              Each cabin is managed independently.
            </p>
          </div>

          <div className="cabin-v4-grid">
            {cabins.map((cabin) => (
              <CabinCard
                key={cabin._id || cabin.code}
                cabin={cabin}
                bookingEnabled={apiAvailable}
                onBook={openCabin}
              />
            ))}
          </div>
        </div>
      </section>

      <BookingModal
        cabin={selected}
        cabins={cabins}
        form={form}
        state={state}
        minDate={today}
        onChange={updateField}
        onClose={closeModal}
        onSubmit={submitBooking}
      />
    </main>
  );
}