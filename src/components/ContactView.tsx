import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, Check, Clock, Globe, ShieldAlert } from 'lucide-react';

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Gourmet Culinary Purchase',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: 'Gourmet Culinary Purchase',
        phone: '',
        message: ''
      });
    }, 5000);
  };

  return (
    <div id="contact-view-container" className="font-sans bg-ivory pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Banner Section */}
        <div id="contact-banner" className="relative h-64 rounded-none overflow-hidden bg-forest flex items-center p-8 md:p-16 border border-gold/20 shadow-xl">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1200")' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent" />
          <div className="relative space-y-3 z-10 text-white max-w-xl">
            <span className="text-xs uppercase tracking-luxury text-gold font-bold">CUSTOMER CARE</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-none">The Colombo Concierge</h1>
            <p className="text-xs md:text-sm text-ivory/75 font-light leading-relaxed">
              Have questions regarding spice compounds, single-estate harvests, or custom export freight? Contact our elite botanical team directly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sourcing form (Col 7) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-none border border-gold/15 shadow-lg space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif font-bold text-2xl text-forest">Dispatch an Inquiry</h2>
              <p className="text-xs text-charcoal/50 uppercase tracking-luxury font-light">Prepare a direct proposal to our curation board</p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-gold/10 border border-gold text-gold rounded-none flex items-center justify-center mx-auto">
                  <Check size={32} className="animate-bounce" />
                </div>
                <h3 className="font-serif font-bold text-xl text-forest">Message Dispatched</h3>
                <p className="text-xs text-charcoal/60 leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your inquiry has been routed to the appropriate concierge officer. You will receive an official response within 4 hours.
                </p>
                <p className="text-[10px] font-mono text-gold font-bold">Inquiry ID: CEYCARE-{Math.floor(Math.random() * 90000) + 10000}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-forest uppercase">Your Name</label>
                    <input
                      type="text" required placeholder="Sienna"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-forest uppercase">Your Email</label>
                    <input
                      type="email" required placeholder="sienna@gourmet.com"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-forest uppercase">Phone Number</label>
                    <input
                      type="tel" placeholder="+1 (555) 790-2300"
                      value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-forest uppercase">Inquiry Subject</label>
                    <select
                      value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold"
                    >
                      <option>Gourmet Culinary Purchase</option>
                      <option>B2B Wholesale / Export Inquiry</option>
                      <option>Single Estate Traceability Report</option>
                      <option>Press & Collaboration Proposals</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest uppercase">Detailed Message</label>
                  <textarea
                    rows={5} required
                    placeholder="Tell us about your culinary needs, bulk volume requirements, or desired organic certifications."
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-2.5 bg-ivory rounded-none border border-gold/15 focus:outline-none focus:ring-1 focus:ring-gold text-xs leading-relaxed"
                  />
                </div>

                <button
                  id="btn-submit-contact"
                  type="submit"
                  className="w-full py-3.5 bg-forest hover:bg-gold text-white hover:text-forest text-xs uppercase tracking-luxury font-bold rounded-none transition-all shadow border border-forest hover:border-gold flex items-center justify-center gap-1.5"
                >
                  <Send size={12} />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}

          </div>

          {/* Sourcing details & map (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct details */}
            <div className="bg-white p-6 rounded-none border border-gold/15 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-forest">Corporate Coordinates</h3>
              <div className="space-y-3.5 text-xs text-charcoal/70">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gold shrink-0 mt-0.5" size={16} />
                  <span>
                    <strong>Colombo Flag HQ:</strong><br />
                    75 Galle Face Centre Rd, Colombo 00300, Sri Lanka
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-gold shrink-0 mt-0.5" size={16} />
                  <span>
                    <strong>Operating Hours:</strong><br />
                    Monday – Friday: 9:00 AM – 6:00 PM (GMT +5:30)<br />
                    Saturday: 9:00 AM – 1:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gold" size={16} />
                  <span>+94 (11) 790-2300</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-gold" size={16} />
                  <span>concierge@ceyvana.com</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="bg-forest text-ivory p-6 rounded-none border border-gold/30 shadow-lg text-center space-y-4">
              <span className="text-[9px] uppercase tracking-luxury text-gold block">LIVE ASSISTANCE</span>
              <h4 className="font-serif font-bold text-lg text-white">Need Immediate Help?</h4>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                Chat directly via WhatsApp with our Colombo Flagship Manager to receive custom quotes, bulk listings, or check shipment progress.
              </p>
              <a
                href="https://wa.me/94770000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold hover:bg-white text-forest hover:text-forest px-6 py-2.5 rounded-none text-[10px] uppercase tracking-luxury font-bold transition-all shadow-md"
              >
                <Phone size={12} />
                <span>Launch WhatsApp Live Chat</span>
              </a>
            </div>

          </div>

        </div>

        {/* Dynamic Vector SVG Map representing Sri Lankan hubs */}
        <section className="bg-forest p-8 rounded-none border border-gold/30 shadow-xl space-y-6 text-ivory text-center">
          <div className="space-y-1">
            <Globe className="text-gold mx-auto animate-spin" size={24} />
            <h3 className="font-serif font-bold text-xl">Highland Sourcing Stations</h3>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Sovereign estate nodes & laboratories across Sri Lanka</p>
          </div>

          <div className="flex justify-center">
            <svg viewBox="0 0 400 500" className="w-full max-w-sm text-gold" style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.3))' }} aria-label="CEYVANA local stations map">
              {/* Island Contour outline */}
              <path d="M 170 80 Q 240 100 240 200 Q 250 300 230 400 Q 180 430 160 380 Q 140 300 130 200 Q 130 110 170 80" fill="rgba(255,255,255,0.03)" stroke="#C7A44B" strokeWidth="1.5" />
              
              {/* Grid lines */}
              <line x1="50" y1="250" x2="350" y2="250" stroke="rgba(251,248,243,0.05)" strokeDasharray="3,3" />
              <line x1="200" y1="50" x2="200" y2="450" stroke="rgba(251,248,243,0.05)" strokeDasharray="3,3" />

              {/* Station 1: Colombo Flag HQ (Coast) */}
              <circle cx="150" cy="350" r="6" fill="#C7A44B" className="animate-ping" />
              <circle cx="150" cy="350" r="4" fill="#FAF8F3" />
              <text x="135" y="354" fill="#FAF8F3" fontSize="9" textAnchor="end" fontWeight="bold">Colombo Flag HQ</text>

              {/* Station 2: Matale Processing Sifting gardens (Center) */}
              <circle cx="190" cy="270" r="5" fill="#C7A44B" />
              <text x="202" y="274" fill="#C7A44B" fontSize="9" textAnchor="start" fontWeight="bold">Matale Sorting Gardens</text>
              <line x1="150" y1="350" x2="190" y2="270" stroke="rgba(199,164,75,0.3)" strokeWidth="1" strokeDasharray="3,3" />

              {/* Station 3: Kandy Highland Estate (Lower center) */}
              <circle cx="185" cy="310" r="5" fill="#C7A44B" />
              <text x="197" y="314" fill="#FAF8F3" fontSize="9" textAnchor="start">Kandy Estate</text>
              <line x1="190" y1="270" x2="185" y2="310" stroke="rgba(199,164,75,0.3)" strokeWidth="1" />

              {/* Station 4: Trincomalee Port (North-East coast) */}
              <circle cx="215" cy="190" r="5" fill="#C7A44B" />
              <text x="227" y="194" fill="rgba(255,255,255,0.6)" fontSize="8" textAnchor="start">Trincomalee Export Port</text>
              <line x1="190" y1="270" x2="215" y2="190" stroke="rgba(199,164,75,0.2)" strokeWidth="1" strokeDasharray="3,3" />
            </svg>
          </div>
        </section>

      </div>
    </div>
  );
}
