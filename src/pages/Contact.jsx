import { useState } from 'react';
import { api, getErrorMessage } from '../api/client';

export default function Contact() {
  const [form, setForm] = useState({ fullName: '', contact: '', subject: '', message: '' });
  const [state, setState] = useState({ loading: false, message: '', error: '' });
  const submit = async (e) => { e.preventDefault(); setState({ loading: true, message: '', error: '' }); try { const { data } = await api.post('/contact', form); setState({ loading: false, message: data.message || 'Message sent.', error: '' }); setForm({ fullName: '', contact: '', subject: '', message: '' }) } catch (error) { setState({ loading: false, message: '', error: getErrorMessage(error, 'Could not send your message.') }) } };
  return <main><section className="page-hero">
    <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2200&q=90" alt="Coffee at Lily" />
    <div className="container page-hero-inner"><div className="eyebrow">Contact</div><h1 className="display h1">We'd love to welcome you.</h1>
      <p>Questions, cabin plans or celebrations - get in touch with Lily.</p></div></section>
    <section className="section"><div className="container contact-shell"><div className="contact-panel reveal"><div className="eyebrow">Visit Lily</div>
      <h2 className="display h3">Make an evening of it.</h2>
      <p className="lead">Find us in Chandragadhi, Jhapa, and plan your next meal, coffee stop or private cabin visit.</p>
      <div className="contact-details"><div className="contact-line"><small>Address</small><strong>Chandragadhi, Jhapa, Nepal</strong></div>
        <div className="contact-line"><small>Phone</small><strong>+977 981-6046936</strong></div>
        <div className="contact-line"><small>Email</small><strong>hello@lilycafe.com</strong></div>
        <div className="contact-line"><small>Hours</small><strong>9:00 AM - 10:00 PM &middot; Open Monday-Sunday</strong></div></div></div>
      <div className="contact-form reveal"><div className="contact-form-head"><div className="eyebrow">Send a Message</div>
        <h2 className="display h3">Tell us what you need.</h2>
        <p>For table questions, cabin plans or celebrations, send us a message and we'll get back to you.</p>
      </div><form className="form-grid contact-form-grid" onSubmit={submit}><label className="form-field">
        <span>Full name</span>
        <input className="field" required placeholder="Your name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
      </label><label className="form-field"><span>Email</span>
            <input className="field" required placeholder="How can we reach you?" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
          </label><label className="form-field full"><span>Subject</span><input className="field" required placeholder="What is this about?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          </label><label className="form-field full"><span>Your message</span>
            <textarea className="field textarea" required placeholder="Tell us a little more" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}>
            </textarea></label>{state.error && <p className="full booking-form-message error">{state.error}</p>}{state.message && <p className="full booking-form-message success">{state.message}</p>}
          <button className="btn btn-gold full contact-submit" type="submit" disabled={state.loading}>{state.loading ? 'Sending...' : 'Send Message'}</button>
        </form>
      </div>
    </div>

    </section>
    <section className="section" style={{ paddingTop: 0 }}><div className="container map-box map-box-google" style={{ borderRadius: 28, minHeight: 450 }}><iframe title="Lily Cafe & Restaurant location in Chandragadhi, Jhapa" src="https://www.google.com/maps?q=26.5684603,88.0660481&z=18&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen></iframe><a className="map-open-link" href="https://maps.app.goo.gl/zV1DPKWezN1pot3Z9" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a></div></section></main>
}
