export default function AdminAlert({ error, message }) {
  if (!error && !message) return null;

  const isError = Boolean(error);
  return (
    <p
      className={`mb-4 rounded-xl border p-3 text-sm ${
        isError
          ? 'border-red-500/20 bg-red-500/10 text-red-300'
          : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
      }`}
      role={isError ? 'alert' : 'status'}
    >
      {error || message}
    </p>
  );
}
