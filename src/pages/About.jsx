const FoodIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10m0 0v11M9.5 3v4.5A2.5 2.5 0 0 1 7 10M16 3v18M16 3c2.5 1.5 3.5 4.5 3 7.5-.4 2.1-1.5 3.5-3 4.2" /></svg>;
const CabinIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V8l8-5 8 5v13M8 21v-8h8v8M9 9h6" /></svg>;
const MoodIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M5.6 5.6 7 7m10-1.4L15.6 7M4 12h2m12 0h2M8 16h8M9 20h6M8 12a4 4 0 1 1 8 0c0 1.8-.8 2.8-1.8 3.8H9.8C8.8 14.8 8 13.8 8 12Z" /></svg>;
const HeartIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" /></svg>;

export default function About() {
    return <main>
        <section className="page-hero about-hero"><img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2400&q=92" alt="Lily Cafe interior" />
            <div className="container page-hero-inner"><div className="eyebrow">About Lily</div><h1 className="display h1">Built for good food<br />and unhurried time.</h1><p>A warm restaurant, five private cabins and a simple idea: make people comfortable enough to stay.</p></div></section>
        <section className="section about-editorial"><div className="container about-editorial-grid"><div className="about-copy reveal">
            <div className="eyebrow">Our Story</div><h2 className="display h2">The kind of place you can use differently every time.</h2>
            <p className="lead">Some evenings call for a quick coffee. Others need a table full of food, a birthday, a family dinner or a cabin with the door closed. Lily is designed to work for all of them without feeling like several restaurants stitched together.</p>
            <p className="lead">The details stay consistent, warm lighting, comfortable seating, thoughtful food and service that knows when to be present and when to give you space.</p>
        </div><div className="about-image-stack reveal"><div className="about-image-large"><img src="/assets/photos/smallspace.webp" alt="smallspace" />
        </div><div className="about-image-small"><img src="/assets/photos/hallway.webp" alt="Interior hallway" /></div></div></div></section>
        <section className="about-values section-dark"><div className="container about-values-grid"><div className="about-values-intro reveal"><div className="eyebrow">What matters here</div><h2 className="display h3">Simple standards, kept consistently.</h2><p>We focus on the things guests actually feel while they are here: the food, the room, the privacy and the service.</p></div><div className="about-values-list reveal"><div className="about-value"><span className="why-icon"><FoodIcon /></span><div><h3>Quality Food</h3><p>Comforting dishes made with consistency, care and enough personality to remember.</p></div></div><div className="about-value"><span className="why-icon"><MoodIcon /></span><div><h3>Cozy Atmosphere</h3><p>Warm light, considered seating and a calm mood that works from coffee to dinner.</p></div></div><div className="about-value"><span className="why-icon"><CabinIcon /></span><div><h3>Private Cabins</h3><p>Five dedicated spaces - C1 through C5 - for guests who want a little more privacy.</p></div></div><div className="about-value"><span className="why-icon"><HeartIcon /></span><div><h3>Warm Hospitality</h3><p>Friendly, attentive service without unnecessary formality or pressure.</p></div></div></div></div></section>
    </main>
}
