import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { fallbackGallery } from '../data/fallback';
import Lightbox from '../components/Lightbox';

const FoodIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10m0 0v11M9.5 3v4.5A2.5 2.5 0 0 1 7 10M16 3v18M16 3c2.5 1.5 3.5 4.5 3 7.5-.4 2.1-1.5 3.5-3 4.2" /></svg>;
const CabinIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V8l8-5 8 5v13M8 21v-8h8v8M9 9h6" /></svg>;
const MoodIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M5.6 5.6 7 7m10-1.4L15.6 7M4 12h2m12 0h2M8 16h8M9 20h6M8 12a4 4 0 1 1 8 0c0 1.8-.8 2.8-1.8 3.8H9.8C8.8 14.8 8 13.8 8 12Z" /></svg>;
const HeartIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" /></svg>;

export default function Home() {
  const [gallery, setGallery] = useState(fallbackGallery);
  const [lightbox, setLightbox] = useState(-1);
  useEffect(() => { api.get('/gallery').then(({ data }) => { setGallery(data.images || []); }).catch(() => { }); }, []);
  const picks = gallery.slice(0, 4);
  return <main>
    <section className="hero hero-v3"><div className="hero-media">
      <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=92" alt="Warm restaurant interior" />
    </div><div className="container hero-content"><div className="eyebrow">Welcome to Lily Cafe & Restaurant</div>
        <h1 className="display h1">A Place Made for<br /><span className="gold">Good Food</span> &amp;<br />Beautiful Moments</h1>
        <p className="hero-copy">Warm food, thoughtful service and private spaces for the moments you actually want to remember.</p>
        <div className="hero-actions"><Link className="btn btn-gold btn-arrow" to="/menu">Explore Our Menu</Link><Link className="btn btn-ghost btn-arrow" to="/cabins">Book Cabin</Link></div></div></section>

    <section className="why-us-section"><div className="container why-us-grid"><div className="why-us-intro reveal">
      <div className="eyebrow">Why us</div><h2 className="display h3">The small details make the whole evening feel better.</h2>
      <p>Nothing loud or over designed. Just good food, privacy when you want it and a warm room that lets you settle in.</p></div><div className="why-us-list reveal">
        <article className="why-us-item"><span className="why-icon"><FoodIcon /></span><div><h3>Thoughtful Food</h3>
          <p>Comforting dishes, prepared with care and served without fuss.</p></div></article>
        <article className="why-us-item"><span className="why-icon"><CabinIcon /></span><div><h3>Private Cabins</h3><p>Five spaces - C1 to C5 - for dates, families and celebrations.</p></div></article>
        <article className="why-us-item"><span className="why-icon"><MoodIcon /></span><div><h3>Cozy Atmosphere</h3><p>Warm light, quiet corners and enough space to settle in.</p></div></article>
        <article className="why-us-item"><span className="why-icon"><HeartIcon /></span><div><h3>Warm Hospitality</h3><p>Friendly service that feels attentive, never overdone.</p></div></article>
      </div></div></section>

    <section className="section home-story"><div className="container home-story-grid"><div className="story-visual reveal"><div className="story-visual-main"><img src="/assets/photos/terrace.webp" alt="Dining at Lily" /></div><div className="story-visual-detail"><img src="/assets/photos/latte-glass.webp" alt="Coffee at Lily" /></div></div><div className="home-story-copy reveal"><div className="eyebrow">About Lily</div><h2 className="display h2">A restaurant that feels considered, not complicated.</h2><p className="lead">Lily is built around how people actually spend time together: sharing food, talking over coffee, celebrating something small or taking a private cabin when the evening deserves its own space.</p><p className="lead story-small">The atmosphere is warm, the design is calm, and the experience is meant to feel special without becoming formal.</p><Link className="btn btn-gold btn-arrow" to="/about">Read Our Story</Link></div></div></section>

    <section className="section section-dark mood-section"><div className="container"><div className="mood-heading reveal"><div><div className="eyebrow">Made for every mood</div><h2 className="display h2">The same place,<br />for very different evenings.</h2></div><p>Come for a quiet coffee, dinner with family, a date or a private celebration. Lily changes with the occasion without losing its character.</p></div><div className="mood-panels reveal"><article className="mood-panel"><img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=90" alt="Private dining" /><div><span>PRIVATE</span><h3>Private Dining</h3><p>Comfort, privacy and room for the conversation.</p></div></article><article className="mood-panel"><img src="/assets/photos/chilli-platter.webp" alt="Food" /><div><span>TABLE</span><h3>Good Food</h3><p>Familiar flavors, generous portions and a menu made for sharing.</p></div></article><article className="mood-panel"><img src="/assets/photos/coffee-tray.webp" alt="Coffee" /><div><span>COFFEE</span><h3>Slow Coffee</h3><p>For catching up, slowing down or simply staying a little longer.</p></div></article></div></div></section>

    <section className="cinematic lily-feeling"><img src="/assets/photos/family-celebration.webp" alt="Restaurant ambience" /><div className="container reveal"><div className="eyebrow" style={{ justifyContent: 'center' }}>The Lily Feeling</div><h2 className="display h2">Good food brings people together.</h2><p className="cinematic-copy">And the right space makes people want to stay.</p><Link className="btn btn-gold btn-arrow" to="/cabins">Plan Your Evening</Link></div></section>

    <section className="section gallery-home"><div className="container"><div className="gallery-home-head reveal"><div><div className="eyebrow">Moments at Lily</div><h2 className="display h2">See the atmosphere,<br />not just the tables.</h2></div></div><div className="gallery-editorial reveal">{picks.map((img, i) => <button key={img._id || i} type="button" className={`gallery-editorial-item lightbox-trigger ${i === 0 ? 'tall' : ''} ${i === 3 ? 'wide' : ''}`} onClick={() => setLightbox(i)}><img src={img.url} alt={img.alt} /></button>)}</div><div className="gallery-home-cta reveal"><Link className="btn btn-gold btn-arrow" to="/gallery">Open Gallery</Link></div></div></section>
    <Lightbox images={picks} index={lightbox} onClose={() => setLightbox(-1)} onIndexChange={setLightbox} />
  </main>;
}
