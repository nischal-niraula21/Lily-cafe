export default function AdminPageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[.25em] text-[#d9ad5f]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-serif text-4xl">{title}</h1>
        {description && <p className="mt-2 text-stone-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
