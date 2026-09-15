import { useEffect } from 'react';

export default function Lightbox({ images, index, onClose, onIndexChange }) {
  const open = index >= 0 && images.length > 0;
  const move = (delta) => onIndexChange((index + delta + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open, index, images.length]);

  if (!open) return null;
  return (
    <div className="lightbox open" aria-hidden="false" onClick={onClose}>
      <button className="lightbox-close" type="button" aria-label="Close image" onClick={(e) => {e.stopPropagation();onClose();}}>×</button>
      <button className="lightbox-nav lightbox-prev" type="button" aria-label="Previous image" onClick={(e) => {e.stopPropagation();move(-1);}}>←</button>
      <img src={images[index].url} alt={images[index].alt || 'Gallery image'} onClick={(e) => e.stopPropagation()} />
      <button className="lightbox-nav lightbox-next" type="button" aria-label="Next image" onClick={(e) => {e.stopPropagation();move(1);}}>→</button>
    </div>
  );
}
